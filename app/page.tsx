'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { generateQuestion, type Difficulty, type Question } from '@/lib/questions'
import GameScene from '@/components/GameScene'
import PlayerPanel from '@/components/PlayerPanel'

const WIN_SCORE = 10
const ROPE_MAX = 8
const QUESTION_TIME = 8
const PULL = 1.5
const TIMEOUT_PUSH = 0.4

type Phase = 'menu' | 'countdown' | 'playing' | 'gameover'
type Side = 'left' | 'right'
type Result = 'correct' | 'wrong' | null

interface PlayerState {
  score: number
  question: Question
  lastResult: Result
  timeLeft: number
}

function fresh(d: Difficulty): Question { return generateQuestion(d) }

function ConfettiPiece({ i }: { i: number }) {
  const colors = ['#f59e0b','#22c55e','#3b82f6','#ec4899','#ef4444','#a855f7','#06b6d4','#84cc16']
  const left = (i * 37 + 7) % 100
  const delay = (i * 0.11) % 2
  const size = 8 + (i % 7)
  const color = colors[i % colors.length]
  const circle = i % 3 === 0
  return (
    <div style={{
      position: 'absolute',
      left: `${left}%`,
      top: -24,
      width: size,
      height: size,
      background: color,
      borderRadius: circle ? '50%' : 3,
      animation: `confetti-fall ${1.4 + (i % 5) * 0.3}s ease-in ${delay}s forwards`,
    }} />
  )
}

function ScoreBoard({ side, score, winScore }: { side: Side; score: number; winScore: number }) {
  const isLeft = side === 'left'
  const cls = isLeft ? 'scoreboard-blue' : 'scoreboard-red'
  const label = isLeft ? 'CHAP' : "O'NG"
  const pct = Math.min(score / winScore, 1)
  const barColor = isLeft ? '#60a5fa' : '#f87171'

  return (
    <div className={`${cls} rounded-2xl px-5 py-3 flex flex-col items-center gap-1 min-w-[130px]`}>
      <span className="font-game text-white/70 text-xs tracking-widest">{label} JAMOA</span>
      <span
        className="score-digit font-game leading-none"
        style={{
          fontSize: 56,
          color: isLeft ? '#93c5fd' : '#fca5a5',
        }}
      >
        {score}
      </span>
      {/* Progress to win */}
      <div style={{ width: '100%', height: 6, background: 'rgba(0,0,0,0.4)', borderRadius: 99 }}>
        <div style={{
          height: '100%', borderRadius: 99,
          width: `${pct * 100}%`,
          background: barColor,
          boxShadow: `0 0 8px ${barColor}`,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span className="text-white/40 text-xs">{score}/{winScore}</span>
    </div>
  )
}

export default function GamePage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [countdown, setCountdown] = useState(3)
  const [ropePos, setRopePos] = useState(0)
  const [winner, setWinner] = useState<Side | null>(null)

  const diffRef = useRef<Difficulty>('medium')
  const gameActive = useRef(false)
  const leftTimer = useRef(QUESTION_TIME)
  const rightTimer = useRef(QUESTION_TIME)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [left, setLeft] = useState<PlayerState>({
    score: 0, question: fresh('medium'), lastResult: null, timeLeft: QUESTION_TIME,
  })
  const [right, setRight] = useState<PlayerState>({
    score: 0, question: fresh('medium'), lastResult: null, timeLeft: QUESTION_TIME,
  })

  // Win detection
  useEffect(() => {
    if (phase !== 'playing') return
    if (left.score >= WIN_SCORE) triggerWin('left')
  }, [left.score, phase])

  useEffect(() => {
    if (phase !== 'playing') return
    if (right.score >= WIN_SCORE) triggerWin('right')
  }, [right.score, phase])

  useEffect(() => {
    if (phase !== 'playing') return
    if (ropePos <= -ROPE_MAX) triggerWin('left')
    if (ropePos >= ROPE_MAX) triggerWin('right')
  }, [ropePos, phase])

  const triggerWin = useCallback((side: Side) => {
    if (!gameActive.current) return
    gameActive.current = false
    if (intervalRef.current) clearInterval(intervalRef.current)
    setWinner(side)
    setPhase('gameover')
  }, [])

  // Answer handler — pure functional updates, no stale closures
  const handleAnswer = useCallback((side: Side, idx: number) => {
    if (!gameActive.current) return
    const setState = side === 'left' ? setLeft : setRight

    setState(prev => {
      const chosen = prev.question.options[idx]
      const correct = chosen === prev.question.answer
      if (correct) {
        if (side === 'left') leftTimer.current = QUESTION_TIME
        else rightTimer.current = QUESTION_TIME
        setRopePos(r => Math.max(-ROPE_MAX, Math.min(ROPE_MAX, side === 'left' ? r - PULL : r + PULL)))
        return {
          ...prev,
          score: prev.score + 1,
          question: fresh(diffRef.current),
          lastResult: 'correct',
          timeLeft: QUESTION_TIME,
        }
      }
      return { ...prev, lastResult: 'wrong' }
    })

    // Clear feedback after animation
    setTimeout(() => {
      const clr = side === 'left' ? setLeft : setRight
      clr(p => ({ ...p, lastResult: null }))
    }, 450)
  }, [])

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return
    setCountdown(3)
    let n = 3
    const t = setInterval(() => {
      n -= 1
      setCountdown(n)
      if (n <= 0) { clearInterval(t); setPhase('playing') }
    }, 900)
    return () => clearInterval(t)
  }, [phase])

  // Timer tick
  useEffect(() => {
    if (phase !== 'playing') return
    gameActive.current = true
    leftTimer.current = QUESTION_TIME
    rightTimer.current = QUESTION_TIME

    intervalRef.current = setInterval(() => {
      if (!gameActive.current) return

      leftTimer.current = Math.max(0, leftTimer.current - 0.1)
      rightTimer.current = Math.max(0, rightTimer.current - 0.1)

      if (leftTimer.current <= 0) {
        leftTimer.current = QUESTION_TIME
        setLeft(p => ({ ...p, question: fresh(diffRef.current), lastResult: 'wrong', timeLeft: QUESTION_TIME }))
        setRopePos(r => Math.min(ROPE_MAX, r + TIMEOUT_PUSH))
        setTimeout(() => setLeft(p => ({ ...p, lastResult: null })), 450)
      } else {
        setLeft(p => ({ ...p, timeLeft: leftTimer.current }))
      }

      if (rightTimer.current <= 0) {
        rightTimer.current = QUESTION_TIME
        setRight(p => ({ ...p, question: fresh(diffRef.current), lastResult: 'wrong', timeLeft: QUESTION_TIME }))
        setRopePos(r => Math.max(-ROPE_MAX, r - TIMEOUT_PUSH))
        setTimeout(() => setRight(p => ({ ...p, lastResult: null })), 450)
      } else {
        setRight(p => ({ ...p, timeLeft: rightTimer.current }))
      }
    }, 100)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [phase])

  const startGame = (diff: Difficulty) => {
    diffRef.current = diff
    setDifficulty(diff)
    setRopePos(0)
    setWinner(null)
    setLeft({ score: 0, question: fresh(diff), lastResult: null, timeLeft: QUESTION_TIME })
    setRight({ score: 0, question: fresh(diff), lastResult: null, timeLeft: QUESTION_TIME })
    setPhase('countdown')
  }

  const diffConfig: Record<Difficulty, { label: string; emoji: string; desc: string; from: string; border: string; shadow: string }> = {
    easy:   { label: 'Oson',   emoji: '🟢', desc: "Qo'shish, ayirish", from: 'from-green-600 to-green-800',  border: 'border-green-400',  shadow: 'rgba(34,197,94,0.4)' },
    medium: { label: "O'rta",  emoji: '🟡', desc: 'Ko\'paytirish',      from: 'from-yellow-500 to-yellow-700', border: 'border-yellow-400', shadow: 'rgba(234,179,8,0.4)' },
    hard:   { label: 'Qiyin',  emoji: '🔴', desc: 'Murakkab amallar',  from: 'from-red-600 to-red-800',     border: 'border-red-400',    shadow: 'rgba(239,68,68,0.4)' },
  }

  return (
    <div className="w-screen h-screen flex flex-col sky overflow-hidden">

      {/* ── MENU ── */}
      {phase === 'menu' && (
        <div className="absolute inset-0 menu-overlay z-30 flex items-center justify-center">
          <div
            className="wood rounded-3xl p-8 flex flex-col items-center gap-6 max-w-xl w-full mx-4"
            style={{ boxShadow: '0 0 60px rgba(0,0,0,0.7), 0 0 120px rgba(251,191,36,0.15)' }}
          >
            <div className="text-center">
              <div className="font-game text-5xl text-yellow-200 drop-shadow-lg">🏆 ARQON TORTISH</div>
              <div className="font-game text-xl text-yellow-400/80 mt-1">Matematik O'yin • 2 O'yinchi</div>
            </div>

            {/* Player zones info */}
            <div className="flex gap-4 w-full">
              <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(30,58,138,0.5)', border: '2px solid #3b82f6' }}>
                <div className="font-game text-blue-300 text-sm mb-1">👈 CHAP JAMOA</div>
                <div className="text-white/70 text-xs">Ekranning chap yarmi</div>
                <div className="text-white/50 text-xs mt-1">Tugmalarni bosing</div>
              </div>
              <div className="flex items-center font-game text-white/40 text-xl">VS</div>
              <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(127,29,29,0.5)', border: '2px solid #ef4444' }}>
                <div className="font-game text-red-300 text-sm mb-1">O'NG JAMOA 👉</div>
                <div className="text-white/70 text-xs">Ekranning o'ng yarmi</div>
                <div className="text-white/50 text-xs mt-1">Tugmalarni bosing</div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="w-full">
              <div className="font-game text-white/60 text-center text-sm mb-3 tracking-wider">QIYINLIK DARAJASI</div>
              <div className="flex gap-3">
                {(Object.entries(diffConfig) as [Difficulty, typeof diffConfig['easy']][]).map(([d, cfg]) => (
                  <button
                    key={d}
                    onClick={() => startGame(d)}
                    className={`flex-1 bg-gradient-to-b ${cfg.from} border-2 ${cfg.border} border-b-4 font-game text-white rounded-2xl py-4 flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all`}
                    style={{ boxShadow: `0 8px 24px ${cfg.shadow}` }}
                  >
                    <span className="text-2xl">{cfg.emoji}</span>
                    <span className="text-lg">{cfg.label}</span>
                    <span className="text-xs opacity-60">{cfg.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-white/35 text-xs text-center leading-relaxed">
              To'g'ri javob → arqon sizga tortiladi • {WIN_SCORE} ochko yoki arqonni chekka tortib g'olib bo'ling<br />
              Vaqt tugasa → arqon raqibga siljiydi
            </div>
          </div>
        </div>
      )}

      {/* ── COUNTDOWN ── */}
      {phase === 'countdown' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
          <div
            key={countdown}
            className="font-game text-center"
            style={{
              fontSize: 'clamp(80px, 15vw, 180px)',
              color: countdown > 0 ? '#fde68a' : '#4ade80',
              textShadow: `0 0 60px ${countdown > 0 ? 'rgba(251,191,36,0.9)' : 'rgba(74,222,128,0.9)'}`,
              animation: 'countdown-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
            }}
          >
            {countdown > 0 ? countdown : 'BOSHING!'}
          </div>
        </div>
      )}

      {/* ── GAME OVER ── */}
      {phase === 'gameover' && winner && (
        <>
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {Array.from({ length: 32 }).map((_, i) => <ConfettiPiece key={i} i={i} />)}
          </div>
          <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
            <div
              className="wood rounded-3xl p-8 flex flex-col items-center gap-5 anim-winner"
              style={{ boxShadow: '0 0 80px rgba(251,191,36,0.4)' }}
            >
              <div className="text-6xl">🏆</div>
              <div
                className="font-game text-5xl"
                style={{ color: winner === 'left' ? '#60a5fa' : '#f87171' }}
              >
                {winner === 'left' ? 'CHAP JAMOA' : "O'NG JAMOA"}
              </div>
              <div className="font-game text-3xl text-yellow-300">G'OLIB!</div>

              <div className="flex gap-6">
                <div style={{ background: 'rgba(30,58,138,0.5)', border: '2px solid #3b82f6' }} className="rounded-xl px-6 py-3 text-center">
                  <div className="text-blue-300 text-sm font-bold">Chap jamoa</div>
                  <div className="font-game text-white text-4xl">{left.score}</div>
                </div>
                <div style={{ background: 'rgba(127,29,29,0.5)', border: '2px solid #ef4444' }} className="rounded-xl px-6 py-3 text-center">
                  <div className="text-red-300 text-sm font-bold">O'ng jamoa</div>
                  <div className="font-game text-white text-4xl">{right.score}</div>
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => startGame(difficulty)}
                  className="ans-btn-left font-game text-white text-xl px-8 py-4 rounded-2xl"
                >
                  Qayta o'ynash
                </button>
                <button
                  onClick={() => setPhase('menu')}
                  className="font-game text-white text-xl px-8 py-4 rounded-2xl"
                  style={{ background: 'linear-gradient(170deg,#525252,#404040)', border: '2px solid #737373', borderBottom: '5px solid #262626' }}
                >
                  Menyu
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── PLAYING UI ── */}
      <div className="flex flex-col h-full">

        {/* Top bar: scoreboards + title */}
        <div className="flex items-center justify-between px-6 py-3 gap-4" style={{ background: 'rgba(0,0,0,0.35)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <ScoreBoard side="left" score={left.score} winScore={WIN_SCORE} />

          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="font-game text-yellow-200 text-2xl drop-shadow">🏆 ARQON TORTISH</div>
            {/* Rope position indicator text */}
            {phase === 'playing' && (
              <div className="font-game text-sm" style={{ color: ropePos < -2 ? '#60a5fa' : ropePos > 2 ? '#f87171' : '#a3a3a3' }}>
                {ropePos < -2 ? '← Chap ustunlik qilmoqda' : ropePos > 2 ? "O'ng ustunlik qilmoqda →" : 'Teng kurash!'}
              </div>
            )}
            {phase === 'menu' && <div className="text-white/40 text-xs font-game">Qiyinlik tanlang</div>}
          </div>

          <ScoreBoard side="right" score={right.score} winScore={WIN_SCORE} />
        </div>

        {/* Game scene */}
        <GameScene ropePos={ropePos} winner={winner} />

        {/* Bottom: two player panels side by side */}
        <div className="flex flex-1" style={{ minHeight: 0 }}>
          {/* Left player */}
          <div className="flex-1" style={{ borderRight: '3px solid rgba(0,0,0,0.5)' }}>
            <PlayerPanel
              side="left"
              question={left.question}
              score={left.score}
              timeLeft={left.timeLeft}
              maxTime={QUESTION_TIME}
              lastResult={left.lastResult}
              disabled={phase !== 'playing'}
              onAnswer={idx => handleAnswer('left', idx)}
            />
          </div>

          {/* Center divider */}
          <div style={{
            width: 48,
            background: 'linear-gradient(180deg, #1a1a1a, #0d0d0d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div className="font-game text-white/30 text-lg" style={{ writingMode: 'vertical-rl' }}>VS</div>
          </div>

          {/* Right player */}
          <div className="flex-1" style={{ borderLeft: '3px solid rgba(0,0,0,0.5)' }}>
            <PlayerPanel
              side="right"
              question={right.question}
              score={right.score}
              timeLeft={right.timeLeft}
              maxTime={QUESTION_TIME}
              lastResult={right.lastResult}
              disabled={phase !== 'playing'}
              onAnswer={idx => handleAnswer('right', idx)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
