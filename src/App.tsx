import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src="/logo.svg" alt="РОББОКС" className="logo-image" />
          </div>
          <nav className="nav">
            <a href="#about">О проекте</a>
            <a href="#goals">Цели</a>
            <a href="#features">Возможности</a>
            <a href="#hardware">Железо</a>
            <a href="#related">Репозитории</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h2 className="hero-title">Автономный колесный робот-доставщик</h2>
            <p className="hero-subtitle">Образовательная робототехническая платформа на ROS2 для автономной навигации и доставки внутри помещений</p>
            <div className="hero-badges">
              <a href="https://github.com/krikz/rob_box_project" target="_blank" rel="noopener noreferrer" className="badge">
                <span className="badge-icon">📦</span> GitHub
              </a>
              <span className="badge">
                <span className="badge-icon">🤖</span> ROS 2 Humble
              </span>
              <span className="badge">
                <span className="badge-icon">⚡</span> Zenoh DDS
              </span>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <h2 className="section-title">О проекте</h2>
            <p className="section-description">
              РОББОКС - это образовательный проект автономного робота, созданный для изучения работы с ROS2. 
              Проект охватывает основные аспекты разработки роботизированных систем, включая управление движением, 
              обработку данных с датчиков и взаимодействие с пользователем.
            </p>
            
            <div className="demo-section">
              <div className="demo-item">
                <img src="/rviz-demo.gif" alt="Демонстрация робота в RViz" className="demo-gif" />
                <p className="demo-caption">Визуализация робота в RViz - модель с вращающимися колесами</p>
              </div>
              <div className="demo-item">
                <img src="/led-animation.gif" alt="Анимация LED матриц" className="demo-gif" />
                <p className="demo-caption">Редактор анимаций для NeoPixel матриц - эффект торможения</p>
              </div>
            </div>

            <div className="status-grid">
              <div className="status-item">
                <span className="status-icon">✅</span>
                <div>
                  <h3>SLAM картографирование</h3>
                  <p>RTAB-Map с OAK-D + LSLIDAR</p>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon">✅</span>
                <div>
                  <h3>Управление двигателями</h3>
                  <p>VESC контроллеры через CAN шину</p>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon">✅</span>
                <div>
                  <h3>LED индикация</h3>
                  <p>Управление NeoPixel матрицами</p>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon">✅</span>
                <div>
                  <h3>Голосовой ассистент</h3>
                  <p>Распознавание речи и синтез</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="goals" className="section section-alt">
          <div className="container">
            <h2 className="section-title">Цели проекта</h2>
            
            <div className="goal-phase">
              <h3 className="phase-title">Этап 1: Автономная навигация</h3>
              <div className="goal-list">
                <div className="goal-item completed">
                  <span className="goal-check">✓</span>
                  <span>Построение карты помещения с помощью RTAB-Map SLAM</span>
                </div>
                <div className="goal-item completed">
                  <span className="goal-check">✓</span>
                  <span>Локализация робота на карте</span>
                </div>
                <div className="goal-item completed">
                  <span className="goal-check">✓</span>
                  <span>Планирование траектории и навигация</span>
                </div>
                <div className="goal-item in-progress">
                  <span className="goal-check">○</span>
                  <span>Разметка карты (точки интереса, зоны доставки)</span>
                </div>
              </div>
            </div>

            <div className="goal-phase">
              <h3 className="phase-title">Этап 2: Бизнес-процесс доставки</h3>
              <div className="goal-list">
                <div className="goal-item planned">
                  <span className="goal-check">□</span>
                  <span>Клиентское приложение для вызова робота</span>
                </div>
                <div className="goal-item planned">
                  <span className="goal-check">□</span>
                  <span>Доставка предметов из точки A в точку B</span>
                </div>
                <div className="goal-item planned">
                  <span className="goal-check">□</span>
                  <span>Док-станция для автоматической подзарядки</span>
                </div>
                <div className="goal-item in-progress">
                  <span className="goal-check">○</span>
                  <span>Голосовой ассистент для взаимодействия</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="container">
            <h2 className="section-title">Ключевые возможности</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3>SLAM и картографирование</h3>
                <p>Построение 3D-карты в реальном времени с помощью RTAB-Map, RGB-D камеры и 2D лидара для точной навигации в помещении</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚙️</div>
                <h3>Управление двигателями</h3>
                <p>Четыре контроллера VESC, соединенные через CAN шину для точного независимого управления 4 колесами</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💡</div>
                <h3>LED дисплей</h3>
                <p>Несколько NeoPixel матриц для визуальной обратной связи - фары и основная панель дисплея 5×25</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📡</div>
                <h3>Сенсорный хаб</h3>
                <p>Сенсорная плата на ESP32 с датчиками температуры, влажности, веса и управлением вентиляторами</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎤</div>
                <h3>Голосовой ассистент</h3>
                <p>Микрофонная решетка ReSpeaker для распознавания речи и естественного голосового взаимодействия</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Система мониторинга</h3>
                <p>Стек Grafana, Prometheus и Loki для комплексного мониторинга состояния робота</p>
              </div>
            </div>
          </div>
        </section>

        <section id="hardware" className="section section-alt">
          <div className="container">
            <h2 className="section-title">Технические характеристики</h2>
            
            <div className="hardware-grid">
              <div className="hardware-category">
                <h3 className="category-title">Механика и привод</h3>
                <ul className="spec-list">
                  <li><strong>Колеса:</strong> 4×10" (от электросамоката)</li>
                  <li><strong>Контроллеры:</strong> 4× VESC (CAN шина)</li>
                  <li><strong>Интерфейс:</strong> <a href="https://github.com/krikz/vesc_nexus" target="_blank" rel="noopener noreferrer">vesc_nexus</a> ROS2 драйвер</li>
                  <li><strong>CAN Shield:</strong> Установлен на Main Pi</li>
                </ul>
              </div>

              <div className="hardware-category">
                <h3 className="category-title">Бортовые компьютеры</h3>
                <ul className="spec-list">
                  <li><strong>Main Pi:</strong> Raspberry Pi 5, 15GB RAM
                    <ul className="sub-list">
                      <li>RTAB-Map SLAM</li>
                      <li>Навигация и планирование</li>
                      <li>Драйвер LSLIDAR</li>
                      <li>Сервисы восприятия</li>
                    </ul>
                  </li>
                  <li><strong>Vision Pi:</strong> Raspberry Pi 5, 8GB RAM
                    <ul className="sub-list">
                      <li>Драйвер OAK-D-Lite</li>
                      <li>Детектор AprilTag</li>
                      <li>Raspberry Pi Camera</li>
                      <li>Голосовой ассистент (ReSpeaker)</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="hardware-category">
                <h3 className="category-title">Датчики</h3>
                <ul className="spec-list">
                  <li><strong>Камера:</strong> OAK-D-Lite (RGB + стерео глубина)</li>
                  <li><strong>Pi Camera:</strong> Локализация по потолку</li>
                  <li><strong>Лидар:</strong> LSLIDAR N10 (360° 2D)</li>
                  <li><strong>Микрофон:</strong> ReSpeaker Mic Array v2.0</li>
                  <li><strong>Сенсорная плата:</strong> ESP32 с micro-ROS
                    <ul className="sub-list">
                      <li>Датчики температуры/влажности AHT30</li>
                      <li>Тензодатчик HX711 (вес)</li>
                      <li>2× вентилятора PWM с тахометром</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="hardware-category">
                <h3 className="category-title">Индикация</h3>
                <ul className="spec-list">
                  <li><strong>Управление LED:</strong> <a href="https://github.com/krikz/ros2leds" target="_blank" rel="noopener noreferrer">ros2leds</a> ROS2 драйвер</li>
                  <li><strong>Фары:</strong> 4× NeoPixel матрицы 8×8</li>
                  <li><strong>Основной дисплей:</strong> 5× NeoPixel 5×5 (всего 5×25)</li>
                  <li><strong>Композитор:</strong> Объединяет панели в логические группы</li>
                </ul>
              </div>

              <div className="hardware-category">
                <h3 className="category-title">Программный стек</h3>
                <ul className="spec-list">
                  <li><strong>ОС:</strong> Ubuntu 24.04.2 LTS</li>
                  <li><strong>Фреймворк:</strong> ROS 2 Humble Hawksbill</li>
                  <li><strong>Middleware:</strong> Zenoh DDS (rmw_zenoh_cpp)</li>
                  <li><strong>SLAM:</strong> RTAB-Map (RGB-D + 2D лидар)</li>
                  <li><strong>Камера:</strong> DepthAI для OAK-D-Lite</li>
                  <li><strong>Контейнеризация:</strong> Docker + Docker Compose</li>
                </ul>
              </div>

              <div className="hardware-category">
                <h3 className="category-title">Коммуникация</h3>
                <ul className="spec-list">
                  <li><strong>Middleware:</strong> Zenoh DDS</li>
                  <li><strong>Сеть:</strong> WiFi роутер D-Link DIR-320</li>
                  <li><strong>Связь между Pi:</strong> Zenoh router для оптимизации трафика</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="related" className="section">
          <div className="container">
            <h2 className="section-title">Связанные репозитории</h2>
            <div className="repos-grid">
              <a href="https://github.com/krikz/rob_box_project" target="_blank" rel="noopener noreferrer" className="repo-card">
                <h3>rob_box_project</h3>
                <p>Основной репозиторий проекта с полным стеком ROS2, конфигурацией Docker и подробной документацией</p>
                <span className="repo-link">Смотреть на GitHub →</span>
              </a>
              <a href="https://github.com/krikz/vesc_nexus" target="_blank" rel="noopener noreferrer" className="repo-card">
                <h3>vesc_nexus</h3>
                <p>ROS2 драйвер для моторных контроллеров VESC через CAN шину. Поддержка нескольких VESC с публикацией одометрии</p>
                <span className="repo-link">Смотреть на GitHub →</span>
              </a>
              <a href="https://github.com/krikz/ros2leds" target="_blank" rel="noopener noreferrer" className="repo-card">
                <h3>ros2leds</h3>
                <p>ROS2 драйвер для NeoPixel LED матриц через SPI. Включает композитор для объединения нескольких панелей</p>
                <span className="repo-link">Смотреть на GitHub →</span>
              </a>
              <a href="https://github.com/krikz/robot_sensor_hub" target="_blank" rel="noopener noreferrer" className="repo-card">
                <h3>robot_sensor_hub</h3>
                <p>Сенсорная плата ESP32 с micro-ROS. Датчики температуры, влажности, веса и управление вентиляторами</p>
                <span className="repo-link">Смотреть на GitHub →</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>РОББОКС - Образовательный проект автономного робота</p>
          <p>
            <a href="https://github.com/krikz/rob_box_project" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {' • '}
            Создано с ROS 2 Humble • На базе Zenoh DDS
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
