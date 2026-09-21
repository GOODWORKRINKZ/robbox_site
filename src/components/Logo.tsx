import { useEffect, useId, useRef } from 'react'
import './Logo.css'

/*
 * Знак роббокс.тех
 *
 * Строчный неоновый контур. Две буквы б в центре зеркальны друг другу:
 * их тела — скруглённые боксы (РОББОКС = robot + box), внутри — объективы
 * из кольца и зрачка, сверху — брови с наклоном внутрь. Получается лицо.
 *
 * Скелет рисуется штрихом T. В варианте outline тот же скелет рисуется
 * в маске дважды — белым на T и чёрным на T-2C, — и от трубки остаётся
 * только контур толщиной C с каждой стороны. Пересечения штрихов при этом
 * зарастают сами собой, поэтому контур получается общий, а не по буквам.
 */

const T = 16 // толщина трубки
const C = 3.6 // толщина контура в варианте outline
const EYE = { r: 34, pupil: 13, cy: -60 }
const EYE_CX = [324, 500] // центры глаз в координатах viewBox
const PUPIL_MAX = 7

const VIEWBOX = { x: -12, y: -206, w: 1292, h: 268 }

/* --- буквы. Локальная система: базовая линия y=0, визуальный левый край x=0 --- */

const Rho = () => (
  <g>
    <path d="M8 -88 L8 44" />
    <circle cx="48" cy="-48" r="40" />
  </g>
)

const Omicron = () => <circle cx="48" cy="-48" r="40" />

/** б — бокс со скруглёнными углами, стойка и наклонная бровь. */
const Be = () => (
  <g>
    <path d="M8 -120 L92 -120 A36 36 0 0 1 128 -84 L128 -36 A36 36 0 0 1 92 0 L44 0 A36 36 0 0 1 8 -36 Z" />
    <path d="M8 -120 L8 -188 L128 -152" />
    <circle cx="68" cy={EYE.cy} r={EYE.r} />
  </g>
)

const Ka = () => (
  <g>
    <path d="M8 -88 L8 -8" />
    <path d="M8 -48 L78 -88" />
    <path d="M8 -48 L78 -8" />
  </g>
)

const Es = () => <path d="M73.7 -78.6 A40 40 0 1 0 73.7 -17.4" />

const Dot = () => <path d="M8 -8 L8 -8" />

const Te = () => (
  <g>
    <path d="M8 -88 L88 -88" />
    <path d="M48 -88 L48 -8" />
  </g>
)

const Ye = () => (
  <g>
    <path d="M88 -48 A40 40 0 1 0 73.7 -17.4" />
    <path d="M8 -48 L88 -48" />
  </g>
)

const Ha = () => (
  <g>
    <path d="M8 -88 L78 -8" />
    <path d="M78 -88 L8 -8" />
  </g>
)

/**
 * Весь скелет знака. Рисуется дважды: в белом и чёрном проходе маски.
 * Зеркалится первая б, а не вторая: стойки уходят к центру, а «флаги»
 * бровей расходятся наружу.
 */
const Skeleton = ({ suffix = true }: { suffix?: boolean }) => (
  <g fill="none">
    <g transform="translate(0,0)"><Rho /></g>
    <g transform="translate(116,0)"><Omicron /></g>
    <g transform="translate(392,0) scale(-1,1)"><Be /></g>
    <g transform="translate(432,0)"><Be /></g>
    <g transform="translate(588,0)"><Omicron /></g>
    <g transform="translate(704,0)"><Ka /></g>
    <g transform="translate(810,0)"><Es /></g>
    {suffix && (
      <>
        <g transform="translate(918,0)"><Dot /></g>
        <g transform="translate(950,0)"><Te /></g>
        <g transform="translate(1066,0)"><Ye /></g>
        <g transform="translate(1182,0)"><Ha /></g>
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
  const strokeProps = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

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
        <linearGradient id={`${uid}-ink`} gradientUnits="userSpaceOnUse" x1="0" y1="-190" x2="1180" y2="60">
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
