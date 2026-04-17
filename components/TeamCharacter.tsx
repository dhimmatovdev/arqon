'use client'

interface TeamCharacterProps {
  side: 'left' | 'right'
  offset: number
  isWinner?: boolean
  isFalling?: boolean
}

const COLORS_LEFT = [
  { shirt: '#3b82f6', hat: '#1d4ed8', skin: '#fbbf24' },
  { shirt: '#a855f7', hat: '#7e22ce', skin: '#f97316' },
  { shirt: '#22c55e', hat: '#15803d', skin: '#fbbf24' },
]
const COLORS_RIGHT = [
  { shirt: '#ef4444', hat: '#b91c1c', skin: '#fbbf24' },
  { shirt: '#f59e0b', hat: '#b45309', skin: '#f97316' },
  { shirt: '#ec4899', hat: '#be185d', skin: '#fbbf24' },
]

function Person({ colors, flip, index }: { colors: typeof COLORS_LEFT[0]; flip: boolean; index: number }) {
  const delay = index * 0.15
  return (
    <div
      className="inline-flex flex-col items-center"
      style={{
        transform: flip ? 'scaleX(-1)' : 'none',
        animation: `team-idle ${0.7 + index * 0.1}s ease-in-out ${delay}s infinite`,
      }}
    >
      <svg width="48" height="72" viewBox="0 0 48 72">
        {/* Hat */}
        <ellipse cx="24" cy="14" rx="14" ry="5" fill={colors.hat} />
        <rect x="14" y="8" width="20" height="10" rx="3" fill={colors.hat} />
        <rect x="12" y="17" width="24" height="3" rx="1" fill={colors.hat} opacity="0.7" />
        {/* Head */}
        <circle cx="24" cy="26" r="10" fill={colors.skin} />
        {/* Eyes */}
        <circle cx="20" cy="25" r="1.5" fill="#333" />
        <circle cx="28" cy="25" r="1.5" fill="#333" />
        {/* Smile */}
        <path d="M20 29 Q24 33 28 29" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Body (shirt) */}
        <rect x="14" y="36" width="20" height="18" rx="4" fill={colors.shirt} />
        {/* Arms pulling rope */}
        <rect x="2" y="40" width="12" height="6" rx="3" fill={colors.skin} />
        <rect x="34" y="40" width="12" height="6" rx="3" fill={colors.skin} />
        {/* Legs */}
        <rect x="16" y="53" width="7" height="14" rx="3" fill="#1e3a5f" />
        <rect x="25" y="53" width="7" height="14" rx="3" fill="#1e3a5f" />
        {/* Shoes */}
        <ellipse cx="19" cy="67" rx="6" ry="3" fill="#333" />
        <ellipse cx="29" cy="67" rx="6" ry="3" fill="#333" />
      </svg>
    </div>
  )
}

export default function TeamCharacter({ side, offset, isWinner, isFalling }: TeamCharacterProps) {
  const colors = side === 'left' ? COLORS_LEFT : COLORS_RIGHT
  const flip = side === 'right'

  return (
    <div
      className={`flex gap-1 items-end transition-transform duration-300 ${isFalling ? 'animate-fall' : ''} ${isWinner ? 'celebrate' : ''}`}
      style={{ transform: `translateX(${offset}px)` }}
    >
      {colors.map((c, i) => (
        <Person key={i} colors={c} flip={flip} index={i} />
      ))}
    </div>
  )
}
