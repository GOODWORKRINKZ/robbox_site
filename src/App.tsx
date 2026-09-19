import { useState, useEffect, type FormEvent } from 'react'
import './App.css'

function App() {
  const [currentVideo, setCurrentVideo] = useState(0)
  const videos = [
    '/videos/robot-video-1.mp4',
    '/videos/robot-video-2.mp4',
    '/videos/robot-video-3.mp4',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length)
    }, 15000)

    return () => clearInterval(interval)
  }, [videos.length])

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = encodeURIComponent(String(data.get('subject') ?? 'Сообщение с сайта РОББОКС.ТЕХ'))
    const body = encodeURIComponent(
      `${String(data.get('message') ?? '')}\n\n— ${String(data.get('name') ?? '')} (${String(data.get('email') ?? '')})`,
    )
    window.location.href = `mailto:contact@robbox.tech?subject=${subject}&body=${body}`
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src="/logo.svg" alt="РОББОКС.ТЕХ" className="logo-image" />
          </div>
          <nav className="nav">
            <a href="#platform">Платформа</a>
            <a href="#projects">Проекты</a>
            <a href="#modules">Модули</a>
            <a href="#roadmap">Планы</a>
            <a href="#demo">Демо</a>
            <a href="#contact">Контакты</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-background">
            {videos.map((video, index) => (
              <video
                key={video}
                className={`hero-video ${index === currentVideo ? 'active' : ''}`}
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={video} type="video/mp4" />
              </video>
            ))}
            <div className="hero-overlay"></div>
          </div>
          <div className="container hero-content">
            <h2 className="hero-title">Доступная робоплатформа</h2>
            <p className="hero-subtitle">
              Собираем доступный наземный робототехнический комплекс и сервисы для его управления —
              от дешёвой базы до автономного робота.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">до 100К ₽</span>
                <span className="stat-label">стоимость базового модуля</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">МОДУЛЬНО</span>
                <span className="stat-label">навесные модули</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">АВТОНОМНО</span>
                <span className="stat-label">SLAM и задания</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">УДАЛЁННО</span>
                <span className="stat-label">веб и VR</span>
              </div>
            </div>
            <div className="hero-buttons">
              <a href="#contact" className="btn btn-primary">Написать нам</a>
              <a href="#projects" className="btn btn-secondary">Смотреть проекты</a>
            </div>
          </div>
        </section>

        <section id="platform" className="section">
          <div className="container">
            <h2 className="section-title">Платформа</h2>
            <p className="section-description">Три уровня одной системы — от простой базы до автономного комплекса</p>
            <div className="platform-schema">
              <div className="platform-step">
                <div className="platform-step-number">01</div>
                <h3>База</h3>
                <p>Доступная подвижная платформа: моторы, колёса, корпус и минимум электроники для управления.</p>
              </div>
              <div className="platform-arrow">→</div>
              <div className="platform-step">
                <div className="platform-step-number">02</div>
                <h3>Навесные модули</h3>
                <p>Оборудование под конкретную задачу: покос, уборка, доставка, инструменты.</p>
              </div>
              <div className="platform-arrow">→</div>
              <div className="platform-step">
                <div className="platform-step-number">03</div>
                <h3>Модуль автономности</h3>
                <p>SLAM, планирование маршрута и LLM-агенты: робот получает задание и выполняет его сам.</p>
              </div>
            </div>
            <p className="platform-note">Одна база — много задач: меняете навесное оборудование и подключаете автономность по мере необходимости.</p>
          </div>
        </section>

        <section id="projects" className="section section-alt">
          <div className="container">
            <h2 className="section-title">Проекты</h2>
            <p className="section-description">Два направления одной команды — железо и софт</p>
            <div className="projects-grid">
              <div className="project-card hardware">
                <span className="project-tag">ЖЕЛЕЗО</span>
                <h3>BiBa</h3>
                <p className="project-subtitle">Приводной роботизированный модуль (ПРМ-2к)</p>
                <p>Двухколёсная приводная база — самое доступное решение для перемещения грузов. Вес около 20 кг, управление по радиоканалу, модульная линейка под разные задачи.</p>
                <ul>
                  <li>Радиоуправление ExpressLRS/CRSF</li>
                  <li>Линейка насадок: складская и садовая тележка, привод для газонокосилки</li>
                  <li>Вес ~20 кг — компактнее аналогов</li>
                </ul>
                <span className="project-status in-progress">В разработке</span>
              </div>
              <div className="project-card software">
                <span className="project-tag">СОФТ</span>
                <h3>РОББОКС</h3>
                <p className="project-subtitle">Автономный ровер-доставщик</p>
                <p>Автономная доставка внутри помещений на стеке ROS2: SLAM-навигация, голосовое взаимодействие и распределённая архитектура на двух Raspberry Pi 5.</p>
                <ul>
                  <li>Автономная навигация: SLAM (RTAB-Map) + Nav2</li>
                  <li>Голосовой ассистент и LLM</li>
                  <li>Образовательная версия для изучения ROS2</li>
                </ul>
                <span className="project-status in-progress">В разработке</span>
              </div>
            </div>
          </div>
        </section>

        <section id="modules" className="section">
          <div className="container">
            <h2 className="section-title">Модули и задачи</h2>
            <p className="section-description">Что платформа делает уже сейчас и что будет дальше</p>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Удалённое управление</h3>
                <p>Управление роботом через веб и VR-очки: авторизация и руление из любого места.</p>
                <span className="feature-status in-progress">В работе</span>
              </div>
              <div className="feature-card">
                <h3>Доставка внутри помещений</h3>
                <p>Ровер довозит предметы из точки A в точку B по заранее построенной карте помещения.</p>
                <span className="feature-status in-progress">Пилот</span>
              </div>
              <div className="feature-card">
                <h3>Покос травы</h3>
                <p>Навесной модуль косилки: задание на участок и автономный покос без участия человека.</p>
                <span className="feature-status planned">В планах</span>
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap" className="section section-alt">
          <div className="container">
            <h2 className="section-title">Дорожная карта</h2>
            <p className="section-description">Этапы развития платформы</p>
            <div className="roadmap">
              <div className="roadmap-step">
                <div className="roadmap-number">1</div>
                <div className="roadmap-body">
                  <h3>Базовая платформа</h3>
                  <p>Минимальная дешёвая подвижная единица — BiBa.</p>
                </div>
                <span className="roadmap-status in-progress">В работе</span>
              </div>
              <div className="roadmap-step">
                <div className="roadmap-number">2</div>
                <div className="roadmap-body">
                  <h3>Навесные модули</h3>
                  <p>Оборудование под задачи: покос, уборка, доставка, инструменты.</p>
                </div>
                <span className="roadmap-status planned">В планах</span>
              </div>
              <div className="roadmap-step">
                <div className="roadmap-number">3</div>
                <div className="roadmap-body">
                  <h3>Автономность</h3>
                  <p>SLAM, планирование и LLM-агенты — стек РОББОКС.</p>
                </div>
                <span className="roadmap-status in-progress">В работе</span>
              </div>
              <div className="roadmap-step">
                <div className="roadmap-number">4</div>
                <div className="roadmap-body">
                  <h3>Сервисы управления</h3>
                  <p>Веб- и VR-доступ, удалённое руление и мониторинг.</p>
                </div>
                <span className="roadmap-status planned">В планах</span>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="section">
          <div className="container">
            <h2 className="section-title">Демонстрация</h2>
            <p className="section-description">Живые кадры работы платформы</p>
            <div className="demo-section">
              <div className="demo-item">
                <img src="/rviz-demo.gif" alt="Демонстрация робота в RViz" className="demo-gif" />
                <p className="demo-caption">Визуализация робота в RViz — модель с вращающимися колёсами</p>
              </div>
              <div className="demo-item">
                <img src="/led-animation.gif" alt="Анимация LED матриц" className="demo-gif" />
                <p className="demo-caption">Редактор анимаций для NeoPixel матриц — эффект торможения</p>
              </div>
              <div className="demo-item">
                <video className="demo-gif" controls muted playsInline preload="metadata">
                  <source src="/videos/biba-mowing-timelapse.mp4" type="video/mp4" />
                </video>
                <p className="demo-caption">Таймлапс испытаний BiBa — покос газона</p>
              </div>
              <div className="demo-item">
                <video className="demo-gif" controls muted playsInline preload="metadata">
                  <source src="/videos/robbox-vendor-demo.mp4" type="video/mp4" />
                </video>
                <p className="demo-caption">РОББОКС — комивояжёр: объезжает точки и продаёт товары по голосовой команде</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section section-alt">
          <div className="container">
            <h2 className="section-title">Связаться с командой</h2>
            <div className="contact-content">
              <div className="contact-info">
                <h3>Расскажите о вашей задаче</h3>
                <p>Ищем партнёров, инвесторов и единомышленников. Расскажите, какую задачу вы хотите решить с помощью платформы — обсудим.</p>
                <div className="contact-links">
                  <a href="https://t.me/robbox_project" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <span>Telegram</span>
                  </a>
                  <a href="mailto:contact@robbox.tech" className="contact-link">
                    <span>contact@robbox.tech</span>
                  </a>
                  {/* TODO: подставить ссылку на донат */}
                  <a href="#" className="contact-link">
                    <span>Поддержать проект</span>
                  </a>
                </div>
              </div>
              <div className="contact-form">
                <h3>Написать команде</h3>
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Имя</label>
                    <input type="text" id="name" name="name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Тема</label>
                    <select id="subject" name="subject" required defaultValue="Инвестиции и сотрудничество">
                      <option>Инвестиции и сотрудничество</option>
                      <option>Пилотный проект</option>
                      <option>Вопрос о платформе</option>
                      <option>Партнёрство</option>
                      <option>Другое</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Сообщение</label>
                    <textarea id="message" name="message" rows={5} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Отправить</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 РОББОКС.ТЕХ — доступная робототехническая платформа</p>
          <p>
            <a href="https://t.me/robbox_project" target="_blank" rel="noopener noreferrer">Telegram</a>
            {' • '}
            <a href="mailto:contact@robbox.tech">Email</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
