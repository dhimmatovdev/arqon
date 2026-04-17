'use client'

import { useEffect, useState } from 'react'

/* ── Clouds ── */
function Cloud({ x, y, scale = 1, speed = 4 }: { x: number; y: number; scale?: number; speed?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} style={{ animation: `float-cloud ${speed}s ease-in-out infinite` }}>
      <ellipse cx="60" cy="30" rx="55" ry="28" fill="white" opacity="0.92" />
      <ellipse cx="30" cy="38" rx="32" ry="22" fill="white" opacity="0.88" />
      <ellipse cx="90" cy="38" rx="36" ry="22" fill="white" opacity="0.88" />
      <ellipse cx="60" cy="20" rx="38" ry="22" fill="white" opacity="0.78" />
      <ellipse cx="50" cy="26" rx="20" ry="12" fill="white" opacity="0.4" />
    </g>
  )
}

/* ── Hill silhouettes ── */
function Hills() {
  return (
    <g>
      <ellipse cx="180" cy="310" rx="200" ry="90" fill="#4d7c0f" opacity="0.7" />
      <ellipse cx="420" cy="330" rx="160" ry="70" fill="#3f6212" opacity="0.65" />
      <ellipse cx="820" cy="305" rx="190" ry="85" fill="#4d7c0f" opacity="0.7" />
      <ellipse cx="1060" cy="325" rx="170" ry="75" fill="#3f6212" opacity="0.65" />
    </g>
  )
}

/* ── Balloon ── */
function Balloon({ x, y, color, speed = 3.2 }: { x: number; y: number; color: string; speed?: number }) {
  return (
    <g style={{ animation: `balloon-bob ${speed}s ease-in-out infinite` }} transform={`translate(${x},${y})`}>
      <ellipse cx="18" cy="22" rx="17" ry="20" fill={color} opacity="0.9" />
      <ellipse cx="11" cy="13" rx="5" ry="6" fill="white" opacity="0.3" />
      <path d="M18 42 Q20 48 18 54 Q16 48 18 42" stroke="#555" strokeWidth="1.5" fill="none" />
      <polygon points="15,41 18,45 21,41" fill={color} opacity="0.7" />
    </g>
  )
}

/* ── Flag ── */
function Flag({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="4" height="90" rx="2" fill="#78350f" />
      <g className="anim-flag" style={{ transformOrigin: '4px 15px' }}>
        <path d="M4 0 L44 12 L4 28 Z" fill={color} />
        <path d="M4 0 L44 12 L4 28 Z" fill="white" opacity="0.15" />
      </g>
    </g>
  )
}

/* ── Single puller character ── */
function Puller({ x, flip, colors, delay }: { x: number; flip: boolean; colors: { shirt: string; hat: string; skin: string; stripe: string }; delay: number }) {
  const lean = flip ? -18 : 18 // lean toward pit
  return (
    <g
      transform={`translate(${x},0) ${flip ? 'scale(-1,1)' : ''}`}
      style={{ animation: `pull-idle 0.65s ease-in-out ${delay}s infinite` }}
    >
      {/* Hat */}
      <ellipse cx="24" cy="8" rx="16" ry="6" fill={colors.hat} />
      <rect x="12" y="3" width="24" height="11" rx="4" fill={colors.hat} />
      <rect x="9" y="12" width="30" height="4" rx="2" fill={colors.hat} opacity="0.7" />
      {/* Hat band pattern */}
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={10 + i * 5} y="13" width="3" height="3" rx="0.5" fill="white" opacity="0.25" />
      ))}

      {/* Head */}
      <circle cx="24" cy="27" r="12" fill={colors.skin} />
      {/* Face shading */}
      <ellipse cx="24" cy="30" rx="10" ry="7" fill={colors.skin} opacity="0.5" />
      {/* Eyes — determined/squinting */}
      <ellipse cx="19" cy="25.5" rx="2.5" ry="2" fill="#333" />
      <ellipse cx="29" cy="25.5" rx="2.5" ry="2" fill="#333" />
      <ellipse cx="19.8" cy="24.8" rx="1" ry="0.8" fill="white" opacity="0.6" />
      <ellipse cx="29.8" cy="24.8" rx="1" ry="0.8" fill="white" opacity="0.6" />
      {/* Gritting teeth / effort mouth */}
      <path d="M19 31 Q24 34.5 29 31" stroke="#555" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="19.5" y="31" width="9" height="2.5" rx="0.5" fill="white" opacity="0.6" />

      {/* Body — shirt with traditional stripes */}
      <rect x="14" y="39" width="20" height="20" rx="5" fill={colors.shirt} />
      {[0,1,2].map(i => (
        <rect key={i} x={14 + i * 7} y="39" width="4" height="20" rx="1" fill={colors.stripe} opacity="0.45" />
      ))}
      {/* Collar */}
      <path d="M18 39 L24 44 L30 39" stroke={colors.stripe} strokeWidth="1.5" fill="none" opacity="0.7" />

      {/* Arms (pulling rope) */}
      <rect
        x={flip ? 28 : -4} y="44" width="14" height="7" rx="3.5"
        fill={colors.skin}
        style={{ transform: `rotate(${lean}deg)`, transformOrigin: '24px 48px' }}
      />

      {/* Hands gripping */}
      <circle cx={flip ? 36 : 4} cy="47" r="4.5" fill={colors.skin} />

      {/* Legs — spread for balance */}
      <rect x="14" y="58" width="8" height="18" rx="4" fill="#1e3a5f" />
      <rect x="26" y="58" width="8" height="18" rx="4" fill="#1e3a5f" />
      {/* Shoes */}
      <ellipse cx="18" cy="76" rx="7" ry="4" fill="#1a1a1a" />
      <ellipse cx="30" cy="76" rx="7" ry="4" fill="#1a1a1a" />
      <ellipse cx="16" cy="74" rx="3" ry="2" fill="#333" opacity="0.5" />
      <ellipse cx="28" cy="74" rx="3" ry="2" fill="#333" opacity="0.5" />
    </g>
  )
}

const LEFT_CHARS = [
  { shirt: '#2563eb', hat: '#1e40af', skin: '#fbbf24', stripe: '#93c5fd' },
  { shirt: '#7c3aed', hat: '#5b21b6', skin: '#fcd34d', stripe: '#c4b5fd' },
  { shirt: '#059669', hat: '#065f46', skin: '#fbbf24', stripe: '#6ee7b7' },
]
const RIGHT_CHARS = [
  { shirt: '#dc2626', hat: '#991b1b', skin: '#fbbf24', stripe: '#fca5a5' },
  { shirt: '#d97706', hat: '#92400e', skin: '#fcd34d', stripe: '#fde68a' },
  { shirt: '#db2777', hat: '#9d174d', skin: '#fbbf24', stripe: '#fbcfe8' },
]

/* ── Rope with braided look ── */
function Rope({ offset }: { offset: number }) {
  const W = 760
  const segs = 22
  const sw = W / segs

  return (
    <g transform={`translate(${offset}, 0)`}>
      {/* Rope shadow */}
      <rect x="0" y="6" width={W} height="18" rx="9" fill="rgba(0,0,0,0.35)" />

      {/* Braided segments */}
      {Array.from({ length: segs }).map((_, i) => {
        const x = i * sw
        const even = i % 2 === 0
        return (
          <g key={i}>
            <rect
              x={x} y={even ? 2 : 8} width={sw + 1} height={even ? 16 : 16}
              rx="6"
              fill={even ? '#8B5E3C' : '#D4A264'}
            />
            <rect
              x={x + 2} y={even ? 3 : 9} width={sw - 3} height="5"
              rx="3"
              fill="rgba(255,255,255,0.18)"
            />
          </g>
        )
      })}

      {/* Main rope outline */}
      <rect x="0" y="2" width={W} height="20" rx="10"
        fill="none"
        stroke="#5C3A1E"
        strokeWidth="2"
        opacity="0.4"
      />

      {/* Rope end caps */}
      <ellipse cx="6" cy="12" rx="8" ry="12" fill="#6b3e1e" />
      <ellipse cx={W - 6} cy="12" rx="8" ry="12" fill="#6b3e1e" />
    </g>
  )
}

/* ── Referee ── */
function Referee() {
  return (
    <g transform="translate(-30, -100)">
      {/* Cap */}
      <ellipse cx="30" cy="8" rx="20" ry="7" fill="#111" />
      <rect x="14" y="3" width="32" height="13" rx="4" fill="#111" />
      <rect x="10" y="14" width="40" height="5" rx="2" fill="#222" />
      {/* Head */}
      <circle cx="30" cy="28" r="18" fill="#fbbf24" />
      <ellipse cx="23" cy="22" rx="3" ry="2.5" fill="white" />
      <ellipse cx="37" cy="22" rx="3" ry="2.5" fill="white" />
      <circle cx="23" cy="22.5" r="1.8" fill="#111" />
      <circle cx="37" cy="22.5" r="1.8" fill="#111" />
      <ellipse cx="30" cy="33" rx="6" ry="4" fill="#cc2200" />
      <ellipse cx="30" cy="32" rx="5" ry="2" fill="#ff6644" />
      {/* Whistle */}
      <rect x="28" y="35" width="14" height="5" rx="2.5" fill="#ccc" />
      <circle cx="44" cy="37.5" r="3" fill="#aaa" />
      {/* Shirt striped */}
      <rect x="14" y="46" width="32" height="30" rx="7" fill="#eee" />
      {[0,1,2,3].map(i => (
        <rect key={i} x={14 + i * 8} y="46" width="5" height="30" rx="1" fill="#111" opacity="0.75" />
      ))}
      {/* Arms spread */}
      <rect x="-8" y="52" width="22" height="9" rx="4.5" fill="#fbbf24" />
      <rect x="46" y="52" width="22" height="9" rx="4.5" fill="#fbbf24" />
      {/* Legs */}
      <rect x="16" y="75" width="11" height="20" rx="5" fill="#222" />
      <rect x="33" y="75" width="11" height="20" rx="5" fill="#222" />
      <ellipse cx="21" cy="95" rx="9" ry="5" fill="#111" />
      <ellipse cx="39" cy="95" rx="9" ry="5" fill="#111" />
    </g>
  )
}

/* ── Main Scene Component ── */
interface GameSceneProps {
  ropePos: number   // -8 to +8
  winner: 'left' | 'right' | null
}

export default function GameScene({ ropePos, winner }: GameSceneProps) {
  const W = 1280, H = 340
  const ropeOffset = ropePos * 18  // pixels the rope shifts

  // Characters shift opposite to rope (losing team gets pulled)
  const leftOffset = -ropeOffset * 0.55
  const rightOffset = -ropeOffset * 0.55

  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 600)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full relative overflow-hidden" style={{ height: H }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Sky */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="45%" stopColor="#0ea5e9" />
            <stop offset="80%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#65a30d" />
            <stop offset="50%" stopColor="#4d7c0f" />
            <stop offset="100%" stopColor="#3f6212" />
          </linearGradient>
          <radialGradient id="pit" cx="50%" cy="15%" r="70%">
            <stop offset="0%" stopColor="#1c0a00" />
            <stop offset="50%" stopColor="#0a0400" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Sky bg */}
        <rect x="0" y="0" width={W} height={H} fill="url(#sky)" />

        {/* Clouds */}
        <Cloud x={50} y={10} scale={0.8} speed={5} />
        <Cloud x={290} y={5} scale={0.65} speed={6.5} />
        <Cloud x={900} y={8} scale={0.75} speed={4.5} />
        <Cloud x={1100} y={15} scale={0.6} speed={5.5} />

        {/* Distant hills */}
        <Hills />

        {/* Ground */}
        <rect x="0" y="255" width={W} height={H - 255} fill="url(#ground)" />
        {/* Grass edge highlight */}
        <rect x="0" y="254" width={W} height="6" rx="3" fill="#84cc16" opacity="0.6" />
        {/* Ground detail lines */}
        {[0,1,2,3,4].map(i => (
          <line key={i} x1={i * 260} y1="270" x2={i * 260 + 180} y2="270"
            stroke="#4d7c0f" strokeWidth="2" opacity="0.4" strokeDasharray="8,12" />
        ))}

        {/* Balloons */}
        <Balloon x={70} y={20} color="#ef4444" speed={3.1} />
        <Balloon x={115} y={10} color="#22c55e" speed={3.8} />
        <Balloon x={155} y={30} color="#f59e0b" speed={2.9} />
        <Balloon x={1055} y={25} color="#3b82f6" speed={3.5} />
        <Balloon x={1100} y={12} color="#a855f7" speed={3.2} />
        <Balloon x={1140} y={32} color="#ec4899" speed={4.0} />

        {/* Flags */}
        <Flag x={230} y={160} color="#3b82f6" />
        <Flag x={265} y={170} color="#60a5fa" />
        <Flag x={990} y={160} color="#ef4444" />
        <Flag x={1025} y={170} color="#f87171" />

        {/* ── Pit ── */}
        <ellipse cx={W / 2} cy="272" rx="105" ry="48" fill="rgba(0,0,0,0.5)" />
        <ellipse cx={W / 2} cy="265" rx="98" ry="44" fill="url(#pit)" />
        {/* Pit rim — stone look */}
        <ellipse cx={W / 2} cy="224" rx="112" ry="18" fill="#92400e" />
        <ellipse cx={W / 2} cy="220" rx="108" ry="14" fill="#a16207" />
        <ellipse cx={W / 2} cy="218" rx="105" ry="10" fill="#ca8a04" opacity="0.5" />
        {/* Stone bricks on rim */}
        {[-3,-1,1,3].map(i => (
          <rect key={i} x={W / 2 + i * 26 - 10} y="213" width="22" height="12" rx="2"
            fill="#78350f" stroke="#92400e" strokeWidth="1" opacity="0.7" />
        ))}

        {/* Rope area — centered at y=210 */}
        <g transform={`translate(${(W - 760) / 2}, 196)`}>
          <Rope offset={ropeOffset} />
          {/* Center flag on rope */}
          <rect
            x={380 + ropeOffset - 8} y="-5" width="16" height="32" rx="4"
            fill="#ef4444"
            stroke="#fca5a5" strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.8))' }}
          />
          <rect x={380 + ropeOffset - 5} y="-2" width="10" height="8" rx="2" fill="#fca5a5" opacity="0.5" />
        </g>

        {/* Referee */}
        <g transform={`translate(${W / 2}, 215)`}>
          <Referee />
        </g>

        {/* ── Left team ── */}
        <g
          transform={`translate(${145 + leftOffset}, 165)`}
          className={winner === 'left' ? 'anim-winner' : winner === 'right' ? '' : 'anim-pull'}
        >
          {LEFT_CHARS.map((c, i) => (
            <Puller key={i} x={i * 62} flip={false} colors={c} delay={i * 0.18} />
          ))}
        </g>

        {/* ── Right team ── */}
        <g
          transform={`translate(${W - 340 + rightOffset}, 165)`}
          className={winner === 'right' ? 'anim-winner' : winner === 'left' ? '' : 'anim-pull'}
        >
          {RIGHT_CHARS.map((c, i) => (
            <Puller key={i} x={i * 62} flip={true} colors={c} delay={i * 0.2} />
          ))}
        </g>

        {/* Rope position indicator bar */}
        <rect x={W / 2 - 140} y={H - 22} width="280" height="12" rx="6" fill="rgba(0,0,0,0.45)" />
        <rect x={W / 2 - 138} y={H - 21} width="276" height="10" rx="5"
          fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Indicator fill */}
        <rect
          x={W / 2 - 138 + (ropePos + 8) / 16 * 276}
          y={H - 21} width="24" height="10" rx="5"
          fill={ropePos < 0 ? '#60a5fa' : ropePos > 0 ? '#f87171' : '#a3a3a3'}
          style={{ filter: `drop-shadow(0 0 5px ${ropePos < 0 ? '#3b82f6' : '#ef4444'})` }}
        />
        {/* Center tick */}
        <rect x={W / 2 - 2} y={H - 24} width="4" height="16" rx="2" fill="white" opacity="0.5" />
      </svg>
    </div>
  )
}
