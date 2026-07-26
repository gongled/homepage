# Homepage Rework (Technology Leader Positioning) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перепозиционировать сайт gongled.ru с «Unit Lead / SRE» на «Technology Leader / Lead Solution Architect»: новая главная-лендинг, страница CV, обновлённые карьера, buzzwords, i18n и config — на русском и английском.

**Architecture:** Hugo (тема `themes/simple`). Весь контент CV/лендинга хранится в `data/translations/{ru-RU,en-US}.yaml` рядом с существующим `career`, шаблоны рендерят из data — RU/EN не расходятся. Два новых layout: `cv.html` и `landing.html`.

**Tech Stack:** Hugo, Go templates, Tailwind-классы темы, YAML.

**Spec:** `docs/superpowers/specs/2026-07-26-homepage-rework-design.md`

**Верификация:** команда сборки `hugo --gc --minify --cleanDestinationDir` (из Makefile) должна завершаться без ошибок; grep по сгенерированному HTML проверяет наличие ключевого контента. Тестового фреймворка в проекте нет.

**Коммиты:** не выполнять без явного запроса пользователя.

---

### Task 1: Данные лендинга и CV — русская локаль

**Files:**
- Modify: `data/translations/ru-RU.yaml` (добавить секции `landing` и `cv` после секции `career`, не трогая `career` — её обновляет Task 7)

- [ ] **Step 1: Добавить данные в конец `data/translations/ru-RU.yaml`**

```yaml
landing:
  headline: "Technology Leader: архитектура, стратегия, команды"
  metrics:
    - value: "180+"
      label: "информационных систем"
    - value: "30+"
      label: "архитекторов"
    - value: "−35%"
      label: "TCO на ИТ за 2025–2026"
    - value: "93%"
      label: "соответствие стандартам"

cv:
  roles:
    - company: "Купер"
      role: "Lead Solution Architect / CTO-функции"
      time: "сен 2025 — настоящее время"
      points:
        - "Руковожу командой из 6 solution-архитекторов и функционально веду 30+ архитекторов в продуктовых командах."
        - "Отвечаю за корпоративную архитектуру: 180+ информационных систем, 1000+ компонентов, 60+ бизнес-продуктов — прикладной и инфраструктурный слои."
        - "Спроектировал новый ИТ-ландшафт компании в Cloud.ru: бизнес-, прикладную и техническую архитектуру. Инвентаризировал системы в CMDB."
        - "Поднял зрелость архитектуры и надёжности на два уровня. Довёл соответствие корпоративным стандартам с 70% до 92%."
        - "Стандартизировал ADR и автоматизировал их создание и ревью с помощью AI: время до ревью сократилось с недели до 24 часов."
        - "Организовал архитектурный комитет и сообщество архитекторов, актуализировал технологический радар."
        - "Создал с нуля процесс управления техническим долгом и отклонениями."
        - "Сформировал ИТ-стратегию на три года совместно с CTO. Сократил TCO на ИТ на 35% за 2025–2026 год."
        - "Реорганизовал капитализацию НМА: автоматизировал учёт рабочего времени без влияния на Lead Time разработки."
        - "Объединяю архитектурные процессы (EA, ADR/RFC, технический долг) с общими ИТ-процессами: методология, работа со стейкхолдерами, портфель проектов."
        - "Веду переговоры с заказчиками, юристами и финансистами: gap-анализы, дорожные карты, организация работы команд."
    - company: "Купер"
      role: "Руководитель проекта миграции Yandex.Cloud → Cloud.ru"
      time: "мар 2025 — мар 2026"
      points:
        - "Организовал работу около 600 участников миграции."
        - "Перенёс 180+ информационных систем и 60+ бизнес-продуктов."
        - "Завершил миграцию в срок: к концу марта 2026 года перенесено 100% систем. Проект прошёл без инцидентов."
    - company: "Купер"
      role: "Руководитель юнита: платформенные и продуктовые команды"
      time: "2023–2025"
      points:
        - "Отвечал за надёжность и производительность витрины: жизненный цикл заказа, платежи, фискализация. Больше половины трафика магазина, 45+ команд."
        - "Подготовил компанию к высокому сезону: за полгода увеличил производительность в 2,2 раза при доступности 99,9%. Кросс-доменный проект на 200 участников."
        - "Организовал техническую часть ребрендинга СберМаркета в Купер: за одну ночь проект стал другим, без простоя."
        - "Провёл реинжиниринг корзины: сократил TCO в 10 раз, latency — в 4 раза до 200 мс, увеличил ёмкость с 10 до 100 rps."
        - "Ускорил SDLC: сборка быстрее на 90%, тестирование — на 50%, релизы в два раза чаще при той же доле ошибок."
        - "Ввёл SLO/SLA с нуля на 100% критичных сервисов, канареечные релизы с автоматическим откатом и DORA-мониторинг."
        - "Построил нагрузочное тестирование как методологию: тестов стало в 6 раз больше, покрытие — 92% пользовательского трафика."
        - "Перенёс витрину в PaaS без простоя. Запустил Code Push для iOS и Android: цикл мобильного релиза сократился до пары часов."
        - "Запускал продуктовые проекты в срок."
    - company: "Купер"
      role: "Senior DevOps Engineer / SRE Lead домена Customer"
      time: "2022–2023"
      points:
        - "Пришёл senior DevOps-инженером, через полгода возглавил SRE-группу домена Customer — надёжность пути покупателя в мобильном и веб-приложении."
    - company: "FunBox"
      role: "Infrastructure Engineer → Team Lead"
      time: "2015–2022"
      points:
        - "Запустил больше 10 инфраструктурных проектов: от проектирования архитектуры до передачи в эксплуатацию."
        - "Построил георезервированные кластеры Kafka (трафик свыше 1 Гбит/с) и ClickHouse. Централизованный сбор логов ускорил поиск инцидентов в 100 раз."
        - "Развернул корпоративный Kubernetes на baremetal и описал инфраструктуру как код. Внедрил мониторинг на VictoriaMetrics и сбор журналов на Vector и Loki."
        - "Развивал DevRel: организовал площадку для митапов, помогал строить HR-бренд компании."
    - company: "Simtech Group / Simtech Development"
      role: "Системный администратор, руководитель хостинг-платформы"
      time: "2013–2017"
      points:
        - "Администрировал серверный парк коммерческих веб-проектов. Основал и руководил хостинг-платформой для интернет-магазинов."
  expertise:
    - title: "Инфраструктура и эксплуатация (CIO)"
      items: "IaaS, IaC, Kubernetes, облака (Cloud.ru, Yandex.Cloud), SLO/SLA, DORA, нагрузочное тестирование, управление ёмкостью."
    - title: "Разработка и архитектура (CTO)"
      items: "Enterprise Architecture, ADR, Architecture-as-a-Code, Docs-as-a-Code, технический долг, технологический радар, CMDB."
    - title: "ИТ-управление"
      items: "ИТ-стратегия, ИТ-финансы (НМА), портфель проектов, Kanban upstream/downstream (Discovery & Delivery), управление требованиями, управление знаниями, корпоративная отчётность."
    - title: "AI-практики"
      items: "AI-PDLC, LLMOps, Loop Engineering, Human-in/on/out-the-Loop, LLM-as-a-judge, Guardrails; harness, skills, plugins, MCP."
  devrel:
    - "Основал [«Архитектурные ката»](https://architecturalkatas.ru/) — игры для начинающих архитекторов: [сообщество 1000+ человек](https://t.me/arch_katas_russia), больше 10 сессий."
    - "Организовал активности для трёх конференций Ontico (HighLoad++, DevOpsConf): от идеи до реализации."
    - "Выступил на [10+ конференциях и митапах](/public-speaking/), [опубликовал статьи](/articles/), стал [номинантом «Технотекст-2023»](https://habr.com/ru/companies/kuper/articles/738634/)."
```

- [ ] **Step 2: Проверить, что YAML валиден и сайт собирается**

Run: `hugo --gc --minify --cleanDestinationDir`
Expected: сборка завершается без ошибок (`Total in ... ms`), exit code 0.

---

### Task 2: Данные лендинга и CV — английская локаль

**Files:**
- Modify: `data/translations/en-US.yaml` (добавить секции `landing` и `cv` после `career`)

- [ ] **Step 1: Добавить данные в конец `data/translations/en-US.yaml`**

```yaml
landing:
  headline: "Technology Leader: architecture, strategy, teams"
  metrics:
    - value: "180+"
      label: "information systems"
    - value: "60+"
      label: "business products"
    - value: "−35%"
      label: "IT TCO in 2025–2026"
    - value: "93%"
      label: "standards compliance"

cv:
  roles:
    - company: "Kuper"
      role: "Lead Solution Architect / CTO functions"
      time: "Sep 2025 — present"
      points:
        - "I lead a team of 6 solution architects and functionally guide 30+ architects across product teams."
        - "I own enterprise architecture: 180+ information systems, 1,000+ components, 60+ business products — both application and infrastructure layers."
        - "I designed the company's new IT landscape in Cloud.ru: business, application, and technology architecture. I inventoried the systems in a CMDB."
        - "I raised architecture and reliability maturity by two levels and increased corporate standards compliance from 70% to 92%."
        - "I standardized ADRs and automated their creation and review with AI: review time dropped from a week to 24 hours."
        - "I built the architecture committee and community, and updated the technology radar."
        - "I created the technical debt and deviation management process from scratch."
        - "I co-authored the three-year IT strategy with the CTO and cut IT TCO by 35% in 2025–2026."
        - "I rebuilt intangible-asset capitalization: automated time tracking without hurting development lead time."
        - "I am merging architecture processes (EA, ADR/RFC, technical debt) with general IT management: methodology, stakeholders, project portfolio."
        - "I negotiate with customers, lawyers, and finance teams: gap analyses, roadmaps, and coordination of engineering teams."
    - company: "Kuper"
      role: "Cloud migration program lead: Yandex.Cloud → Cloud.ru"
      time: "Mar 2025 — Mar 2026"
      points:
        - "I organized the work of ~600 migration participants."
        - "I migrated 180+ information systems and 60+ business products."
        - "I delivered on time: 100% of systems migrated by the end of March 2026, without incidents."
    - company: "Kuper"
      role: "Unit Lead — platform and product teams"
      time: "2023–2025"
      points:
        - "I owned reliability and performance of the storefront: order lifecycle, payments, fiscalization — over half of the store's traffic, 45+ teams."
        - "I prepared the company for the peak season: 2.2× performance in six months at 99.9% availability. A cross-domain project with 200 participants."
        - "I ran the technical side of the SberMarket → Kuper rebrand: the platform changed its name overnight, without downtime."
        - "I re-engineered the cart: 10× lower TCO, 4× lower latency down to 200 ms, capacity up from 10 to 100 rps."
        - "I accelerated the SDLC: 90% faster builds, 50% faster testing, 2× release frequency with the same change-failure rate."
        - "I introduced SLO/SLA from scratch for 100% of critical services, canary releases with automatic rollback, and DORA monitoring."
        - "I built load testing as a methodology: 6× more tests covering 92% of user traffic."
        - "I migrated the storefront to a PaaS without downtime and shipped Code Push for iOS/Android — the mobile release cycle dropped to a couple of hours."
        - "I delivered product launches on time."
    - company: "Kuper"
      role: "Senior DevOps Engineer / SRE Lead, Customer domain"
      time: "2022–2023"
      points:
        - "I joined as a senior DevOps engineer; within six months I led the SRE group for the Customer domain — reliability of the customer journey in the mobile and web apps."
    - company: "FunBox"
      role: "Infrastructure Engineer → Team Lead"
      time: "2015–2022"
      points:
        - "I launched 10+ infrastructure projects, from architecture design to production handover."
        - "I built geo-redundant Kafka (over 1 Gbps of traffic) and ClickHouse clusters. Centralized log collection made incident search 100× faster."
        - "I deployed corporate bare-metal Kubernetes with infrastructure as code, and introduced VictoriaMetrics metrics and Vector/Loki log pipelines."
        - "I grew DevRel: organized a meetup venue and helped build the employer brand."
    - company: "Simtech Group / Simtech Development"
      role: "System administrator, hosting platform lead"
      time: "2013–2017"
      points:
        - "I administered the server fleet for commercial web projects, then founded and led an e-commerce hosting platform."
  expertise:
    - title: "Infrastructure & operations (CIO)"
      items: "IaaS, IaC, Kubernetes, clouds (Cloud.ru, Yandex.Cloud), SLO/SLA, DORA, load testing, capacity management."
    - title: "Engineering & architecture (CTO)"
      items: "Enterprise Architecture, ADR, Architecture-as-a-Code, Docs-as-a-Code, technical debt, technology radar, CMDB."
    - title: "IT management"
      items: "IT strategy, IT finance (intangible assets), project portfolio, upstream/downstream Kanban (Discovery & Delivery), requirements management, knowledge management, corporate reporting."
    - title: "AI practices"
      items: "AI-PDLC, LLMOps, Loop Engineering, Human-in/on/out-of-the-Loop, LLM-as-a-judge, guardrails; harness, skills, plugins, MCP."
  devrel:
    - "I founded [Architectural Katas](https://architecturalkatas.ru/) _(Russian only)_ — system design games for aspiring architects: a [community of 1,000+ people](https://t.me/arch_katas_russia), 10+ sessions."
    - "I organized activities for three Ontico conferences (HighLoad++, DevOpsConf): from idea to delivery."
    - "I gave [10+ talks at conferences and meetups in Russian](/public-speaking/), [published articles](/articles/), and became a [Tekhnotekst-2023 nominee](https://habr.com/ru/companies/kuper/articles/738634/)."
```

- [ ] **Step 2: Проверить сборку**

Run: `hugo --gc --minify --cleanDestinationDir`
Expected: сборка без ошибок, exit code 0.

---

### Task 3: i18n темы — новые строки и обновление позиционирования

**Files:**
- Modify: `themes/simple/i18n/ru.yaml`
- Modify: `themes/simple/i18n/en.yaml`

- [ ] **Step 1: Обновить `themes/simple/i18n/ru.yaml`**

Заменить значения `my_role` и `what_i_do` и добавить новые id в конец файла:

```yaml
- id: my_role
  translation:
    other: Lead Solution Architect

- id: what_i_do
  translation:
    other: Управляю архитектурой и разрабатываю ИТ-стратегию в eCommerce

- id: nav_cv
  translation:
    other: Резюме

- id: cv_key_numbers
  translation:
    other: Ключевые цифры

- id: cv_experience
  translation:
    other: Опыт работы

- id: cv_expertise
  translation:
    other: Экспертиза

- id: cv_devrel
  translation:
    other: DevRel и сообщество
```

- [ ] **Step 2: Обновить `themes/simple/i18n/en.yaml`**

```yaml
- id: my_role
  translation:
    other: Lead Solution Architect

- id: company_name
  translation:
    other: at Kuper

- id: what_i_do
  translation:
    other: I manage the architecture and IT strategy in eCommerce

- id: nav_cv
  translation:
    other: CV

- id: cv_key_numbers
  translation:
    other: Key numbers

- id: cv_experience
  translation:
    other: Experience

- id: cv_expertise
  translation:
    other: Expertise

- id: cv_devrel
  translation:
    other: DevRel and community
```

- [ ] **Step 3: Проверить сборку**

Run: `hugo --gc --minify --cleanDestinationDir`
Expected: сборка без ошибок.

---

### Task 4: Layout `cv.html` и страницы CV

**Files:**
- Create: `themes/simple/layouts/_default/cv.html`
- Create: `content/cv.md`
- Create: `content/cv.en.md`

- [ ] **Step 1: Создать `themes/simple/layouts/_default/cv.html`**

```html
{{ define "main" }}
{{ $t := ( index hugo.Data.translations $.Site.Params.locale ) }}
<section class="pt-8">
  <article class="prose prose-lg">
    {{ .Content }}
  </article>
</section>
<section class="pt-8">
  <h3 class="font-semibold text-2xl pb-4">{{ i18n "cv_key_numbers" }}</h3>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {{ range $t.landing.metrics }}
    <div class="border border-gray-200 rounded p-4 text-center">
      <div class="text-3xl font-bold">{{ .value }}</div>
      <div class="text-sm text-gray-500">{{ .label }}</div>
    </div>
    {{ end }}
  </div>
</section>
<section class="pt-8">
  <h3 class="font-semibold text-2xl pb-4">{{ i18n "cv_experience" }}</h3>
  {{ range $t.cv.roles }}
  <div class="pb-6">
    <p class="font-bold">{{ .company }} — {{ .role }}</p>
    <p class="text-gray-500 text-sm">{{ .time }}</p>
    <ul class="list-disc pl-6 pt-2 space-y-1 text-lg">
      {{ range .points }}<li>{{ . | markdownify }}</li>{{ end }}
    </ul>
  </div>
  {{ end }}
</section>
<section class="pt-8">
  <h3 class="font-semibold text-2xl pb-4">{{ i18n "cv_expertise" }}</h3>
  {{ range $t.cv.expertise }}
  <div class="pb-4">
    <p class="font-bold">{{ .title }}</p>
    <p class="text-lg">{{ .items }}</p>
  </div>
  {{ end }}
</section>
<section class="pt-8">
  <h3 class="font-semibold text-2xl pb-4">{{ i18n "cv_devrel" }}</h3>
  <ul class="list-disc pl-6 space-y-1 text-lg">
    {{ range $t.cv.devrel }}<li>{{ . | markdownify }}</li>{{ end }}
  </ul>
</section>
{{ end }}
```

- [ ] **Step 2: Создать `content/cv.md`**

```markdown
---
title: Резюме
layout: cv
date: 2026-07-26T10:00:00+04:00
author: Gleb Goncharov
aliases:
  - /ru/cv/
  - /ru/cv/index.html

description: "Глеб Гончаров — Lead Solution Architect: корпоративная архитектура, ИТ-стратегия, миграции, управление командами."
categories: []
tags: []

draft: false
---

**Глеб Гончаров — Lead Solution Architect / Technology Leader.**

13+ лет в ИТ: от системного администратора до руководителя архитектуры. Пишу и говорю на русском, английском (C1) и немецком (B2) языках. Контакты: [Telegram](https://t.me/gongled), [inbox@gongled.ru](mailto:inbox@gongled.ru).
```

- [ ] **Step 3: Создать `content/cv.en.md`**

```markdown
---
title: CV
layout: cv
date: 2026-07-26T10:00:00+04:00
author: Gleb Goncharov
aliases:
  - /en/cv/
  - /en/cv/index.html

description: "Gleb Goncharov — Lead Solution Architect: enterprise architecture, IT strategy, cloud migrations, engineering leadership."
categories: []
tags: []

draft: false
---

**Gleb Goncharov — Lead Solution Architect / Technology Leader.**

13+ years in IT, from system administrator to head of architecture. I write and speak Russian, English (C1), and German (B2). Contacts: [Telegram](https://t.me/gongled), [inbox@gongled.ru](mailto:inbox@gongled.ru).
```

- [ ] **Step 4: Проверить сборку и контент**

Run: `hugo --gc --minify --cleanDestinationDir && grep -c "Lead Solution Architect" public/ru/cv/index.html public/en/cv/index.html`
Expected: сборка без ошибок; оба файла существуют, grep находит ≥1 совпадение в каждом.

---

### Task 5: Layout `landing.html` и переписанная главная (work)

**Files:**
- Create: `themes/simple/layouts/_default/landing.html`
- Modify: `content/work.md` (полная замена тела и `layout: staticpage` → `layout: landing`)
- Modify: `content/work.en.md` (аналогично)

- [ ] **Step 1: Создать `themes/simple/layouts/_default/landing.html`**

```html
{{ define "main" }}
{{ $t := ( index hugo.Data.translations $.Site.Params.locale ) }}
<section class="pt-8">
  <p class="text-3xl font-sans font-bold leading-snug">{{ $t.landing.headline }}</p>
</section>
<section class="pt-8">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {{ range $t.landing.metrics }}
    <div class="border border-gray-200 rounded p-4 text-center">
      <div class="text-3xl font-bold">{{ .value }}</div>
      <div class="text-sm text-gray-500">{{ .label }}</div>
    </div>
    {{ end }}
  </div>
</section>
<section class="pt-8">
  <article class="prose prose-lg">
    {{ .Content }}
  </article>
</section>
{{ end }}
```

- [ ] **Step 2: Переписать `content/work.md`**

Front matter: заменить `layout: staticpage` на `layout: landing`, `title` оставить `Работаю`. Тело:

```markdown
Руковожу корпоративной архитектурой и ИТ-управлением в Купере: 180+ информационных систем, 60+ бизнес-продуктов, команда solution-архитекторов. В 2025–2026 годах перенёс компанию из Yandex.Cloud в Cloud.ru: организовал около 600 участников, завершил миграцию в срок и без инцидентов. До этого руководил юнитом платформенных и продуктовых команд: готовил СберМаркет к высоким нагрузкам, провёл техническую часть ребрендинга в Купер за одну ночь, сократил TCO корзины в 10 раз.

Ко мне обращаются, когда нужно построить архитектурную функцию с нуля, спроектировать ИТ-ландшафт, сформировать ИТ-стратегию или взять под контроль технический долг. Управляю ИТ-финансами (НМА), портфелем проектов и требованиями. Внедряю AI-практики: автоматизировал ревью архитектурных решений, работаю по AI-PDLC и LLMOps.

Подробнее: [резюме](/ru/cv/), [карьера](/ru/work/career/), [инструменты и технологии](/ru/work/buzzwords/), [выступления](/ru/public-speaking/).

### Как со мной связаться

Пишите в [Telegram](https://t.me/gongled) или [на почту](mailto:inbox@gongled.ru) для сотрудничества.
```

- [ ] **Step 3: Переписать `content/work.en.md`**

Front matter: `layout: staticpage` → `layout: landing`, `title` оставить `Career`. Тело:

```markdown
I manage enterprise architecture and IT governance at Kuper: 180+ information systems, 60+ business products, and a team of solution architects. In 2025–2026 I migrated the company from Yandex.Cloud to Cloud.ru: I organized ~600 participants and delivered on time, without incidents. Before that, I led a unit of platform and product teams: prepared SberMarket for peak loads, ran the technical side of the Kuper rebrand overnight, and cut cart TCO tenfold.

Companies come to me when they need to build an architecture function from scratch, design an IT landscape, shape an IT strategy, or bring technical debt under control. I manage IT finance (intangible assets), the project portfolio, and requirements. I adopt AI practices: I automated architecture decision reviews and work with AI-PDLC and LLMOps.

More details: [CV](/en/cv/), [career timeline](/en/work/career/), [tools and technologies](/en/work/buzzwords/).

### How to reach me

Feel free to contact me on [Telegram](https://t.me/gongled) or [e-mail](mailto:inbox@gongled.ru) for collaboration.
```

- [ ] **Step 4: Проверить сборку и контент**

Run: `hugo --gc --minify --cleanDestinationDir && grep -c "Technology Leader" public/ru/work/index.html public/en/work/index.html`
Expected: сборка без ошибок; grep находит ≥1 совпадение в каждом файле.

---

### Task 6: Ссылка на CV в навигации

**Files:**
- Modify: `themes/simple/layouts/partials/header.html:29`

- [ ] **Step 1: Добавить ссылку CV в nav**

В `header.html` в блоке `<div class="flex space-x-6 text-2xl">` после ссылки `career` добавить:

```html
        <div class="flex-initial"><a href='{{ "cv/" | relLangURL }}'>{{ i18n "nav_cv" }}</a></div>
```

Итоговый фрагмент:

```html
      <div class="flex space-x-6 text-2xl">
        <div class="flex-initial"><a href='{{ "work/" | relLangURL }}'>{{ i18n "career" }}</a></div>
        <div class="flex-initial"><a href='{{ "cv/" | relLangURL }}'>{{ i18n "nav_cv" }}</a></div>
        {{- if eq (string $.Site.Language) "ru" -}}
        <div class="flex-initial"><a href='{{ "articles/" | relLangURL }}'>{{ i18n "articles" }}</a></div>
        <div class="flex-initial"><a href='{{ "public-speaking/" | relLangURL }}'>{{ i18n "public_speaking" }}</a></div>
        {{ end }}
      </div>
```

- [ ] **Step 2: Проверить сборку**

Run: `hugo --gc --minify --cleanDestinationDir && grep -c 'href="/ru/cv/"' public/ru/index.html`
Expected: сборка без ошибок; grep находит ≥1 совпадение.

---

### Task 7: Таймлайн карьеры — реструктуризация блока Купера и сворачивание Simtech

**Files:**
- Modify: `data/translations/ru-RU.yaml` (секция `career`)
- Modify: `data/translations/en-US.yaml` (секция `career`)

- [ ] **Step 1: В `ru-RU.yaml` заменить description блока «Купер»**

Сохранить `company`, `website`, `time: 2022-...`. Новый `description` (структура по ролям, достижения перенесены из CV-данных Task 1; старые формулировки SDLC/SLO/high season сохранены внутри роли юнит-лида):

```yaml
  - company: Купер
    website: https://kuper.ru/
    time: 2022-...
    description: |
      **Контекст**. Купер (ex СберМаркет) — eCommerce-проект по доставке продуктов и товаров из магазинов и ресторанов:
      три монолитных приложения на Ruby/Rails и несколько сотен микросервисов.

      **Lead Solution Architect / CTO-функции (сен 2025 — настоящее время)**. Руковожу командой из 6 solution-архитекторов,
      функционально веду 30+ архитекторов в командах. Отвечаю за корпоративную архитектуру: 180+ информационных систем
      (1000+ компонентов) и 60+ бизнес-продуктов, прикладной и инфраструктурный слои.

      Спроектировал новый ИТ-ландшафт компании в Cloud.ru и инвентаризировал системы в CMDB. Поднял зрелость архитектуры
      и надёжности на два уровня, довёл соответствие корпоративным стандартам с 70% до 92%. Стандартизировал ADR и
      автоматизировал их ревью с помощью AI (время до ревью — до 24 часов вместо недели). Создал процесс управления
      техническим долгом с нуля, сформировал ИТ-стратегию на три года совместно с CTO, сократил TCO на ИТ на 35%.

      **Миграция Yandex.Cloud → Cloud.ru (мар 2025 — мар 2026)**. Руководил проектом миграции: организовал около
      600 участников, перенёс 180+ информационных систем и 60+ бизнес-продуктов. Завершил миграцию в срок,
      без инцидентов.

      **Руководитель юнита: платформенные и продуктовые команды (2023–2025)**. Отвечал за надёжность и
      производительность витрины: жизненный цикл заказа, платежи, фискализация. Больше половины трафика магазина,
      45+ команд.

      Подготовил компанию к высокому сезону: [кросс-доменный проект на 200 участников](/public-speaking/kuper-high-season/),
      за полгода — рост производительности в 2,2 раза при доступности 99,9%. Организовал техническую часть ребрендинга
      СберМаркета в Купер за одну ночь. Провёл реинжиниринг корзины: TCO в 10 раз ниже, latency в 4 раза ниже (200 мс),
      ёмкость с 10 до 100 rps.

      Ускорил SDLC: сборка на 90%, тестирование на 50%, релизы в два раза чаще. Ввёл SLO/SLA на 100% критичных сервисов,
      канареечные релизы и DORA-мониторинг. Построил нагрузочное тестирование: тестов в 6 раз больше, покрытие 92%
      трафика. Перенёс витрину в PaaS без простоя, запустил Code Push для мобильных приложений. Запускал продуктовые
      проекты в срок.

      **Senior DevOps Engineer / SRE Lead (2022–2023)**. Пришёл senior DevOps-инженером, через полгода возглавил
      SRE-группу домена Customer.

      **Развитие ИТ-бренда**. Основал [«Архитектурные ката»](https://architecturalkatas.ru/): [сообщество 1000+
      человек](https://t.me/arch_katas_russia), больше 10 сессий. Организовал активности для трёх конференций Ontico
      (HighLoad++, DevOpsConf). Выступил 10+ [на конференциях и митапах](/public-speaking/), стал
      [номинантом «Технотекст-2023»](https://habr.com/ru/companies/kuper/articles/738634/).
```

- [ ] **Step 2: В `ru-RU.yaml` свернуть блоки Simtech**

Заменить description обоих блоков (Simtech Group, Simtech Development) одной строкой каждый:

```yaml
  - company: Simtech Group
    website: https://simtech.ru/
    time: 2013-2015
    description: |
      Работал системным администратором: серверный парк коммерческих веб-проектов, мониторинг, IP-телефония, первая база знаний компании.

  - company: Simtech Development
    website: https://simtechdev.com/
    time: 2016-2017
    description: |
      Основал и руководил [хостинг-платформой для интернет-магазинов](https://simtechdev.com/services/servers-infrastructure/cloud-hosting/): команда эксплуатации, финансовая модель, тарифные планы, автоматизация.
```

Блок FunBox не менять.

- [ ] **Step 3: В `en-US.yaml` заменить description блока «Kuper»**

```yaml
  - company: Kuper
    website: https://kuper.ru/
    time: 2022-...
    description: |
      **About company**. Kuper (ex SberMarket) is an eCommerce delivery service: three monolithic Ruby/Rails
      applications and several hundred microservices.

      **Lead Solution Architect / CTO functions (Sep 2025 — present)**. I lead a team of 6 solution architects and
      functionally guide 30+ architects. I own enterprise architecture: 180+ information systems (1,000+ components)
      and 60+ business products, application and infrastructure layers.

      I designed the new IT landscape in Cloud.ru and inventoried systems in a CMDB. I raised architecture and
      reliability maturity by two levels and increased standards compliance from 70% to 92%. I standardized ADRs and
      automated their review with AI (review time down from a week to 24 hours). I created the technical debt
      management process from scratch, co-authored the three-year IT strategy, and cut IT TCO by 35%.

      **Cloud migration: Yandex.Cloud → Cloud.ru (Mar 2025 — Mar 2026)**. I led the migration program: ~600
      participants, 180+ information systems and 60+ business products migrated. Delivered on time, without
      incidents.

      **Unit Lead — platform and product teams (2023–2025)**. I owned reliability and performance of the
      storefront: order lifecycle, payments, fiscalization. Over half of the store's traffic, 45+ teams.

      I prepared the company for the [peak season](/public-speaking/kuper-high-season/): a 200-participant
      cross-domain project, 2.2× performance in six months at 99.9% availability. I ran the technical side of the
      SberMarket → Kuper rebrand overnight. I re-engineered the cart: 10× lower TCO, 4× lower latency (200 ms),
      capacity from 10 to 100 rps.

      I accelerated the SDLC: 90% faster builds, 50% faster testing, 2× release frequency. I introduced SLO/SLA
      for 100% of critical services, canary releases, and DORA monitoring. I built load testing as a methodology:
      6× more tests, 92% traffic coverage. I migrated the storefront to a PaaS without downtime and shipped Code
      Push for mobile apps. I delivered product launches on time.

      **Senior DevOps Engineer / SRE Lead (2022–2023)**. I joined as a senior DevOps engineer; within six months
      I led the SRE group for the Customer domain.

      **Employer brand**. I founded [Architectural Katas](https://architecturalkatas.ru/) _(Russian only)_:
      a [community of 1,000+ people](https://t.me/arch_katas_russia), 10+ sessions. I organized activities for
      three Ontico conferences (HighLoad++, DevOpsConf). I gave [10+ talks](/public-speaking/) and became
      a [Tekhnotekst-2023 nominee](https://habr.com/ru/companies/kuper/articles/738634/).
```

- [ ] **Step 4: В `en-US.yaml` свернуть блоки Simtech**

```yaml
  - company: Simtech Group
    website: https://simtech.ru/
    time: 2013-2015
    description: |
      I worked as a system administrator: server fleet for commercial web projects, monitoring, IP telephony, the company's first knowledge base.

  - company: Simtech Development
    website: https://simtechdev.com/
    time: 2016-2017
    description: |
      I founded and led a [hosting platform for e-commerce](https://simtechdev.com/services/servers-infrastructure/cloud-hosting/): operations team, financial model, pricing plans, automation.
```

- [ ] **Step 5: Проверить сборку и контент**

Run: `hugo --gc --minify --cleanDestinationDir && grep -c "Cloud.ru" public/ru/work/career/index.html public/en/work/career/index.html`
Expected: сборка без ошибок; grep находит ≥1 совпадение в каждом файле.

---

### Task 8: Buzzwords — архитектура и AI-стек

**Files:**
- Modify: `data/tools.yaml`

- [ ] **Step 1: Дополнить `data/tools.yaml`**

В секцию «Облачные провайдеры» добавить `Cloud.ru` (если отсутствует). В конец файла добавить:

```yaml
# Архитектура и управление
  - ADR
  - C4 Model
  - Architecture-as-a-Code
  - Docs-as-a-Code
  - Технологический радар
  - CMDB
# AI-инструменты и практики
  - MCP
  - AI-PDLC
  - LLMOps
  - LLM-as-a-judge
```

Формат файла — плоский список с комментариями-разделителями; сохранить существующий стиль (два пробела перед `-`).

- [ ] **Step 2: Проверить сборку**

Run: `hugo --gc --minify --cleanDestinationDir && grep -c "Cloud.ru" public/ru/work/buzzwords/index.html`
Expected: сборка без ошибок; grep находит ≥1 совпадение.

---

### Task 9: config.toml — описание сайта

**Files:**
- Modify: `config.toml:20` и `config.toml:32` (параметры `description` в `[languages.ru.params]` и `[languages.en.params]`)

- [ ] **Step 1: Обновить description**

```toml
# [languages.ru.params]
      description = "Lead Solution Architect: архитектура, ИТ-стратегия, команды."

# [languages.en.params]
      description = "Lead Solution Architect: architecture, IT strategy, teams."
```

- [ ] **Step 2: Проверить сборку**

Run: `hugo --gc --minify --cleanDestinationDir`
Expected: сборка без ошибок.

---

### Task 10: Финальная визуальная проверка обеих локалей

**Files:** — (только проверка)

- [ ] **Step 1: Запустить dev-сервер**

Run: `hugo server --bind="0.0.0.0"` (или `make play`)

- [ ] **Step 2: Проверить страницы в браузере**

Открыть и проверить глазами:
- `http://localhost:1313/` — hero с новым заголовком и строкой роли из i18n;
- `http://localhost:1313/ru/work/` — лендинг с 4 метриками и новым питчем;
- `http://localhost:1313/ru/cv/` — метрики, роли, экспертиза, DevRel;
- `http://localhost:1313/en/work/` и `http://localhost:1313/en/cv/` — английские версии;
- `http://localhost:1313/ru/work/career/` — таймлайн с новой структурой Купера;
- навигация содержит ссылку «Резюме»/«CV» и переключатель языков работает.

- [ ] **Step 3: Остановить сервер и отчитаться пользователю**
