'use client'

interface BalloonProps {
  color: string
  x: number
  y: number
  size?: number
  animClass?: string
}

export default function Balloon({ color, x, y, size = 40, animClass = 'balloon-1' }: BalloonProps) {
  return (
    <div className={`absolute ${animClass}`} style={{ left: x, top: y }}>
      <svg width={size} height={size * 1.4} viewBox="0 0 40 56">
        <ellipse cx="20" cy="22" rx="18" ry="20" fill={color} opacity="0.92" />
        <ellipse cx="14" cy="14" rx="5" ry="4" fill="white" opacity="0.35" />
        <path d="M20 42 Q22 46 20 50 Q18 46 20 42" stroke="#666" strokeWidth="1.5" fill="none" />
        <polygon points="17,41 20,44 23,41" fill={color} opacity="0.7" />
      </svg>
    </div>
  )
}
