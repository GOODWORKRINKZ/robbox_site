import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import Logo from './components/Logo'
import DraftScene from './components/DraftScene'
import Assembly from './components/Assembly'
import './App.css'

const NAV = [
  { id: 'platform', label: 'Платформа' },
  { id: 'projects', label: 'Проекты' },
  { id: 'roadmap', label: 'Планы' },
  { id: 'demo', label: 'Демо' },
  { id: 'contact', label: 'Контакты' },
]

const SPEC = [
  { key: 'база', value: 'до 100К ₽' },
  { key: 'модули', value: 'под задачу' },
  { key: 'автономность', value: 'SLAM и задания' },
  { key: 'управление', value: 'веб и VR' },
]

const ROADMAP = [
  { title: 'Базовая платформа', text: 'Минимальная дешёвая подвижная единица — BiBa.', status: { label: 'В работе', tone: 'progress' } },
  { title: 'Навесные модули', text: 'Оборудование под задачи: покос, уборка, доставка, инструменты.', status: { label: 'В планах', tone: 'planned' } },
  { title: 'Автономность', text: 'SLAM, планирование и LLM-агенты — стек РОББОКС.', status: { label: 'В работе', tone: 'progress' } },
  { title: 'Сервисы управления', text: 'Веб- и VR-доступ, удалённое руление и мониторинг.', status: { label: 'В планах', tone: 'planned' } },
]

const DEMOS = [
  { type: 'loop', src: '/rviz-demo.mp4', caption: 'Визуализация робота в RViz — модель с вращающимися колёсами' },
  { type: 'loop', src: '/led-animation.mp4', caption: 'Редактор анимаций для NeoPixel-матриц — эффект торможения' },
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
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

/* --- мелкие компоненты --- */

function Status({ label, tone }: { label: string; tone: string }) {
  return <span className={`status status-${tone}`}>{label}</span>
}

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div className="section-head" data-reveal>
      <span className="kicker">{kicker}</span>
      <div>
        <h2 className="section-title">{title}</h2>
        {text && <p className="section-text">{text}</p>}
      </div>
    </div>
  )
}

/** Короткий зацикленный ролик: грузится и играет только когда виден. */
function LoopVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const video = ref.current
    if (!video || reduced) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => undefined)
        else video.pause()
      },
      { threshold: 0.25 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <video ref={ref} muted loop playsInline preload={reduced ? 'metadata' : 'none'} controls={reduced} aria-label={label}>
      <source src={src} type="video/mp4" />
    </video>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(NAV.map((item) => item.id))
  useReveal()

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
      <div className="backdrop" aria-hidden="true" />

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
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="kicker" data-reveal>
                наземная робоплатформа · ROS 2 · открытая разработка
              </span>

              <h1 className="hero-mark" data-reveal>
                <Logo />
                <span className="visually-hidden">роббокс.тех</span>
              </h1>

              <p className="hero-title" data-reveal>
                Одна база — много задач: от дешёвой тележки до автономного робота
              </p>
              <p className="hero-text" data-reveal>
                Собираем наземный робототехнический комплекс и сервисы для его управления: одна приводная база, сменные
                навесные модули и автономность, которую подключают по мере необходимости.
              </p>

              <div className="hero-actions" data-reveal>
                <a href="#contact" className="btn btn-primary">Написать нам</a>
                <a href="#platform" className="btn btn-ghost">Как устроено</a>
              </div>

              <dl className="spec" data-reveal>
                {SPEC.map((item) => (
                  <div key={item.key}>
                    <dt>{item.key}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="hero-sheet" data-reveal>
              <DraftScene />
            </div>
          </div>
        </section>

        <section id="platform" className="section">
          <div className="container">
            <SectionHead
              kicker="как это устроено"
              title="Платформа"
              text="Три уровня одной системы: от простой базы до автономного комплекса."
            />
            <Assembly />
            <p className="note" data-reveal>
              Одна база — много задач: меняете навесное оборудование и подключаете автономность, когда она нужна.
            </p>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <SectionHead kicker="что делаем" title="Проекты" text="Два направления одной команды — железо и софт." />

            <div className="projects">
              <article className="frame project" data-reveal>
                <div className="project-head">
                  <span className="tag">железо</span>
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

              <article className="frame project" data-reveal style={{ transitionDelay: '110ms' }}>
                <div className="project-head">
                  <span className="tag">софт</span>
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

        <section id="roadmap" className="section">
          <div className="container">
            <SectionHead kicker="куда идём" title="Дорожная карта" text="Этапы развития платформы." />

            <ol className="rev">
              {ROADMAP.map((step, index) => (
                <li className="rev-row" key={step.title} data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
                  <span className="rev-num">{String(index + 1).padStart(2, '0')}</span>
                  <div className="rev-body">
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
                <figure className="frame demo" key={demo.src} data-reveal style={{ transitionDelay: `${(index % 2) * 90}ms` }}>
                  {demo.type === 'loop' ? (
                    <LoopVideo src={demo.src} label={demo.caption} />
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

              <form className="frame contact-form" onSubmit={handleContactSubmit} data-reveal style={{ transitionDelay: '110ms' }}>
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

      {/* подвал оформлен как штамп чертежа */}
      <footer className="footer">
        <div className="container">
          <div className="stamp">
            <a className="stamp-cell stamp-brand" href="#top" aria-label="роббокс.тех — наверх">
              <Logo variant="solid" alive={false} />
            </a>
            <div className="stamp-cell stamp-title">
              <span className="stamp-key">наименование</span>
              Доступная робототехническая платформа
            </div>
            <div className="stamp-cell">
              <span className="stamp-key">масштаб</span>
              1:1
            </div>
            <div className="stamp-cell">
              <span className="stamp-key">лист</span>
              1 / 1
            </div>
            <div className="stamp-cell stamp-links">
              <span className="stamp-key">связь</span>
              <span>
                <a href="https://t.me/robbox_project" target="_blank" rel="noopener noreferrer">Telegram</a>
                <a href="mailto:contact@robbox.tech">Email</a>
              </span>
            </div>
          </div>
          <p className="footer-note">© 2026 роббокс.тех · открытая разработка</p>
        </div>
      </footer>
    </div>
  )
}
