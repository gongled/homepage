---
title: Преобразование YAML в XML и properties в шаблонах Jinja
date: 2021-10-16
---

В работе с системами управления конфигурациями (SCM) одной из частых задач является шаблонизация (конфигурационных) файлов. К примеру, для этого Ansible и SaltStack поддерживают синтаксис шаблонов Jinja и описание конфигураций на языке YAML. В ПО, для настройки которого используют JSON, TOML или INI, YAML обычно сериализуют либо в DSL ([`file.serialize`](https://docs.saltproject.io/en/latest/ref/states/all/salt.states.file.html)) или преобразуют явно в шаблоне с помощью Jinja Filters ([`to_json`](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html)).

Однако выразительности YAML иногда бывает недостаточно. Например, конфигурации в XML или Properties в Java не (де-)сериализовать ни средствами SCM, ни самим шаблонизатором. 

Когда столкнулся с этой проблемой впервые, то решил её влоб и шаблонизировал документ целиком. Получалось примерно так, как во фрагменте ERB ниже.

```erb
<?xml version="1.0"?>
<yandex>
    <logger>
        <level><%= @config['logger']['level'] %></level>
        <log><%= @log_path %>/server.log</log>
        <errorlog><%= @log_path %>/server.err.log</errorlog>
        <size><%= @config['logger']['size'] %></size>
        <count><%= @config['logger']['count'] %></count>
    </logger>
    <% if @config['trace_log']['enable'] %>
    <trace_log>
        <database><%= @config['trace_log']['database'] %></database>
        <table><%= @config['trace_log']['table'] %></table>

        <partition_by><%= @config['trace_log']['partition_by'] %></partition_by>
        <flush_interval_milliseconds><%= @config['trace_log']['flush_interval_milliseconds'] %></flush_interval_milliseconds>
    </trace_log>
    <% end %>
</yandex>
```

Или так.

```properties
log.dirs=<%= @config['log']['dirs'] %>
log.flush.interval.messages=<%= @config['log']['flush']['interval']['messages'] %>
log.flush.interval.ms=<%= @config['log']['flush']['interval']['ms'] %>
log.retention.hours=<%= @config['log']['retention']['hours'] %>
log.segment.bytes=<%= @config['log']['segment']['bytes'] %>
log.retention.check.interval.ms=<%= @config['log']['retention']['check']['interval']['ms'] %>
log.cleaner.enable=<%= @config['log']['cleaner']['enable'] %>
```

Это хорошо работало в боевой эксплуатации несколько лет до тех пор, пока шаблон не стал таким большим, что его стало сложно поддерживать. При таком подходе быстро потерялась семантика исходной конфигурации: в итоге системному администратору сначала приходилось разбираться в том, как настроить ПО без SCM, а после – как перевести это в YAML. 

Ещё приходилось выпускать новую версию рецепта всякий раз при добавлении новой опции из-за сильной связанности рецепта и его параметров.

Облегчить процесс могла бы поддержка преобразований непосредственно в SCM, но это не кажется простым решением. При управлении конфигурациями чаще всего не нужна десериализация строки в объект. Обычно есть объект и его нужно представить в определённом формате, но не наоборот. 

Кроме того, каждый SCM предоставляет собственный механизм расширения функциональности ([Ansible Filters](https://docs.ansible.com/ansible/devel/plugins/filter.html#enabling-filter-plugins), [SaltStack Serializer Modules](https://docs.saltproject.io/en/latest/ref/serializers/all/index.html)), что делает решение непереносимым между разными управляющими узлами.

В поисках одновременно простого и лёгкого решения, остановился на шаблонизации с использованием [макросов Jinja](https://jinja.palletsprojects.com/en/3.0.x/templates/#macros).

## YAML в XML

В XML узлы поддерживают атрибуты и множественные элементы, в то время как YAML – нет. Решение этой проблемы лежит в выделении атрибутов родительского узла в отдельный ключ `xmlattributes`.

```jinja
{%- macro insert_spaces(num=0) -%}
  {%- for space in range(1,num) if num != 0 -%}
  {{ ' ' }}
  {%- endfor -%}
{%- endmacro -%}

{%- macro line_block(key, value='', params={}, spaces=0) %}
{{ insert_spaces(spaces) }}<{{ key }}{{ params|xmlattr }}>{{ value }}</{{ key }}>
{%- endmacro -%}

{%- macro dict_block(key, value, params={}, spaces=0) -%}
  {%- if value.get('xmlattributes') -%}
    {%- set params = value.get('xmlattributes') -%}
  {%- endif -%}
  {%- if value.get('value') and value.get('xmlattributes') -%}
{{ block(key=key,value=value.get('value'),params=params,spaces=spaces) }}
  {%- else %}
{{ insert_spaces(spaces) }}<{{ key }}{{ params|xmlattr }}>
  {%- for k,v in value.items() if k != 'xmlattributes' -%}
{{ insert_spaces(spaces) }}{{ block(key=k,value=v,spaces=spaces+4) }}
  {%- endfor %}
{{ insert_spaces(spaces) }}</{{ key }}>
  {%- endif -%}
{%- endmacro -%}

{%- macro block(key, value, params={}, spaces=0) -%}
  {%- if value is mapping -%}
      {{ dict_block(key=key, value=value, params=params, spaces=spaces) }}
  {%- elif value is string or value is number -%}
      {{ line_block(key=key, value=value, params=params, spaces=spaces) }}
  {%- elif value is sequence -%}
    {%- for element in value -%}
        {{ block(key=key, value=element, params=params, spaces=spaces) }}
    {%- endfor -%}
  {%- endif -%}
{%- endmacro -%}
```

Для рендера XML вызовите макрос `block`, сообщив ему имя родительского элемента, объект и число пробельных символов в отступе.

```jinja
{{ block(key=key, value=value, spaces=4) }}
```

Пример.

```yaml
zookeeper:
  node:
    - xmlattributes:
        index: 1
      host: zk-node1.example.tld
      port: 2181
    - xmlattributes:
        index: 2
      host: zk-node2.example.tld
      port: 2181
    - xmlattributes:
        index: 3
      host: zk-node3.example.tld
      port: 2181
```

Результат.

```xml
    <zookeeper>
        <node index="1">
            <host>zk-node1.example.tld</host>
            <port>2181</port>
        </node>
        <node index="2">
            <host>zk-node2.example.tld</host>
            <port>2181</port>
        </node>
        <node index="3">
            <host>zk-node3.example.tld</host>
            <port>2181</port>
        </node>
    </zookeeper>
```

## YAML в Properties

В properties-файле в качестве разделителей используются точки, но иногда для обозначения пары ключ-значение используется colon (`:`). Здесь использовал символ underscore (`_`) в начале имени ключа.

```jinja
{%- macro block(parent, dict) -%}
  {%- for k, v in dict.items() -%}
    {%- if v is mapping -%}
      {%- if parent == "" -%}
        {{ block(k, v) }}
      {%- else -%}
        {{ block(parent + "." + k, v) }}
      {%- endif -%}
    {%- else -%}

    {%- if parent == "" -%}
      {{ k }} = {{ v }}
    {%- elif k.startswith("_") -%}
      {{ parent }}:{{ k[1:] }} = {{ v }}
    {% else -%}
      {{ parent }}.{{ k }} = {{ v }}
    {% endif -%}
  {%- endif -%}
  {%- endfor -%}
{%- endmacro -%}
```

Для рендера properties вызовите макрос `block`, сообщив ему имя родительского элемента и объект.

```jinja
{{ block("", dict=value) }}
```

Пример.

```
log:
  dirs: "/var/lib/kafka"
  flush:
    interval:
      messages: 10000
      ms: 1000
  segment:
    bytes: 104857600
  retention:
    hours: 48
    check:
      interval:
        ms: 300000
  cleaner:
    enable: true
```

Результат.

```
log.dirs=/var/lib/kafka
log.flush.interval.messages=10000
log.flush.interval.ms=1000
log.retention.hours=48
log.segment.bytes=104857600
log.retention.check.interval.ms=300000
log.cleaner.enable=true
```

Просто и легко!