'use client'

interface RopeProps {
  position: number // -100 to 100, 0 = center. negative = left winning, positive = right winning
}

export default function Rope({ position }: RopeProps) {
  const segments = 18
  const segmentWidth = 36

  return (
    <div className="flex items-center justify-center relative" style={{ height: 28 }}>
      <div
        className="flex items-center transition-transform duration-200"
        style={{ transform: `translateX(${position * 1.2}px)` }}
      >
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            style={{
              width: segmentWidth,
              height: 18,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Main rope strand */}
            <div
              style={{
                width: '100%',
                height: 14,
                background: i % 2 === 0
                  ? 'linear-gradient(180deg, #d4a264 0%, #8B5E3C 40%, #6b3e1e 70%, #8B5E3C 100%)'
                  : 'linear-gradient(180deg, #8B5E3C 0%, #d4a264 40%, #8B5E3C 70%, #5C3A1E 100%)',
                borderRadius: 7,
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
              }}
            />
            {/* Wrapping detail */}
            {i % 3 === 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: '30%',
                  width: 4,
                  height: 18,
                  background: '#5C3A1E',
                  borderRadius: 2,
                  opacity: 0.6,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Center marker on rope */}
      <div
        className="absolute top-0 flex flex-col items-center pointer-events-none"
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        <div style={{
          width: 20,
          height: 28,
          background: 'linear-gradient(180deg, #ef4444, #b91c1c)',
          borderRadius: 4,
          border: '2px solid #fca5a5',
          boxShadow: '0 0 8px rgba(239,68,68,0.6)',
        }} />
      </div>
    </div>
  )
}
