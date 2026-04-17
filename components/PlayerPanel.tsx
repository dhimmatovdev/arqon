'use client'

import { useEffect, useRef, useState } from 'react'
import type { Question } from '@/lib/questions'

interface PlayerPanelProps {
  side: 'left' | 'right'
  question: Question | null
  score: number
  timeLeft: number
  maxTime: number
  lastResult: 'correct' | 'wrong' | null
  disabled: boolean
  onAnswer: (index: number) => void
}

export default function PlayerPanel({
  side, question, score, timeLeft, maxTime,
  lastResult, disabled, onAnswer,
}: PlayerPanelProps) {
  const isLeft = side === 'left'
  const [animKey, setAnimKey] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lastResult) return
    setAnimKey(k => k + 1)
  }, [lastResult])

  const timerPct = maxTime > 0 ? Math.max(0, (timeLeft / maxTime) * 100) : 100
  const timerColor = timerPct > 55 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444'
  const timerGlow = timerPct > 55 ? 'rgba(34,197,94,0.5)' : timerPct > 25 ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.6)'

  const animClass = lastResult === 'correct' ? 'anim-correct' : lastResult === 'wrong' ? 'anim-wrong' : ''

  const scoreColor = isLeft ? '#60a5fa' : '#f87171'
  const teamName = isLeft ? 'CHAP JAMOA' : "O'NG JAMOA"
  const btnClass = isLeft ? 'ans-btn-left' : 'ans-btn-right'
  const panelBorder = isLeft ? 'border-t-4 border-blue-500' : 'border-t-4 border-red-500'
  const headerBg = isLeft
    ? 'from-blue-900 to-blue-800'
    : 'from-red-900 to-red-800'

  return (
    <div className={`flex flex-col h-full ${isLeft ? '' : ''}`} style={{ flex: 1 }}>
      {/* Team header */}
      <div className={`bg-gradient-to-r ${headerBg} px-4 py-2 flex items-center justify-between`}>
        <span className="font-game text-sm tracking-widest" style={{ color: scoreColor }}>
          {teamName}
        </span>
        {/* Score badge */}
        <div
          className="font-game text-3xl leading-none px-4 py-1 rounded-xl"
          style={{
            color: scoreColor,
            textShadow: `0 0 14px ${scoreColor}`,
            background: 'rgba(0,0,0,0.4)',
            border: `2px solid ${scoreColor}44`,
          }}
        >
          {score}
        </div>
      </div>

      {/* Question + buttons */}
      <div
        ref={panelRef}
        key={animKey}
        className={`wood flex flex-col gap-3 p-4 flex-1 rounded-none ${animClass} ${panelBorder}`}
        style={{ borderRadius: 0 }}
      >
        {/* Timer bar */}
        <div className="timer-track w-full" style={{ height: 10 }}>
          <div
            className="timer-fill"
            style={{
              width: `${timerPct}%`,
              background: timerColor,
              boxShadow: `0 0 8px ${timerGlow}`,
            }}
          />
        </div>

        {/* Question text */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="font-game text-center leading-tight"
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
              color: '#fef9c3',
              textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(254,249,195,0.2)',
            }}
          >
            {question?.text ?? '...'}
          </div>
        </div>

        {/* Answer buttons */}
        <div className="flex gap-3 justify-center">
          {question?.options.map((opt, i) => (
            <button
              key={`${question.text}-${i}`}
              disabled={disabled}
              onClick={() => onAnswer(i)}
              className={`${btnClass} font-game text-white rounded-2xl flex-1 flex flex-col items-center justify-center gap-0.5`}
              style={{
                minHeight: 72,
                fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
