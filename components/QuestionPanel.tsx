'use client'

import { useEffect, useState } from 'react'
import type { Question } from '@/lib/questions'

interface QuestionPanelProps {
  side: 'left' | 'right'
  question: Question | null
  keys: string[]
  lastResult: 'correct' | 'wrong' | null
  score: number
  timeLeft: number
  maxTime: number
  disabled: boolean
  pressedKey: number | null
}

export default function QuestionPanel({
  side,
  question,
  keys,
  lastResult,
  score,
  timeLeft,
  maxTime,
  disabled,
  pressedKey,
}: QuestionPanelProps) {
  const [flashClass, setFlashClass] = useState('')
  const isLeft = side === 'left'

  useEffect(() => {
    if (lastResult === 'correct') {
      setFlashClass('flash-correct')
      const t = setTimeout(() => setFlashClass(''), 500)
      return () => clearTimeout(t)
    } else if (lastResult === 'wrong') {
      setFlashClass('flash-wrong')
      const t = setTimeout(() => setFlashClass(''), 500)
      return () => clearTimeout(t)
    }
  }, [lastResult])

  const timerPct = maxTime > 0 ? (timeLeft / maxTime) * 100 : 100
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444'

  const teamName = isLeft ? 'Chap jamoa' : 'O\'ng jamoa'
  const accentColor = isLeft ? 'from-blue-800 to-blue-900' : 'from-red-800 to-red-900'
  const borderColor = isLeft ? 'border-blue-400' : 'border-red-400'
  const scoreGlow = isLeft ? 'score-glow-blue' : 'score-glow-red'

  return (
    <div className={`flex flex-col gap-3 ${flashClass} rounded-2xl transition-colors duration-100`}>
      {/* Score */}
      <div className={`bg-gradient-to-b ${accentColor} border-4 ${borderColor} rounded-xl px-6 py-2 text-center ${scoreGlow}`}>
        <div className="text-yellow-300 font-game text-sm tracking-widest uppercase">OCHKO</div>
        <div className="text-white font-game text-5xl leading-none">{score}</div>
      </div>

      {/* Question panel */}
      <div className="wood-panel p-4 min-w-[280px]">
        {/* Timer bar */}
        <div className="w-full h-3 bg-gray-800 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${timerPct}%`, background: timerColor, boxShadow: `0 0 8px ${timerColor}` }}
          />
        </div>

        {/* Question text */}
        <div className="text-center mb-3">
          <span className="text-white font-game text-3xl drop-shadow-lg">
            {question?.text ?? '...'}
          </span>
        </div>

        {/* Answer options */}
        <div className="flex gap-2 justify-center">
          {question?.options.map((opt, i) => {
            const isPressed = pressedKey === i
            const btnClass = isLeft ? 'btn-left' : 'btn-right'
            return (
              <button
                key={`${question.text}-${i}`}
                disabled={disabled}
                className={`${btnClass} ${isPressed ? 'pressed' : ''} text-white font-game text-2xl rounded-xl px-4 py-2 transition-all duration-75 disabled:opacity-60 disabled:cursor-not-allowed min-w-[72px]`}
              >
                <div className="text-xs font-bold text-white/70 mb-0.5">[{keys[i]}]</div>
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Key hint */}
      <div className="text-center text-white/50 text-xs font-semibold tracking-wider">
        {teamName} — klavishlar: {keys.join(', ')}
      </div>
    </div>
  )
}
