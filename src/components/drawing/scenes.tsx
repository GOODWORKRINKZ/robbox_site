/* eslint-disable react-refresh/only-export-components -- файл данных сцен: плитки окружения живут рядом со списком SCENES, при правке он перезагружается целиком */
import type { ReactNode } from 'react'
import { Crates, Mower, Scroller, SnowBlade, Tower, type Vars } from './parts'

/*
 * Окружения четырёх сцен и их описание. Каждая сцена — три бегущих слоя
 * (дальний план 0.4×, земля 1×, передний план 1.6×) плюс навесной модуль
 * на шасси. Всё в координатах листа 960×400, земля на y = 330.
 */

/** Детерминированный «случайный» ряд, чтобы травинки и снежинки не прыгали между рендерами. */
const noise = (i: number, k = 0) => (((i + 1) * 9301 + (k + 1) * 49297) % 233280) / 233280

function Snowfall({ count, width, r, seed }: { count: number; width: number; r: number; seed: number }) {
  return (
    <g className="rb-snow">
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={(noise(i, seed) * width).toFixed(0)}
          cy={0}
          r={r}
          className="flake"
          style={
            {
              '--t': `${(5 + noise(i, seed + 7) * 4).toFixed(2)}s`,
              '--d': `${(-noise(i, seed + 3) * 9).toFixed(2)}s`,
            } as Vars
          }
        />
      ))}
    </g>
  )
}

const Grass = ({ tall }: { tall: boolean }) => (
  <path d={Array.from({ length: 30 }, (_, i) => `M${i * 8} 0v${tall ? -(8 + Math.round(noise(i) * 7)) : -3}`).join('')} className="i2" />
)

/* склад */
const WarehouseFar = () => (
  <Scroller width={480} factor={0.4} className="rb-far">
    <g transform="translate(0 330)">
      {[0, 260].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <path d="M0 0V-250M200 0V-250" />
          <path d="M0 -70H200M0 -150H200M0 -230H200" />
          <path d="M12 -70V-96H48V-70M60 -70V-100H104V-70M120 -70V-92H150V-70M160 -70V-98H190V-70" />
          <path d="M20 -150V-178H70V-150M90 -150V-170H130V-150M140 -150V-182H186V-150" />
          <path d="M10 -230V-252H56V-230M72 -230V-258H118V-230M130 -230V-250H180V-230" />
        </g>
      ))}
    </g>
  </Scroller>
)
const WarehouseGround = () => (
  <Scroller width={240} factor={1} className="rb-ground">
    <g transform="translate(0 330)">
      <path d="M0 10H96" />
      <path d="M40 0v4M140 0v4M200 0v4" className="i3" />
    </g>
  </Scroller>
)
const WarehouseFore = () => (
  <Scroller width={320} factor={1.6} className="rb-fore">
    <path d="M60 40V400" />
  </Scroller>
)

/* снег */
const SnowFar = () => (
  <Scroller width={480} factor={0.4} className="rb-far">
    <g transform="translate(0 330)">
      <path d={Array.from({ length: 8 }, (_, i) => `M${i * 60 + 10} 0v-70M${i * 60 + 6} -70a4 4 0 0 1 8 0`).join('')} />
      <path d="M0 -40H480M0 -58H480" />
      <path d="M130 0v-120M130 -80l-30 -35M130 -100l24 -30M100 -115l-12 -22M154 -130l18 -10" />
      <path d="M400 -60v-150M388 -210h24M394 -210v-8h12v8" />
    </g>
    <Snowfall count={10} width={480} r={1.2} seed={1} />
  </Scroller>
)
const SnowGround = () => (
  <>
    <g clipPath="url(#rb-behind-snow)">
      <Scroller width={240} factor={1} className="rb-ground">
        <g transform="translate(0 330)">
          <path d="M20 0v3M70 0v3M130 0v3M190 0v3" className="i3" />
          <path d="M100 0a6 3 0 0 1 12 0M220 0a5 3 0 0 1 10 0" className="i3" />
        </g>
      </Scroller>
    </g>
    <g clipPath="url(#rb-ahead-snow)">
      <Scroller width={240} factor={1} className="rb-ground">
        <g transform="translate(0 330)">
          <path d="M0 -12q30 -8 60 0t60 0t60 0t60 0V0H0Z" className="hatch i3" />
          <path d="M0 -12q30 -8 60 0t60 0t60 0t60 0" />
        </g>
      </Scroller>
    </g>
  </>
)
const SnowFore = () => (
  <Scroller width={320} factor={1.6} className="rb-fore">
    <Snowfall count={5} width={320} r={2.4} seed={5} />
  </Scroller>
)

/* газон */
const LawnFar = () => (
  <Scroller width={480} factor={0.4} className="rb-far">
    <g transform="translate(0 330)">
      <path d="M20 0v-110h180v110M10 -110l90 -60l90 60M95 0v-50h30v50M40 -90h30v25h-30zM150 -90h30v25h-30z" />
      <path d="M380 0v-90" />
      <path d="M340 -95a22 22 0 0 1 18 -40a28 28 0 0 1 48 -4a24 24 0 0 1 20 42a24 24 0 0 1 -40 32a30 30 0 0 1 -46 -30z" />
      <path d={Array.from({ length: 6 }, (_, i) => `M${230 + i * 22} 0v-36`).join('') + 'M230 -28h110'} />
    </g>
  </Scroller>
)
const LawnGround = () => (
  <>
    <g clipPath="url(#rb-behind-lawn)">
      <Scroller width={240} factor={1} className="rb-ground">
        <g transform="translate(0 330)">
          <Grass tall={false} />
        </g>
      </Scroller>
    </g>
    <g clipPath="url(#rb-ahead-lawn)">
      <Scroller width={240} factor={1} className="rb-ground">
        <g transform="translate(0 330)">
          <Grass tall />
        </g>
      </Scroller>
    </g>
  </>
)
const LawnFore = () => (
  <Scroller width={320} factor={1.6} className="rb-fore">
    <path d="M40 400v-52M48 400v-64M56 400v-46M250 400v-58M258 400v-48" />
  </Scroller>
)

/* коридор */
const CorridorFar = () => (
  <Scroller width={480} factor={0.4} className="rb-far">
    <g transform="translate(0 330)">
      <path d="M0 -8H480" />
      <path d="M40 0v-130h70v130M98 -62h4M300 0v-130h70v130M358 -62h4" />
      <path d="M180 -110h50v20h-50zM190 -100h30M212 -106l8 6l-8 6" />
    </g>
  </Scroller>
)
const CorridorGround = () => (
  <Scroller width={240} factor={1} className="rb-ground">
    <g transform="translate(0 330)">
      <path d="M0 6H240" className="i3" />
      <path d="M0 0v6M40 0v6M80 0v6M120 0v6M160 0v6M200 0v6" className="i3" />
    </g>
  </Scroller>
)
const CorridorFore = () => (
  <Scroller width={320} factor={1.6} className="rb-fore">
    <path d="M110 -20V400" />
  </Scroller>
)

/* ---------- сцены ---------- */

export type Scene = {
  id: string
  num: string
  title: string
  module: string
  text: string
  status: { label: string; tone: 'progress' | 'planned' }
  /** выноска: от точки модуля к полке с подписью, в координатах листа */
  leader: { from: [number, number]; to: [number, number] }
  Far: () => ReactNode
  Ground: () => ReactNode
  Fore: () => ReactNode
  Module: (props: { moving: boolean }) => ReactNode
}

export const SCENES: Scene[] = [
  {
    id: 'warehouse',
    num: '01',
    title: 'Склад',
    module: 'платформа-тележка',
    text: 'Робот возит ящики и мелкие грузы между стеллажами — с пульта или по заданию.',
    status: { label: 'В работе', tone: 'progress' },
    leader: { from: [440, 172], to: [520, 112] },
    Far: WarehouseFar,
    Ground: WarehouseGround,
    Fore: WarehouseFore,
    Module: () => <Crates />,
  },
  {
    id: 'snow',
    num: '02',
    title: 'Снег',
    module: 'отвал',
    text: 'Отвал спереди: платформа чистит дорожки и площадки, снег уходит в сторону.',
    status: { label: 'В планах', tone: 'planned' },
    leader: { from: [492, 290], to: [600, 232] },
    Far: SnowFar,
    Ground: SnowGround,
    Fore: SnowFore,
    Module: ({ moving }) => <SnowBlade moving={moving} />,
  },
  {
    id: 'lawn',
    num: '03',
    title: 'Газон',
    module: 'косилка',
    text: 'Платформа толкает косилку: задание на участок — и покос без участия человека.',
    status: { label: 'Испытания', tone: 'progress' },
    leader: { from: [504, 274], to: [600, 232] },
    Far: LawnFar,
    Ground: LawnGround,
    Fore: LawnFore,
    Module: ({ moving }) => <Mower moving={moving} />,
  },
  {
    id: 'delivery',
    num: '04',
    title: 'Доставка',
    module: 'полки и лидар',
    text: 'Ровер развозит предметы по карте помещения из точки A в точку B и сам объезжает людей.',
    status: { label: 'Пилот', tone: 'progress' },
    leader: { from: [388, 88], to: [470, 60] },
    Far: CorridorFar,
    Ground: CorridorGround,
    Fore: CorridorFore,
    Module: ({ moving }) => <Tower moving={moving} />,
  },
]
