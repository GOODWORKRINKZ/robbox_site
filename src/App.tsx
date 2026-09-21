import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import Logo from './components/Logo'
import './App.css'

const NAV = [
  { id: 'platform', label: 'Платформа' },
  { id: 'projects', label: 'Проекты' },
  { id: 'modules', label: 'Модули' },
  { id: 'roadmap', label: 'Планы' },
  { id: 'demo', label: 'Демо' },
  { id: 'contact', label: 'Контакты' },
]

const HERO_VIDEOS = ['/videos/robot-video-1.mp4', '/videos/robot-video-2.mp4', '/videos/robot-video-3.mp4']

const STATS = [
  { value: 'до 100К ₽', label: 'стоимость базового модуля' },
  { value: 'модульно', label: 'навесные модули под задачу' },
  { value: 'автономно', label: 'SLAM и задания' },
  { value: 'удалённо', label: 'управление через веб и VR' },
]

/* --- иконки: тот же монолинейный штрих, что и в знаке --- */

const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const IconBase = () => (
  <Icon>
    <rect x="3" y="9" width="18" height="8" rx="2.5" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="16.5" cy="17.5" r="2.5" />
    <path d="M8 9V6h8v3" />
  </Icon>
)

const IconModule = () => (
  <Icon>
    <path d="M12 3l7.5 4.2v9.6L12 21l-7.5-4.2V7.2z" />
    <path d="M12 12l7.5-4.2M12 12v9M12 12L4.5 7.8" />
  </Icon>
)

const IconBrain = () => (
  <Icon>
    <rect x="5" y="5" width="14" height="14" rx="4" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </Icon>
)

const IconRemote = () => (
  <Icon>
    <rect x="3" y="4" width="18" height="12" rx="2.5" />
    <path d="M8 20h8M12 16v4" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
)

const IconDelivery = () => (
  <Icon>
    <path d="M3 8l9-4 9 4v8l-9 4-9-4z" />
    <path d="M3 8l9 4 9-4M12 12v8" />
  </Icon>
)

const IconMow = () => (
  <Icon>
    <path d="M4 20c0-4 2.5-6 5-6s5 2 5 6" />
    <path d="M14 20h6M17 14v6" />
    <path d="M9 14V9M6 11l3-2 3 2" />
  </Icon>
)

/* --- секции-данные --- */

const PLATFORM = [
  {
    icon: <IconBase />,
    title: 'База',
    text: 'Доступная подвижная платформа: моторы, колёса, корпус и минимум электроники для управления.',
  },
  {
    icon: <IconModule />,
    title: 'Навесные модули',
    text: 'Оборудование под конкретную задачу: покос, уборка, доставка, инструменты.',
  },
  {
    icon: <IconBrain />,
    title: 'Модуль автономности',
    text: 'SLAM, планирование маршрута и LLM-агенты: робот получает задание и выполняет его сам.',
  },
]

const MODULES = [
  {
    icon: <IconRemote />,
    title: 'Удалённое управление',
    text: 'Управление роботом через веб и VR-очки: авторизация и руление из любого места.',
    status: { label: 'В работе', tone: 'progress' },
  },
  {
    icon: <IconDelivery />,
    title: 'Доставка внутри помещений',
    text: 'Ровер довозит предметы из точки A в точку B по заранее построенной карте помещения.',
    status: { label: 'Пилот', tone: 'progress' },
  },
  {
    icon: <IconMow />,
    title: 'Покос травы',
    text: 'Навесной модуль косилки: задание на участок и автономный покос без участия человека.',
    status: { label: 'В планах', tone: 'planned' },
  },
]

const ROADMAP = [
  { title: 'Базовая платформа', text: 'Минимальная дешёвая подвижная единица — BiBa.', status: { label: 'В работе', tone: 'progress' } },
  { title: 'Навесные модули', text: 'Оборудование под задачи: покос, уборка, доставка, инструменты.', status: { label: 'В планах', tone: 'planned' } },
  { title: 'Автономность', text: 'SLAM, планирование и LLM-агенты — стек РОББОКС.', status: { label: 'В работе', tone: 'progress' } },
  { title: 'Сервисы управления', text: 'Веб- и VR-доступ, удалённое руление и мониторинг.', status: { label: 'В планах', tone: 'planned' } },
]

const DEMOS = [
  { type: 'img', src: '/rviz-demo.gif', caption: 'Визуализация робота в RViz — модель с вращающимися колёсами' },
  { type: 'img', src: '/led-animation.gif', caption: 'Редактор анимаций для NeoPixel-матриц — эффект торможения' },
  { type: 'video', src: '/videos/biba-mowing-timelapse.mp4', caption: 'Таймлапс испытаний BiBa — покос газона' },
  {
    type: 'video',
    src: '/videos/robbox-vendor-demo.mp4',
    caption: 'РОББОКС-комивояжёр: объезжает точки и продаёт товары по голосовой команде',
  },
] as const

/* --- хуки --- */

/** Появление блоков по мере прокрутки. */
function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-in'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

/** Подсветка пункта меню для секции, которая сейчас на экране. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [ids])

  return active
}

function Status({ label, tone }: { label: string; tone: string }) {
  return <span className={`status status-${tone}`}>{label}</span>
}

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div className="section-head" data-reveal>
      <span className="kicker">{kicker}</span>
      <h2 className="section-title">{title}</h2>
      {text && <p className="section-text">{text}</p>}
    </div>
  )
}

export default function App() {
  const [currentVideo, setCurrentVideo] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(NAV.map((item) => item.id))
  useReveal()

  useEffect(() => {
    const id = setInterval(() => setCurrentVideo((prev) => (prev + 1) % HERO_VIDEOS.length), 15000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Браузер отрабатывает якорь из адреса до того, как React отрисует секции,
  // поэтому ссылку вида robbox.tech/#projects доводим до места вручную.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }, [])

  const handleContactSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = encodeURIComponent(String(data.get('subject') ?? 'Сообщение с сайта РОББОКС.ТЕХ'))
    const body = encodeURIComponent(
      `${String(data.get('message') ?? '')}\n\n— ${String(data.get('name') ?? '')} (${String(data.get('email') ?? '')})`,
    )
    window.location.href = `mailto:contact@robbox.tech?subject=${subject}&body=${body}`
  }, [])

  return (
    <div className="app">
      <div className="backdrop" aria-hidden="true">
        <div className="backdrop-grid" />
      </div>

      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="роббокс.тех — на главную">
            <Logo variant="solid" />
          </a>

          <nav className={`nav ${menuOpen ? 'is-open' : ''}`}>
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? 'is-active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a className="btn btn-ghost nav-cta" href="https://t.me/robbox_project" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </nav>

          <button
            type="button"
            className={`burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-media" aria-hidden="true">
            {HERO_VIDEOS.map((video, index) => (
              <video
                key={video}
                className={`hero-video ${index === currentVideo ? 'is-active' : ''}`}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              >
                <source src={video} type="video/mp4" />
              </video>
            ))}
            <div className="hero-scrim" />
          </div>

          <div className="container hero-inner">
            <span className="kicker" data-reveal>
              наземная робоплатформа · ROS 2 · открытая разработка
            </span>

            <h1 className="hero-mark" data-reveal>
              <Logo />
              <span className="visually-hidden">роббокс.тех</span>
            </h1>

            <p className="hero-title" data-reveal>
              Доступная робоплатформа — от дешёвой базы до автономного робота
            </p>
            <p className="hero-text" data-reveal>
              Собираем наземный робототехнический комплекс и сервисы для его управления: одна база, сменные навесные
              модули и автономность, которую подключают по мере необходимости.
            </p>

            <div className="hero-actions" data-reveal>
              <a href="#contact" className="btn btn-primary">Написать нам</a>
              <a href="#projects" className="btn btn-ghost">Смотреть проекты</a>
            </div>

            <dl className="stats" data-reveal>
              {STATS.map((stat) => (
                <div className="stat" key={stat.label}>
                  <dt className="stat-value">{stat.value}</dt>
                  <dd className="stat-label">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="platform" className="section">
          <div className="container">
            <SectionHead
              kicker="как это устроено"
              title="Платформа"
              text="Три уровня одной системы: от простой базы до автономного комплекса."
            />

            <div className="steps">
              {PLATFORM.map((step, index) => (
                <article className="card step" key={step.title} data-reveal style={{ transitionDelay: `${index * 90}ms` }}>
                  <span className="step-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="card-icon">{step.icon}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>

            <p className="note" data-reveal>
              Одна база — много задач: меняете навесное оборудование и подключаете автономность, когда она нужна.
            </p>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <SectionHead kicker="что делаем" title="Проекты" text="Два направления одной команды — железо и софт." />

            <div className="projects">
              <article className="card project project-hw" data-reveal>
                <div className="project-head">
                  <span className="tag tag-hw">железо</span>
                  <Status label="В разработке" tone="progress" />
                </div>
                <h3>BiBa</h3>
                <p className="project-sub">Приводной роботизированный модуль (ПРМ-2к)</p>
                <p>
                  Двухколёсная приводная база — самое доступное решение для перемещения грузов. Вес около 20 кг,
                  управление по радиоканалу, модульная линейка под разные задачи.
                </p>
                <ul>
                  <li>Радиоуправление ExpressLRS/CRSF</li>
                  <li>Линейка насадок: складская и садовая тележка, привод для газонокосилки</li>
                  <li>Вес ~20 кг — компактнее аналогов</li>
                </ul>
              </article>

              <article className="card project project-sw" data-reveal style={{ transitionDelay: '110ms' }}>
                <div className="project-head">
                  <span className="tag tag-sw">софт</span>
                  <Status label="В разработке" tone="progress" />
                </div>
                <h3>РОББОКС</h3>
                <p className="project-sub">Автономный ровер-доставщик</p>
                <p>
                  Автономная доставка внутри помещений на стеке ROS 2: SLAM-навигация, голосовое взаимодействие и
                  распределённая архитектура на двух Raspberry Pi 5.
                </p>
                <ul>
                  <li>Автономная навигация: SLAM (RTAB-Map) + Nav2</li>
                  <li>Голосовой ассистент и LLM</li>
                  <li>Образовательная версия для изучения ROS 2</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section id="modules" className="section">
          <div className="container">
            <SectionHead
              kicker="задачи"
              title="Модули и задачи"
              text="Что платформа делает уже сейчас и что будет дальше."
            />

            <div className="cards-3">
              {MODULES.map((module, index) => (
                <article className="card" key={module.title} data-reveal style={{ transitionDelay: `${index * 90}ms` }}>
                  <span className="card-icon">{module.icon}</span>
                  <h3>{module.title}</h3>
                  <p>{module.text}</p>
                  <Status {...module.status} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="roadmap" className="section">
          <div className="container">
            <SectionHead kicker="куда идём" title="Дорожная карта" text="Этапы развития платформы." />

            <ol className="roadmap">
              {ROADMAP.map((step, index) => (
                <li className="roadmap-step" key={step.title} data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
                  <span className="roadmap-dot">{index + 1}</span>
                  <div className="roadmap-body">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                  <Status {...step.status} />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="demo" className="section">
          <div className="container">
            <SectionHead kicker="в деле" title="Демонстрация" text="Живые кадры работы платформы." />

            <div className="demos">
              {DEMOS.map((demo, index) => (
                <figure className="card demo" key={demo.src} data-reveal style={{ transitionDelay: `${(index % 2) * 90}ms` }}>
                  {demo.type === 'img' ? (
                    <img src={demo.src} alt={demo.caption} loading="lazy" />
                  ) : (
                    <video controls muted playsInline preload="metadata">
                      <source src={demo.src} type="video/mp4" />
                    </video>
                  )}
                  <figcaption>{demo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <SectionHead kicker="контакты" title="Связаться с командой" />

            <div className="contact">
              <div className="contact-info" data-reveal>
                <h3>Расскажите о вашей задаче</h3>
                <p>
                  Ищем партнёров, инвесторов и единомышленников. Расскажите, какую задачу вы хотите решить с помощью
                  платформы — обсудим.
                </p>
                <div className="contact-links">
                  <a className="contact-link" href="https://t.me/robbox_project" target="_blank" rel="noopener noreferrer">
                    <span className="contact-link-label">Telegram</span>
                    <span className="contact-link-value">@robbox_project</span>
                  </a>
                  <a className="contact-link" href="mailto:contact@robbox.tech">
                    <span className="contact-link-label">Почта</span>
                    <span className="contact-link-value">contact@robbox.tech</span>
                  </a>
                </div>
              </div>

              <form className="card contact-form" onSubmit={handleContactSubmit} data-reveal style={{ transitionDelay: '110ms' }}>
                <h3>Написать команде</h3>
                <div className="field">
                  <label htmlFor="name">Имя</label>
                  <input type="text" id="name" name="name" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" autoComplete="email" required />
                </div>
                <div className="field">
                  <label htmlFor="subject">Тема</label>
                  <select id="subject" name="subject" required defaultValue="Инвестиции и сотрудничество">
                    <option>Инвестиции и сотрудничество</option>
                    <option>Пилотный проект</option>
                    <option>Вопрос о платформе</option>
                    <option>Партнёрство</option>
                    <option>Другое</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="message">Сообщение</label>
                  <textarea id="message" name="message" rows={5} required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Отправить</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="#top" aria-label="роббокс.тех — наверх">
            <Logo variant="solid" alive={false} />
          </a>
          <p className="footer-note">© 2026 роббокс.тех — доступная робототехническая платформа</p>
          <p className="footer-links">
            <a href="https://t.me/robbox_project" target="_blank" rel="noopener noreferrer">Telegram</a>
            <a href="mailto:contact@robbox.tech">Email</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
