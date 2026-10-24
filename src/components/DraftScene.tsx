import { useCallback, useEffect, useRef, useState } from 'react'
import { Chassis, Defs } from './drawing/parts'
import { SCENES, type Scene } from './drawing/scenes'
import './DraftScene.css'

/*
 * Лист с роботом. Шасси стоит в кадре и едет всё время; каждые SCENE_MS
 * плоттер проходит по листу слева направо, стирая старое окружение и
 * навесной модуль и вычерчивая новые. Пока лист не виден — всё на паузе.
 */

const SCENE_MS = 7000
const WIPE_MS = 900
const ROBOT_X = 400
const GROUND_Y = 330

type Phase = 'idle' | 'enter' | 'leave'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = () => setMatches(list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** Окружение за роботом: дальний план, земля, подпись листа. */
function SceneBack({ scene, phase }: { scene: Scene; phase: Phase }) {
  const { Far, Ground } = scene
  return (
    <g className={`rb-scene is-${phase}`}>
      <rect className="bbox" width="960" height="400" />
      <Far />
      <Ground />
      <text x="28" y="40" className="rb-label">
        {scene.num} / 0{SCENES.length} — {scene.title.toUpperCase()}
      </text>
      <text x="858" y="382" className="rb-stamp-text">
        лист {scene.num}
      </text>
    </g>
  )
}

/** Перед роботом: навесной модуль, выноска и передний план. */
function SceneFront({ scene, phase, moving }: { scene: Scene; phase: Phase; moving: boolean }) {
  const { Fore, Module, leader } = scene
  const [fx, fy] = leader.from
  const [tx, ty] = leader.to
  return (
    <g className={`rb-scene is-${phase}`}>
      <rect className="bbox" width="960" height="400" />
      <g transform={`translate(${ROBOT_X} ${GROUND_Y})`}>
        <Module moving={moving} />
      </g>
      <g className="rb-leader">
        <circle cx={fx} cy={fy} r={2} className="dot" />
        <path d={`M${fx} ${fy}L${tx} ${ty}H${tx + 160}`} />
        <text x={tx + 4} y={ty - 6}>
          навесной модуль — {scene.module}
        </text>
      </g>
      <Fore />
    </g>
  )
}

export default function DraftScene() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  // на телефоне лист кадрируем по центру: робот крупнее, мелкие подписи листа скрыты в CSS
  const narrow = useMediaQuery('(max-width: 640px)')
  const rootRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [running, setRunning] = useState(true)
  const [epoch, setEpoch] = useState(0)

  const go = useCallback((next: number) => {
    if (next === indexRef.current) return
    setLeaving(indexRef.current)
    indexRef.current = next
    setIndex(next)
  }, [])

  // пауза вне экрана и в скрытой вкладке
  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    let inView = true
    let shown = document.visibilityState === 'visible'
    const update = () => setRunning(inView && shown)
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        update()
      },
      { threshold: 0.1 },
    )
    observer.observe(node)
    const onVisibility = () => {
      shown = document.visibilityState === 'visible'
      update()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  // уходящая сцена живёт, пока плоттер её не стёр
  useEffect(() => {
    if (leaving === null) return
    const timer = setTimeout(() => setLeaving(null), WIPE_MS + 100)
    return () => clearTimeout(timer)
  }, [leaving])

  // автопрокрутка сцен; epoch сбрасывает отсчёт после ручного выбора
  useEffect(() => {
    if (reduced || !running) return
    const timer = setInterval(() => go((indexRef.current + 1) % SCENES.length), SCENE_MS)
    return () => clearInterval(timer)
  }, [reduced, running, epoch, go])

  const pick = (next: number) => {
    go(next)
    setEpoch((value) => value + 1)
  }

  const scene = SCENES[index]
  const moving = !reduced
  const phase: Phase = leaving === null ? 'idle' : 'enter'

  return (
    <div className={`draft ${running ? '' : 'is-paused'}`} ref={rootRef}>
      <div className="sheet">
        <div className="sheet-art">
          <div className="sheet-cam">
            <svg
              className="rb-svg sheet-svg"
              viewBox={narrow ? '150 0 660 400' : '0 0 960 400'}
              role="img"
              aria-label={`Чертёж: ${scene.title.toLowerCase()} — навесной модуль ${scene.module}`}
            >
              <Defs />
              <rect width="960" height="400" className="sheet-grid" />
              <path d="M0 330H960" className="groundline" />

              {leaving !== null && <SceneBack key={`b${leaving}`} scene={SCENES[leaving]} phase="leave" />}
              <SceneBack key={`b${index}`} scene={scene} phase={phase} />

              <g transform={`translate(${ROBOT_X} ${GROUND_Y})`}>
                <Chassis moving={moving} />
              </g>

              {leaving !== null && <SceneFront key={`f${leaving}`} scene={SCENES[leaving]} phase="leave" moving={moving} />}
              <SceneFront key={`f${index}`} scene={scene} phase={phase} moving={moving} />

              {/* размер под роботом и штамп листа */}
              <g className="rb-dim">
                <path d="M320 348v18M512 348v18" className="i3" />
                <path d="M322 360H510" markerStart="url(#rb-arrow)" markerEnd="url(#rb-arrow)" />
                <text x="416" y="355" textAnchor="middle">
                  база
                </text>
              </g>
              <g className="rb-stamp">
                <path d="M660 346H940V388H660ZM660 367H940M850 346V388" />
                <text x="668" y="361" className="brand">
                  роббокс.тех
                </text>
                <text x="858" y="361">М 1:10</text>
                <text x="668" y="382">одна база — много задач</text>
              </g>

              {leaving !== null && (
                <g key={`p${index}`} className="rb-plotter">
                  <path d="M0 0V400" />
                  <path d="M-4 0h8M-4 400h8" />
                </g>
              )}
            </svg>
          </div>
        </div>

        <div className="sheet-tabs" role="tablist" aria-label="Сцены">
          {SCENES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`sheet-tab ${i === index ? 'is-active' : ''}`}
              onClick={() => pick(i)}
            >
              <span className="sheet-tab-num">{item.num}</span>
              <span className="sheet-tab-title">{item.title}</span>
              {i === index && moving && (
                <i key={`${index}-${epoch}`} className="sheet-tab-bar" style={{ animationDuration: `${SCENE_MS}ms` }} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </div>

      <p className="sheet-caption" key={scene.id}>
        <span className={`status status-${scene.status.tone}`}>{scene.status.label}</span>
        <span>{scene.text}</span>
      </p>
    </div>
  )
}
