import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">РОББОКС</h1>
          <nav className="nav">
            <a href="#about">About</a>
            <a href="#goals">Goals</a>
            <a href="#features">Features</a>
            <a href="#hardware">Hardware</a>
            <a href="#related">Related Projects</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h2 className="hero-title">Autonomous Wheeled Delivery Robot</h2>
            <p className="hero-subtitle">Educational ROS2-based robotics platform for indoor autonomous navigation and delivery</p>
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
            <h2 className="section-title">About the Project</h2>
            <p className="section-description">
              ROBBOX is an educational autonomous robot project designed for learning ROS2 robotics development. 
              The project covers fundamental aspects of robotic systems development including motion control, 
              sensor data processing, and user interaction.
            </p>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-icon">✅</span>
                <div>
                  <h3>SLAM Mapping</h3>
                  <p>RTAB-Map with OAK-D + LSLIDAR</p>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon">✅</span>
                <div>
                  <h3>Motor Control</h3>
                  <p>VESC controllers via CAN bus</p>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon">✅</span>
                <div>
                  <h3>LED Indication</h3>
                  <p>NeoPixel matrix control</p>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon">✅</span>
                <div>
                  <h3>Voice Assistant</h3>
                  <p>Speech recognition & TTS</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="goals" className="section section-alt">
          <div className="container">
            <h2 className="section-title">Project Goals</h2>
            
            <div className="goal-phase">
              <h3 className="phase-title">Phase 1: Autonomous Navigation</h3>
              <div className="goal-list">
                <div className="goal-item completed">
                  <span className="goal-check">✓</span>
                  <span>Map building using RTAB-Map SLAM</span>
                </div>
                <div className="goal-item completed">
                  <span className="goal-check">✓</span>
                  <span>Robot localization on the map</span>
                </div>
                <div className="goal-item completed">
                  <span className="goal-check">✓</span>
                  <span>Path planning and navigation</span>
                </div>
                <div className="goal-item in-progress">
                  <span className="goal-check">○</span>
                  <span>Map annotation (POIs, delivery zones)</span>
                </div>
              </div>
            </div>

            <div className="goal-phase">
              <h3 className="phase-title">Phase 2: Delivery Business Process</h3>
              <div className="goal-list">
                <div className="goal-item planned">
                  <span className="goal-check">□</span>
                  <span>Client application for robot calling</span>
                </div>
                <div className="goal-item planned">
                  <span className="goal-check">□</span>
                  <span>Delivery of items from point A to point B</span>
                </div>
                <div className="goal-item planned">
                  <span className="goal-check">□</span>
                  <span>Docking station for automatic charging</span>
                </div>
                <div className="goal-item in-progress">
                  <span className="goal-check">○</span>
                  <span>Voice assistant for user interaction</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="container">
            <h2 className="section-title">Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3>SLAM & Mapping</h3>
                <p>Real-time 3D mapping using RTAB-Map with RGB-D camera and 2D LiDAR for precise indoor navigation</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚙️</div>
                <h3>Motor Control</h3>
                <p>Four VESC controllers connected via CAN bus for precise 4-wheel independent motor control</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💡</div>
                <h3>LED Display</h3>
                <p>Multiple NeoPixel matrices for visual feedback - headlights and main 5×25 display panel</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📡</div>
                <h3>Sensor Hub</h3>
                <p>ESP32-based sensor board with temperature, humidity, weight sensors, and fan control</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎤</div>
                <h3>Voice Assistant</h3>
                <p>ReSpeaker microphone array for speech recognition and natural voice interaction</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Monitoring System</h3>
                <p>Grafana, Prometheus, and Loki stack for comprehensive robot health monitoring</p>
              </div>
            </div>
          </div>
        </section>

        <section id="hardware" className="section section-alt">
          <div className="container">
            <h2 className="section-title">Technical Specifications</h2>
            
            <div className="hardware-grid">
              <div className="hardware-category">
                <h3 className="category-title">Mechanics & Drive</h3>
                <ul className="spec-list">
                  <li><strong>Wheels:</strong> 4×10" (electric scooter wheels)</li>
                  <li><strong>Controllers:</strong> 4× VESC (CAN bus)</li>
                  <li><strong>Hardware Interface:</strong> <a href="https://github.com/krikz/vesc_nexus" target="_blank" rel="noopener noreferrer">vesc_nexus</a> ROS2 driver</li>
                  <li><strong>CAN Shield:</strong> Mounted on Main Pi</li>
                </ul>
              </div>

              <div className="hardware-category">
                <h3 className="category-title">Computing</h3>
                <ul className="spec-list">
                  <li><strong>Main Pi:</strong> Raspberry Pi 5, 15GB RAM
                    <ul className="sub-list">
                      <li>RTAB-Map SLAM</li>
                      <li>Navigation & Planning</li>
                      <li>LSLIDAR driver</li>
                      <li>Perception services</li>
                    </ul>
                  </li>
                  <li><strong>Vision Pi:</strong> Raspberry Pi 5, 8GB RAM
                    <ul className="sub-list">
                      <li>OAK-D-Lite driver</li>
                      <li>AprilTag detection</li>
                      <li>Raspberry Pi Camera</li>
                      <li>Voice assistant (ReSpeaker)</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="hardware-category">
                <h3 className="category-title">Sensors</h3>
                <ul className="spec-list">
                  <li><strong>Camera:</strong> OAK-D-Lite (RGB + Stereo Depth)</li>
                  <li><strong>Pi Camera:</strong> Ceiling-based localization</li>
                  <li><strong>LiDAR:</strong> LSLIDAR N10 (360° 2D)</li>
                  <li><strong>Microphone:</strong> ReSpeaker Mic Array v2.0</li>
                  <li><strong>Sensor Board:</strong> ESP32 with micro-ROS
                    <ul className="sub-list">
                      <li>AHT30 temperature/humidity sensors</li>
                      <li>HX711 load cell (weight)</li>
                      <li>2× PWM fans with tachometer</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="hardware-category">
                <h3 className="category-title">Indication</h3>
                <ul className="spec-list">
                  <li><strong>LED Control:</strong> <a href="https://github.com/krikz/ros2leds" target="_blank" rel="noopener noreferrer">ros2leds</a> ROS2 driver</li>
                  <li><strong>Headlights:</strong> 4× NeoPixel 8×8 matrices</li>
                  <li><strong>Main Display:</strong> 5× NeoPixel 5×5 (5×25 total)</li>
                  <li><strong>Compositor:</strong> Combines panels into logical groups</li>
                </ul>
              </div>

              <div className="hardware-category">
                <h3 className="category-title">Software Stack</h3>
                <ul className="spec-list">
                  <li><strong>OS:</strong> Ubuntu 24.04.2 LTS</li>
                  <li><strong>Framework:</strong> ROS 2 Humble Hawksbill</li>
                  <li><strong>Middleware:</strong> Zenoh DDS (rmw_zenoh_cpp)</li>
                  <li><strong>SLAM:</strong> RTAB-Map (RGB-D + 2D LiDAR)</li>
                  <li><strong>Camera:</strong> DepthAI for OAK-D-Lite</li>
                  <li><strong>Containerization:</strong> Docker + Docker Compose</li>
                </ul>
              </div>

              <div className="hardware-category">
                <h3 className="category-title">Communication</h3>
                <ul className="spec-list">
                  <li><strong>Middleware:</strong> Zenoh DDS</li>
                  <li><strong>Network:</strong> WiFi router D-Link DIR-320</li>
                  <li><strong>Inter-Pi Link:</strong> Zenoh router for traffic optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="related" className="section">
          <div className="container">
            <h2 className="section-title">Related Repositories</h2>
            <div className="repos-grid">
              <a href="https://github.com/krikz/rob_box_project" target="_blank" rel="noopener noreferrer" className="repo-card">
                <h3>rob_box_project</h3>
                <p>Main project repository with full ROS2 stack, Docker configuration, and comprehensive documentation</p>
                <span className="repo-link">View on GitHub →</span>
              </a>
              <a href="https://github.com/krikz/vesc_nexus" target="_blank" rel="noopener noreferrer" className="repo-card">
                <h3>vesc_nexus</h3>
                <p>ROS2 driver for VESC motor controllers via CAN bus. Supports multiple VESC units with odometry publishing</p>
                <span className="repo-link">View on GitHub →</span>
              </a>
              <a href="https://github.com/krikz/ros2leds" target="_blank" rel="noopener noreferrer" className="repo-card">
                <h3>ros2leds</h3>
                <p>ROS2 driver for NeoPixel LED matrices via SPI. Features compositor for combining multiple panels</p>
                <span className="repo-link">View on GitHub →</span>
              </a>
              <a href="https://github.com/krikz/robot_sensor_hub" target="_blank" rel="noopener noreferrer" className="repo-card">
                <h3>robot_sensor_hub</h3>
                <p>ESP32 sensor board with micro-ROS. Temperature, humidity, weight sensors, and fan control</p>
                <span className="repo-link">View on GitHub →</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>ROBBOX - Educational Autonomous Robot Project</p>
          <p>
            <a href="https://github.com/krikz/rob_box_project" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {' • '}
            Built with ROS 2 Humble • Powered by Zenoh DDS
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
