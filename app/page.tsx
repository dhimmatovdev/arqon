'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { generateQuestion, type Question, type Difficulty } from '@/lib/questions'
import QuestionPanel from '@/components/QuestionPanel'
import TeamCharacter from '@/components/TeamCharacter'
import Rope from '@/components/Rope'
import Balloon from '@/components/Balloon'

// Left player: Q W E (options 0,1,2)
// Right player: I O P (options 0,1,2)
const LEFT_KEYS = ['Q', 'W', 'E']
const RIGHT_KEYS = ['I', 'O', 'P']

const ROPE_MAX = 100      // rope position range
const PULL_CORRECT = 18   // how much correct answer pulls rope
const QUESTION_TIME = 8   // seconds per question
const WIN_SCORE = 10      // score to win

type GamePhase = 'menu' | 'countdown' | 'playing' | 'gameover'
type AnswerResult = 'correct' | 'wrong' | null

interface PlayerState {
  score: number
  question: Question
  lastResult: AnswerResult
  pressedKey: number | null
  timeLeft: number
}

function freshQuestion(difficulty: Difficulty): Question {
  return generateQuestion(difficulty)
}

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: ['#f59e0b', '#22c55e', '#3b82f6', '#ec4899', '#ef4444', '#a855f7'][i % 6],
    size: 8 + Math.random() * 10,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : 2,
            animation: `fall ${1.5 + Math.random()}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}

export default function GamePage() {
  const [phase, setPhase] = useState<GamePhase>('menu')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [countdown, setCountdown] = useState(3)
  const [ropePos, setRopePos] = useState(0) // negative=left winning, positive=right winning
  const [winner, setWinner] = useState<'left' | 'right' | null>(null)

  const [left, setLeft] = useState<PlayerState>({
    score: 0,
    question: generateQuestion('medium'),
    lastResult: null,
    pressedKey: null,
    timeLeft: QUESTION_TIME,
  })
  const [right, setRight] = useState<PlayerState>({
    score: 0,
    question: generateQuestion('medium'),
    lastResult: null,
    pressedKey: null,
    timeLeft: QUESTION_TIME,
  })

  const gameActive = useRef(false)
  const leftTimeRef = useRef(QUESTION_TIME)
  const rightTimeRef = useRef(QUESTION_TIME)
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const endGame = useCallback((w: 'left' | 'right') => {
    gameActive.current = false
    if (timerInterval.current) clearInterval(timerInterval.current)
    setWinner(w)
    setPhase('gameover')
  }, [])

  const handleAnswer = useCallback((side: 'left' | 'right', optionIndex: number) => {
    if (!gameActive.current) return

    const setState = side === 'left' ? setLeft : setRight
    const getState = side === 'left' ? left : right

    setState(prev => {
      const chosen = prev.question.options[optionIndex]
      const isCorrect = chosen === prev.question.answer

      if (isCorrect) {
        const newScore = prev.score + 1
        // pull rope
        setRopePos(rp => {
          const next = side === 'left' ? rp - PULL_CORRECT : rp + PULL_CORRECT
          const clamped = Math.max(-ROPE_MAX, Math.min(ROPE_MAX, next))
          if (Math.abs(clamped) >= ROPE_MAX) {
            setTimeout(() => endGame(side === 'left' ? 'left' : 'right'), 100)
          }
          return clamped
        })
        // check score win
        if (newScore >= WIN_SCORE) {
          setTimeout(() => endGame(side), 100)
        }

        // reset timer
        if (side === 'left') leftTimeRef.current = QUESTION_TIME
        else rightTimeRef.current = QUESTION_TIME

        return {
          ...prev,
          score: newScore,
          question: freshQuestion(difficulty),
          lastResult: 'correct',
          pressedKey: optionIndex,
          timeLeft: QUESTION_TIME,
        }
      } else {
        return { ...prev, lastResult: 'wrong', pressedKey: optionIndex }
      }
    })

    // Clear pressedKey after animation
    setTimeout(() => {
      setState(prev => ({ ...prev, pressedKey: null, lastResult: null }))
    }, 400)
  }, [left, right, difficulty, endGame])

  // Keyboard listener
  useEffect(() => {
    if (phase !== 'playing') return

    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      const li = LEFT_KEYS.indexOf(key)
      const ri = RIGHT_KEYS.indexOf(key)
      if (li !== -1) handleAnswer('left', li)
      if (ri !== -1) handleAnswer('right', ri)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, handleAnswer])

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return
    setCountdown(3)
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(t)
          setPhase('playing')
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [phase])

  // Timer tick
  useEffect(() => {
    if (phase !== 'playing') return
    gameActive.current = true

    leftTimeRef.current = QUESTION_TIME
    rightTimeRef.current = QUESTION_TIME

    timerInterval.current = setInterval(() => {
      // Left timer
      leftTimeRef.current -= 0.1
      if (leftTimeRef.current <= 0) {
        leftTimeRef.current = QUESTION_TIME
        setLeft(prev => ({
          ...prev,
          question: freshQuestion(difficulty),
          lastResult: 'wrong',
          timeLeft: QUESTION_TIME,
        }))
        // Time out = rope goes slightly to right
        setRopePos(rp => Math.min(ROPE_MAX, rp + 5))
      } else {
        setLeft(prev => ({ ...prev, timeLeft: leftTimeRef.current }))
      }

      // Right timer
      rightTimeRef.current -= 0.1
      if (rightTimeRef.current <= 0) {
        rightTimeRef.current = QUESTION_TIME
        setRight(prev => ({
          ...prev,
          question: freshQuestion(difficulty),
          lastResult: 'wrong',
          timeLeft: QUESTION_TIME,
        }))
        setRopePos(rp => Math.max(-ROPE_MAX, rp - 5))
      } else {
        setRight(prev => ({ ...prev, timeLeft: rightTimeRef.current }))
      }
    }, 100)

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current)
    }
  }, [phase, difficulty])

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff)
    setRopePos(0)
    setWinner(null)
    setLeft({ score: 0, question: freshQuestion(diff), lastResult: null, pressedKey: null, timeLeft: QUESTION_TIME })
    setRight({ score: 0, question: freshQuestion(diff), lastResult: null, pressedKey: null, timeLeft: QUESTION_TIME })
    setPhase('countdown')
  }

  const ropeCharOffset = ropePos * 0.8

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden relative">
      {/* Sky background */}
      <div className="absolute inset-0 sky-bg" />

      {/* Clouds */}
      <div className="absolute top-8 left-20 w-32 h-12 bg-white/80 rounded-full blur-sm" />
      <div className="absolute top-6 left-28 w-20 h-10 bg-white/90 rounded-full blur-sm" />
      <div className="absolute top-12 right-32 w-40 h-14 bg-white/80 rounded-full blur-sm" />
      <div className="absolute top-8 right-40 w-24 h-10 bg-white/90 rounded-full blur-sm" />

      {/* Balloons */}
      <Balloon color="#ef4444" x={60} y={20} animClass="balloon-1" />
      <Balloon color="#22c55e" x={100} y={10} size={32} animClass="balloon-2" />
      <Balloon color="#f59e0b" x={140} y={30} size={36} animClass="balloon-3" />
      <Balloon color="#3b82f6" x={1100} y={15} animClass="balloon-2" />
      <Balloon color="#a855f7" x={1150} y={30} size={34} animClass="balloon-1" />
      <Balloon color="#ec4899" x={1190} y={8} size={30} animClass="balloon-3" />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-32 ground" />
      {/* Ground highlights */}
      <div className="absolute bottom-28 left-0 right-0 h-4 bg-green-400/30 blur-sm" />

      {/* Pit */}
      <div
        className="absolute pit rounded-full"
        style={{
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 160,
          height: 110,
          borderRadius: '50% 50% 40% 40%',
          boxShadow: 'inset 0 20px 40px rgba(0,0,0,0.8)',
        }}
      />
      {/* Pit rim */}
      <div
        className="absolute"
        style={{
          bottom: 136,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 180,
          height: 20,
          background: 'linear-gradient(180deg, #92400e, #78350f)',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}
      />

      {/* MENU */}
      {phase === 'menu' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="bg-gray-900/90 backdrop-blur-sm border-4 border-yellow-400 rounded-3xl p-10 flex flex-col items-center gap-6 shadow-2xl"
            style={{ boxShadow: '0 0 40px rgba(251,191,36,0.4)' }}>
            {/* Title */}
            <div className="text-center">
              <div className="font-game text-6xl text-yellow-300 drop-shadow-lg">🏆 ARQON TORTISH</div>
              <div className="font-game text-2xl text-white/80 mt-1">Matematik O'yin</div>
            </div>

            {/* Controls info */}
            <div className="flex gap-8 text-center">
              <div className="bg-blue-800/60 border-2 border-blue-400 rounded-xl p-4">
                <div className="text-blue-300 font-game text-lg mb-2">Chap Jamoa</div>
                <div className="flex gap-2">
                  {LEFT_KEYS.map(k => (
                    <div key={k} className="bg-blue-600 text-white font-game text-xl px-3 py-2 rounded-lg border-b-4 border-blue-800">
                      {k}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-white/50 font-game text-3xl self-center">VS</div>
              <div className="bg-red-800/60 border-2 border-red-400 rounded-xl p-4">
                <div className="text-red-300 font-game text-lg mb-2">O'ng Jamoa</div>
                <div className="flex gap-2">
                  {RIGHT_KEYS.map(k => (
                    <div key={k} className="bg-red-600 text-white font-game text-xl px-3 py-2 rounded-lg border-b-4 border-red-800">
                      {k}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="text-center">
              <div className="text-white/70 font-semibold mb-3 text-lg">Qiyinlik darajasini tanlang:</div>
              <div className="flex gap-3">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => {
                  const labels = { easy: '🟢 Oson', medium: '🟡 O\'rta', hard: '🔴 Qiyin' }
                  const colors = {
                    easy: 'from-green-600 to-green-700 border-green-400 hover:from-green-500',
                    medium: 'from-yellow-600 to-yellow-700 border-yellow-400 hover:from-yellow-500',
                    hard: 'from-red-600 to-red-700 border-red-400 hover:from-red-500',
                  }
                  return (
                    <button
                      key={d}
                      onClick={() => startGame(d)}
                      className={`bg-gradient-to-b ${colors[d]} border-2 border-b-4 text-white font-game text-xl px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg`}
                    >
                      {labels[d]}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="text-white/40 text-sm text-center">
              To'g'ri javob berish arqonni torting • {WIN_SCORE} ochko yig'ing yoki arqonni {ROPE_MAX} ga torting
            </div>
          </div>
        </div>
      )}

      {/* COUNTDOWN */}
      {phase === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
          <div key={countdown} className="countdown-pop font-game text-9xl text-yellow-300 drop-shadow-2xl"
            style={{ textShadow: '0 0 40px rgba(251,191,36,0.8)' }}>
            {countdown > 0 ? countdown : 'BOSHING!'}
          </div>
        </div>
      )}

      {/* PLAYING UI */}
      {(phase === 'playing' || phase === 'gameover') && (
        <div className="relative z-10 flex flex-col h-full">
          {/* Top: score boards + rope area */}
          <div className="flex items-start justify-between px-6 pt-4 gap-4">
            {/* Left panel */}
            <QuestionPanel
              side="left"
              question={left.question}
              keys={LEFT_KEYS}
              lastResult={left.lastResult}
              score={left.score}
              timeLeft={left.timeLeft}
              maxTime={QUESTION_TIME}
              disabled={phase === 'gameover'}
              pressedKey={left.pressedKey}
            />

            {/* Center area - referee + rope */}
            <div className="flex flex-col items-center flex-1 pt-2">
              {/* Referee */}
              <div className="relative flex items-center justify-center" style={{ height: 90 }}>
                <svg width="80" height="90" viewBox="0 0 80 90">
                  {/* Hat */}
                  <ellipse cx="40" cy="10" rx="22" ry="8" fill="#1a1a1a" />
                  <rect x="22" y="4" width="36" height="14" rx="4" fill="#1a1a1a" />
                  <rect x="18" y="16" width="44" height="4" rx="2" fill="#333" />
                  {/* Head */}
                  <circle cx="40" cy="30" r="16" fill="#fbbf24" />
                  {/* Surprised eyes */}
                  <circle cx="34" cy="28" r="3" fill="white" />
                  <circle cx="46" cy="28" r="3" fill="white" />
                  <circle cx="34" cy="29" r="1.5" fill="#333" />
                  <circle cx="46" cy="29" r="1.5" fill="#333" />
                  {/* Open mouth with whistle */}
                  <ellipse cx="40" cy="36" rx="5" ry="4" fill="#cc0000" />
                  <ellipse cx="40" cy="35" rx="4" ry="2" fill="#ff6666" />
                  <rect x="37" y="37" width="10" height="4" rx="2" fill="#999" />
                  {/* Referee shirt */}
                  <rect x="22" y="46" width="36" height="28" rx="6" fill="#ddd" />
                  {/* Stripes */}
                  {[0,1,2,3].map(i => (
                    <rect key={i} x={22 + i * 9} y="46" width="4.5" height="28" fill="#1a1a1a" opacity="0.8" />
                  ))}
                  {/* Medal */}
                  <circle cx="40" cy="60" r="5" fill="#f59e0b" />
                  <circle cx="40" cy="60" r="3" fill="#fcd34d" />
                  {/* Arms */}
                  <rect x="4" y="50" width="18" height="8" rx="4" fill="#fbbf24" />
                  <rect x="58" y="50" width="18" height="8" rx="4" fill="#fbbf24" />
                  {/* Legs */}
                  <rect x="26" y="73" width="12" height="14" rx="4" fill="#333" />
                  <rect x="42" y="73" width="12" height="14" rx="4" fill="#333" />
                </svg>
              </div>

              {/* Rope */}
              <div className="w-full px-2">
                <Rope position={ropePos} />
              </div>

              {/* Rope position indicator */}
              <div className="mt-2 w-64 h-4 bg-gray-800/60 rounded-full overflow-hidden border border-gray-600">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: '50%',
                    marginLeft: `${(ropePos + ROPE_MAX) / (2 * ROPE_MAX) * 50}%`,
                    background: ropePos < 0
                      ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                      : ropePos > 0
                      ? 'linear-gradient(90deg, #ef4444, #f87171)'
                      : 'linear-gradient(90deg, #6b7280, #9ca3af)',
                  }}
                />
                <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/50" style={{ transform: 'translateX(-50%)' }} />
              </div>
            </div>

            {/* Right panel */}
            <QuestionPanel
              side="right"
              question={right.question}
              keys={RIGHT_KEYS}
              lastResult={right.lastResult}
              score={right.score}
              timeLeft={right.timeLeft}
              maxTime={QUESTION_TIME}
              disabled={phase === 'gameover'}
              pressedKey={right.pressedKey}
            />
          </div>

          {/* Bottom: teams */}
          <div className="absolute bottom-32 left-0 right-0 flex items-end justify-between px-8">
            <TeamCharacter
              side="left"
              offset={-ropeCharOffset}
              isWinner={winner === 'left'}
              isFalling={winner === 'right'}
            />
            <TeamCharacter
              side="right"
              offset={-ropeCharOffset}
              isWinner={winner === 'right'}
              isFalling={winner === 'left'}
            />
          </div>
        </div>
      )}

      {/* GAME OVER */}
      {phase === 'gameover' && winner && (
        <>
          <Confetti />
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-sm">
            <div
              className="bg-gray-900/95 border-4 border-yellow-400 rounded-3xl p-10 flex flex-col items-center gap-6 text-center shadow-2xl celebrate"
              style={{ boxShadow: '0 0 60px rgba(251,191,36,0.5)' }}
            >
              <div className="text-6xl">🏆</div>
              <div className={`font-game text-5xl ${winner === 'left' ? 'text-blue-400' : 'text-red-400'}`}>
                {winner === 'left' ? 'CHAP JAMOA' : "O'NG JAMOA"}
              </div>
              <div className="font-game text-3xl text-yellow-300">G'OLIB!</div>

              <div className="flex gap-8 text-center">
                <div className="bg-blue-900/60 border border-blue-400 rounded-xl px-6 py-3">
                  <div className="text-blue-300 font-semibold text-sm">Chap jamoa</div>
                  <div className="text-white font-game text-4xl">{left.score}</div>
                </div>
                <div className="bg-red-900/60 border border-red-400 rounded-xl px-6 py-3">
                  <div className="text-red-300 font-semibold text-sm">O'ng jamoa</div>
                  <div className="text-white font-game text-4xl">{right.score}</div>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => startGame(difficulty)}
                  className="bg-gradient-to-b from-green-500 to-green-700 border-2 border-green-300 border-b-4 text-white font-game text-xl px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Qayta o'ynash
                </button>
                <button
                  onClick={() => setPhase('menu')}
                  className="bg-gradient-to-b from-gray-600 to-gray-700 border-2 border-gray-400 border-b-4 text-white font-game text-xl px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Menyu
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
