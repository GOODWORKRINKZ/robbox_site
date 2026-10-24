import { Chassis, Crates, Defs, Mast, SnowBlade } from './drawing/parts'
import './Assembly.css'

/*
 * Сборочный чертёж платформы: три вида одного робота. База, база с модулем
 * (альтернативный модуль пунктиром — вариант исполнения) и база с модулем
 * и мачтой автономности. Виды вычерчиваются плоттером при появлении на экране.
 */

const STAGES = [
  {
    num: '01',
    title: 'База',
    text: 'Доступная подвижная платформа: моторы, колёса, корпус и минимум электроники для управления.',
  },
  {
    num: '02',
    title: 'Навесные модули',
    text: 'Оборудование под конкретную задачу: тележка, отвал, косилка, полки для доставки.',
  },
  {
    num: '03',
    title: 'Модуль автономности',
    text: 'SLAM, планирование маршрута и LLM-агенты: робот получает задание и выполняет его сам.',
  },
]

export default function Assembly() {
  return (
    <div className="assembly">
      {STAGES.map((stage, i) => (
        <article className="view" key={stage.num} data-reveal style={{ transitionDelay: `${i * 120}ms` }}>
          <div className="view-art">
            <svg className="rb-svg" viewBox="0 0 320 300" aria-hidden="true">
              <Defs />
              <rect width="320" height="300" className="view-grid" />
              <path d="M0 262H320" className="i2" />
              <g transform="translate(150 262)">
                {i === 1 && (
                  <g className="ghost">
                    <SnowBlade moving={false} plain />
                  </g>
                )}
                <Chassis moving={false} />
                {i >= 1 && <Crates />}
                {i === 2 && <Mast x={60} top={-114} rays />}
              </g>
              <text x="16" y="26" className="view-num">
                {stage.num}
              </text>
              {i === 1 && (
                <text x="196" y="184" className="view-note">
                  вариант
                </text>
              )}
              {i === 2 && (
                <text x="236" y="96" className="view-note">
                  лидар
                </text>
              )}
            </svg>
            <i className="view-plotter" aria-hidden="true" />
          </div>
          <h3>
            <span className="view-index">{stage.num}</span>
            {stage.title}
          </h3>
          <p>{stage.text}</p>
        </article>
      ))}
    </div>
  )
}
