---
title: Чиним Kafka после сбоя при перераспределении разделов
updated: 2017-12-13
---

Мы в ФБ используем [Kafka](https://kafka.apache.org) в наших проектах для надёжной очереди сообщений.
Kafka помогает нам масштабировать обработку событий между компонентами большой
системы. Пару недель назад инженер ошибся, указав несуществующий идентификатор брокера в кластере во время перераспределении разделов топика по репликам.

```
$ kafkacat -L -b localhost:9092 -t events
[...]
  topic "events" with 5 partitions:
    partition 2, leader 1008, replicas: 1007,1008, isrs: 1008,1007
    partition 4, leader 1005, replicas: 1005,1006, isrs: 1006,1005
    partition 1, leader 1007, replicas: 1007,1008, isrs: 1008,1007
    partition 3, leader 1006, replicas: 10005,1009,1006, isrs: 1006,1009
    partition 0, leader 1006, replicas: 1009,1006, isrs: 1006,1009
```

Миграция зависла на середине: ни откат, ни перезапуск, ни
повторное перераспределение по другим брокерам не помогали:

```
$ ./bin/kafka-reassign-partitions.sh --zookeeper zk1,zk2,zk3/kafka --reassignment-json-file reassign.json --verify
Status of partition reassignment:
Reassignment of partition [events,2] completed successfully
Reassignment of partition [events,0] completed successfully
Reassignment of partition [events,4] completed successfully
Reassignment of partition [events,3] is still in progress
Reassignment of partition [events,1] completed successfully
```

В тот момент сбойный брокер перестал считать метрики, а агент мониторинга стал
забирать нули из JMX-интерфейса. Несмотря на то, что всего один раздел оказался
без лидера, работа кластера была нарушена.

Очевидное решение полностью пересоздать топик не подходит: мы не хотим терять
данные. Сообщения поступают и обрабатываются круглосуточно без возможности
выделить окно для простоя. Кроме того, удаляя топик нельзя предсказать работу консьюмеров и продьюсеров. Поведение приложений зависит от реализации клиентских библиотек (преимущественно СПО), а потому плохо предсказуемо.

Сработал такой трюк. Снимаем действующую задачу в Zookeeper:

```
$ zookeeper-client
> rmr /kafka/admin/reassign_partitions
> quit
```

Устанавливаем Kafka на свободный сервер и добавляем брокер в существующий
кластер под несуществующим id.

```
$ [sudo] yum -y install kafka
$ [sudo] cat << EOF > /var/lib/kafka/meta.properties
version=0
broker.id=10005
EOF
$ [sudo] chown kafka:kafka /var/lib/kafka/meta.properties
```

Дожидаемся окончания переназначения разделов и проверяем статус задачи:

```
$ ./bin/kafka-reassign-partitions.sh --zookeeper zk1,zk2,zk3/kafka --reassignment-json-file reassign.json --verify
Status of partition reassignment:
Reassignment of partition [events,2] completed successfully
Reassignment of partition [events,0] completed successfully
Reassignment of partition [events,4] completed successfully
Reassignment of partition [events,3] completed successfully
Reassignment of partition [events,1] completed successfully
```

Дождавшись окончания, исправляем опечатку в JSON схеме миграции и удаляем
разделы с нового брокера:

```
./bin/kafka-reassign-partitions.sh --zookeeper zk1,zk2,zk3/kafka --reassignment-json-file reassign.json --execute
```

После выполнения задачи удаляем временный брокер из кластера:

```
$ [sudo] service kafka stop
# ... or just send SIGTERM signal to Kafka process

$ [sudo] yum -y remove kafka
```

Готово. Проблемный раздел достался другой доступной реплике, работа
восстановлена. Хорошим подспорьем в этой истории были графики в Grafana: без
них эта проблема могла бы ещё долго оставаться незамеченной. По этой теме
рекомендую посмотреть [слайды с презентации Gwen Shapira о мониторинге Kafka](https://www.slideshare.net/ConfluentInc/metrics-are-not-enough-monitoring-apache-kafka-and-streaming-applications).
