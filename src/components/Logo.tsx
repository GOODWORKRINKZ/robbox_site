import { useEffect, useId, useRef } from 'react'
import './Logo.css'

/*
 * Знак роббокс.тех
 *
 * В основе одна окружность радиуса R — из неё собраны все буквы: о — целая
 * окружность, р — она же плюс стойка вниз, с — её дуга, к — та же дуга плюс
 * стойка, е — окружность с перекладиной, б — окружность, вписанная в квадрат
 * со стороной в её диаметр (роббокс = robot + box).
 *
 * Две б в центре зеркальны друг другу: стойки сходятся к центру, перекладины
 * бровей уходят наружу под прямым углом, а окружности внутри квадратов
 * превращаются в объективы со зрачком-точкой. Получается лицо.
 *
 * Скелет рисуется штрихом T. В варианте outline тот же скелет рисуется
 * в маске дважды — белым на T и чёрным на T-2C, — и от трубки остаётся
 * только контур толщиной C с каждой стороны. Пересечения штрихов при этом
 * зарастают сами собой, поэтому контур получается общий, а не по буквам.
 */

const T = 14 // толщина штриха
const H = T / 2 // полуштрих: на него осевая отступает от видимого края
const C = 3.2 // толщина контура в варианте outline
const R = 40 // радиус той самой окружности (по осевой)
const CX = R + H // центр окружности от видимого левого края буквы
const CY = -(R + H) // центр окружности над базовой линией
const BROW = -132 // высота перекладины над базовой линией
const GAP = 50 // раскрытие дуги у с и к, градусов

const EYE = { r: R, pupil: 9, cy: CY }
const EYE_CX = [275, 377] // центры глаз в координатах viewBox
const PUPIL_MAX = 10

const VIEWBOX = { x: -10, y: -146, w: 1144, h: 201 }

/** Точка на окружности: угол от «востока», против часовой стрелки. */
const at = (cx: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return `${(cx + R * Math.cos(a)).toFixed(1)} ${(CY - R * Math.sin(a)).toFixed(1)}`
}

/** Дуга окружности с раскрытием 2·GAP справа — из неё сделаны и с, и к. */
const arc = (cx: number) => `M${at(cx, GAP)} A${R} ${R} 0 1 0 ${at(cx, -GAP)}`

/* --- буквы. Локальная система: базовая линия y=0, видимый левый край x=0 --- */

/** р — окружность и стойка, уходящая под базовую линию. */
const Rho = () => (
  <g>
    <path d={`M${H} ${CY - R} L${H} 40`} />
    <circle cx={CX} cy={CY} r={R} />
  </g>
)

/** о — целая окружность. */
const Omicron = () => <circle cx={CX} cy={CY} r={R} />

/**
 * б — та же окружность, вписанная в квадрат со стороной в её диаметр,
 * плюс стойка с перекладиной под прямым углом.
 */
const Be = () => (
  <g>
    <rect x={H} y={CY - R} width={R * 2} height={R * 2} />
    <path d={`M${CX + R} ${BROW} L${H} ${BROW} L${H} ${CY - R}`} />
    <circle cx={CX} cy={CY} r={R} />
  </g>
)

/** к — стойка и та же дуга, что у с, отодвинутая ровно на толщину штриха. */
const Ka = () => (
  <g>
    <path d={`M${H} ${CY - R} L${H} ${CY + R}`} />
    <path d={arc(CX + 28)} />
  </g>
)

/** с — просто дуга. */
const Es = () => <path d={arc(CX)} />

const Dot = () => <path d={`M${H} ${-H} L${H} ${-H}`} />

const Te = () => (
  <g>
    <path d={`M${H} ${CY - R} L${CX + R} ${CY - R}`} />
    <path d={`M${CX} ${CY - R} L${CX} ${-H}`} />
  </g>
)

/** е — окружность с перекладиной и вырезом справа внизу. */
const Ye = () => (
  <g>
    <path d={`M${CX + R} ${CY} A${R} ${R} 0 1 0 ${at(CX, -GAP)}`} />
    <path d={`M${H} ${CY} L${CX + R} ${CY}`} />
  </g>
)

const Ha = () => (
  <g>
    <path d={`M${H} ${CY - R} L79 ${-H}`} />
    <path d={`M79 ${CY - R} L${H} ${-H}`} />
  </g>
)

/**
 * Весь скелет знака. Рисуется дважды: в белом и чёрном проходе маски.
 * Зеркалится первая б, а не вторая: стойки уходят к центру, а перекладины
 * расходятся наружу.
 */
const Skeleton = ({ suffix = true }: { suffix?: boolean }) => (
  <g fill="none">
    <g transform="translate(0,0)"><Rho /></g>
    <g transform="translate(114,0)"><Omicron /></g>
    <g transform="translate(322,0) scale(-1,1)"><Be /></g>
    <g transform="translate(330,0)"><Be /></g>
    <g transform="translate(444,0)"><Omicron /></g>
    <g transform="translate(558,0)"><Ka /></g>
    <g transform="translate(686,0)"><Es /></g>
    {suffix && (
      <>
        <g transform="translate(780,0)"><Dot /></g>
        <g transform="translate(810,0)"><Te /></g>
        <g transform="translate(924,0)"><Ye /></g>
        <g transform="translate(1038,0)"><Ha /></g>
      </>
    )}
  </g>
)

type LogoProps = {
  className?: string
  /** outline — неоновая трубка, solid — залитый штрих для мелких размеров. */
  variant?: 'outline' | 'solid'
  /** Оживлять глаза: моргание и слежение за курсором. */
  alive?: boolean
  /** Показывать «.тех». */
  suffix?: boolean
  title?: string
}

export default function Logo({
  className = '',
  variant = 'outline',
  alive = true,
  suffix = true,
  title = 'роббокс.тех',
}: LogoProps) {
  const uid = useId().replace(/:/g, '')
  const svgRef = useRef<SVGSVGElement>(null)
  const pupils = useRef<Array<SVGGElement | null>>([])

  useEffect(() => {
    if (!alive) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let pointer: { x: number; y: number } | null = null

    const apply = () => {
      frame = 0
      const svg = svgRef.current
      if (!svg || !pointer) return
      const box = svg.getBoundingClientRect()
      if (!box.width) return
      const scale = box.width / VIEWBOX.w

      EYE_CX.forEach((cx, i) => {
        const node = pupils.current[i]
        if (!node) return
        const ex = box.left + (cx - VIEWBOX.x) * scale
        const ey = box.top + (EYE.cy - VIEWBOX.y) * scale
        const dx = pointer!.x - ex
        const dy = pointer!.y - ey
        const dist = Math.hypot(dx, dy) || 1
        // чем дальше курсор, тем сильнее зрачок уходит в его сторону — до упора
        const pull = Math.min(1, dist / Math.max(260 * scale, 80)) * PUPIL_MAX
        node.style.setProperty('--px', `${(dx / dist) * pull}px`)
        node.style.setProperty('--py', `${(dy / dist) * pull}px`)
      })
    }

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(apply)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [alive])

  const ink = `url(#${uid}-ink)`
  // острые углы у квадратов и бровей — как на вывеске; торцы оставляем круглыми
  const strokeProps = { strokeLinecap: 'round' as const, strokeLinejoin: 'miter' as const }

  const pupilNodes = (fill: string) =>
    EYE_CX.map((cx, i) => (
      <g key={cx} className="rbx-pupil" ref={(node) => { pupils.current[i] = node }}>
        <g className="rbx-blink" style={{ transformOrigin: `${cx}px ${EYE.cy}px` }}>
          <circle cx={cx} cy={EYE.cy} r={EYE.pupil} fill={fill} />
        </g>
      </g>
    ))

  return (
    <svg
      ref={svgRef}
      className={`rbx-logo rbx-${variant} ${alive ? 'is-alive' : ''} ${className}`.trim()}
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${uid}-ink`} gradientUnits="userSpaceOnUse" x1="0" y1="-140" x2="1060" y2="50">
          <stop offset="0" stopColor="#E9D8FF" />
          <stop offset="0.5" stopColor="#B49CFF" />
          <stop offset="1" stopColor="#8B7BFF" />
        </linearGradient>

        {variant === 'outline' && (
          <mask id={`${uid}-mask`}>
            <g stroke="#fff" strokeWidth={T} {...strokeProps}>
              <Skeleton suffix={suffix} />
            </g>
            <g stroke="#000" strokeWidth={T - 2 * C} {...strokeProps}>
              <Skeleton suffix={suffix} />
            </g>
            {pupilNodes('#fff')}
          </mask>
        )}
      </defs>

      {variant === 'outline' ? (
        <rect
          x={VIEWBOX.x}
          y={VIEWBOX.y}
          width={VIEWBOX.w}
          height={VIEWBOX.h}
          fill={ink}
          mask={`url(#${uid}-mask)`}
        />
      ) : (
        <g>
          <g stroke={ink} strokeWidth={T} {...strokeProps}>
            <Skeleton suffix={suffix} />
          </g>
          {pupilNodes(ink)}
        </g>
      )}
    </svg>
  )
}
