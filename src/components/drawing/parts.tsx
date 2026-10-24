import type { CSSProperties, ReactNode } from 'react'
import './parts.css'

/*
 * Чертёжные детали робота и окружения.
 *
 * Локальная система робота: земля y = 0, едет вправо (+x), всё в единицах
 * viewBox. Ведущее колесо стоит в начале координат, за ним ящик электроники,
 * сверху платформа на стойках, сзади опорный ролик — как у Б1/Б2. Линии,
 * скрытые колесом, рисуются пунктиром поверх него — как на чертеже.
 */

const WHEEL_R = 42
/** Скорость земли под роботом, ед./с: от неё считаются обороты колёс и бег плиток. */
const SPEED = 120

export type Vars = CSSProperties & { [key: `--${string}`]: string | number }

/** Период оборота колеса радиуса r при скорости SPEED. */
const spin = (r: number) => `${((2 * Math.PI * r) / SPEED).toFixed(2)}s`

const spokes = (n: number, r0: number, r1: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    const c = Math.cos(a)
    const s = Math.sin(a)
    return `M${(c * r0).toFixed(1)} ${(s * r0).toFixed(1)}L${(c * r1).toFixed(1)} ${(s * r1).toFixed(1)}`
  }).join('')

/* ---------- общие определения: сетка листа, штриховка, стрелки, клипы ---------- */

export function Defs() {
  return (
    <defs>
      <pattern id="rb-grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M12 0V60M24 0V60M36 0V60M48 0V60M0 12H60M0 24H60M0 36H60M0 48H60" className="rb-grid-minor" />
        <path d="M0 0V60M0 0H60" className="rb-grid-major" />
      </pattern>
      <pattern id="rb-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0V6" className="rb-hatch-line" />
      </pattern>
      <marker id="rb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M1 1L9 5L1 9" className="rb-arrow" />
      </marker>
      {/* граница «снег / чисто» и «трава высокая / низкая» привязана к модулю, а не к плитке */}
      <clipPath id="rb-ahead-snow">
        <rect x="490" y="0" width="470" height="400" />
      </clipPath>
      <clipPath id="rb-behind-snow">
        <rect x="0" y="0" width="490" height="400" />
      </clipPath>
      <clipPath id="rb-ahead-lawn">
        <rect x="522" y="0" width="438" height="400" />
      </clipPath>
      <clipPath id="rb-behind-lawn">
        <rect x="0" y="0" width="450" height="400" />
      </clipPath>
    </defs>
  )
}

/* ---------- шасси ---------- */

function Wheel({ r, moving, spokesN = 0, hub = 2.5 }: { r: number; moving: boolean; spokesN?: number; hub?: number }) {
  return (
    <g className={`rb-wheel ${moving ? 'is-spinning' : ''}`} style={{ '--spin': spin(r) } as Vars}>
      <circle r={r} className="solid" />
      {spokesN > 0 && <circle r={r - 3} className="i3" />}
      {spokesN > 0 && <circle r={r - 8} />}
      <circle r={hub} />
      {spokesN > 0 ? (
        <path d={spokes(spokesN, hub + 2, r - 11)} className="i2" />
      ) : (
        <path d={`M0 ${-hub - 1}V${-r + 3}`} className="i2" />
      )}
    </g>
  )
}

export function Chassis({ moving = true }: { moving?: boolean }) {
  return (
    <g className="rb-chassis">
      {/* ящик электроники между колёсами */}
      <rect x={-36} y={-98} width={72} height={60} />
      {/* платформа и стойки */}
      <rect x={-80} y={-114} width={192} height={6} />
      <path d="M-22 -108v10M22 -108v10" className="i2" />
      {/* задняя стойка и опорный ролик */}
      <path d="M94 -108v82M106 -108v82M90 -26h20" className="i2" />
      <g transform="translate(100 -12)">
        <Wheel r={12} moving={moving} />
      </g>
      {/* ведущее колесо */}
      <g transform={`translate(0 ${-WHEEL_R})`}>
        <Wheel r={WHEEL_R} moving={moving} spokesN={5} hub={9} />
      </g>
      {/* рёбра ящика, скрытые колесом */}
      <path d="M-36 -63.6V-38H36V-63.6" className="hid" />
    </g>
  )
}

/** Мачта автономности: стойка, лидар и вращающийся луч. */
export function Mast({ x, top, moving = true, rays = false }: { x: number; top: number; moving?: boolean; rays?: boolean }) {
  return (
    <g transform={`translate(${x} ${top})`}>
      <path d="M0 0v-24" />
      <rect x={-12} y={-36} width={24} height={12} rx={2} className="solid" />
      <path d="M-12 -30h24" className="i3" />
      {rays && <path d="M12 -30l84 -30M12 -30l90 -14M12 -30h92M12 -30l90 14M12 -30l84 30" className="hid i3" />}
      <g transform="translate(0 -30)" className={`rb-rotor ${moving ? 'is-spinning' : ''}`}>
        <circle r={70} className="bbox" />
        <path d="M0 0h70" className="beam" />
      </g>
    </g>
  )
}

/* ---------- навесные модули ---------- */

export function Crates() {
  return (
    <g className="rb-module">
      <rect x={-72} y={-158} width={56} height={44} className="solid" />
      <path d="M-72 -136h56" className="i3" />
      <rect x={-51} y={-150} width={14} height={3} rx={1.5} className="i2" />
      <rect x={-8} y={-150} width={48} height={36} className="solid" />
      <path d="M-8 -132h48" className="i3" />
      <rect x={10} y={-143} width={12} height={3} rx={1.5} className="i2" />
    </g>
  )
}

export function SnowBlade({ moving = true, plain = false }: { moving?: boolean; plain?: boolean }) {
  return (
    <g className="rb-module">
      <path d="M36 -72L74 -58M36 -56L74 -44" className="i2" />
      <path d="M72 -66C96 -58 100 -30 90 -2" className="bold" />
      <path d="M72 -66h-6v8" className="i2" />
      {!plain && <path d="M90 -2C98 -30 124 -36 152 -14L158 0H90Z" className="hatch i2" />}
      {!plain && moving && (
        <g className="rb-chunks">
          {[0, 0.45, 0.9].map((d, i) => (
            <circle key={d} cx={116 + i * 8} cy={-30} r={2} className="chunk i2" style={{ '--d': `${d}s` } as Vars} />
          ))}
        </g>
      )}
    </g>
  )
}

export function Mower({ moving = true }: { moving?: boolean }) {
  return (
    <g className="rb-module">
      <path d="M36 -72L52 -34M36 -58L50 -30" className="i2" />
      <rect x={48} y={-30} width={76} height={20} rx={6} className="solid" />
      <rect x={76} y={-58} width={28} height={28} rx={2} className="solid" />
      <path d="M82 -58a8 8 0 0 1 16 0" className="i2" />
      <path d="M81 -44h8M81 -39h8" className="i3" />
      <g transform="translate(120 -7)">
        <Wheel r={7} moving={moving} />
      </g>
      {moving && (
        <g className="rb-clips">
          {[0, 0.3, 0.6, 0.9].map((d, i) => (
            <path key={d} d={`M${52 - i * 2} ${-22 - i * 3}l-4 -3`} className="clip i2" style={{ '--d': `${d}s` } as Vars} />
          ))}
        </g>
      )}
    </g>
  )
}

export function Tower({ moving = true }: { moving?: boolean }) {
  return (
    <g className="rb-module">
      <rect x={-56} y={-212} width={64} height={98} rx={3} className="solid" />
      <path d="M-56 -146h64M-56 -180h64" className="i2" />
      <rect x={-46} y={-170} width={24} height={24} />
      <path d="M-34 -170v24" className="i3" />
      <rect x={-30} y={-196} width={18} height={16} />
      <rect x={4} y={-206} width={10} height={6} className="i2" />
      <Mast x={-24} top={-212} moving={moving} />
      <path d="M-30 -92h60" className={`led ${moving ? 'is-running' : ''}`} />
    </g>
  )
}

/* ---------- бегущие плитки окружения ---------- */

type ScrollerProps = { width: number; factor: number; span?: number; className?: string; children: ReactNode }

/** Повторяет плитку шириной width столько раз, чтобы закрыть лист, и гонит её влево со скоростью SPEED·factor. */
export function Scroller({ width, factor, span = 960, className = '', children }: ScrollerProps) {
  const copies = Math.ceil(span / width) + 1
  const dur = width / (SPEED * factor)
  return (
    <g className={`rb-scroll ${className}`} style={{ '--w': width, '--t': `${dur.toFixed(2)}s` } as Vars}>
      {Array.from({ length: copies }, (_, i) => (
        <g key={i} transform={`translate(${i * width} 0)`}>
          {children}
        </g>
      ))}
    </g>
  )
}
