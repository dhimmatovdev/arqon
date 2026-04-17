export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  text: string
  answer: number
  options: number[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeOptions(answer: number, count: number): number[] {
  const opts = new Set<number>([answer])
  const deltas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -2, -3, -4, -5]
  shuffle(deltas).forEach(d => {
    if (opts.size < count) {
      const v = answer + d
      if (v > 0 && v !== answer) opts.add(v)
    }
  })
  while (opts.size < count) opts.add(answer + opts.size * 11)
  return shuffle([...opts]).slice(0, count)
}

function generateQuestion(difficulty: Difficulty): Question {
  const type = Math.random()
  let text: string
  let answer: number

  if (difficulty === 'easy') {
    if (type < 0.5) {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      text = `${a} + ${b}`
      answer = a + b
    } else {
      const a = Math.floor(Math.random() * 10) + 5
      const b = Math.floor(Math.random() * 5) + 1
      text = `${a} - ${b}`
      answer = a - b
    }
  } else if (difficulty === 'medium') {
    if (type < 0.4) {
      const a = Math.floor(Math.random() * 9) + 2
      const b = Math.floor(Math.random() * 9) + 2
      text = `${a} × ${b}`
      answer = a * b
    } else if (type < 0.7) {
      const a = Math.floor(Math.random() * 40) + 10
      const b = Math.floor(Math.random() * 20) + 5
      text = `${a} + ${b}`
      answer = a + b
    } else {
      const a = Math.floor(Math.random() * 50) + 20
      const b = Math.floor(Math.random() * 20) + 5
      text = `${a} - ${b}`
      answer = a - b
    }
  } else {
    if (type < 0.4) {
      const divisors = [2, 3, 4, 5, 6, 7, 8, 9]
      const b = divisors[Math.floor(Math.random() * divisors.length)]
      const answer_val = Math.floor(Math.random() * 10) + 2
      const a = b * answer_val
      text = `${a} ÷ ${b}`
      answer = answer_val
    } else if (type < 0.7) {
      const a = Math.floor(Math.random() * 9) + 2
      const b = Math.floor(Math.random() * 9) + 2
      const c = Math.floor(Math.random() * 5) + 1
      text = `${a} × ${b} - ${c}`
      answer = a * b - c
    } else {
      const a = Math.floor(Math.random() * 9) + 2
      const b = Math.floor(Math.random() * 9) + 2
      const c = Math.floor(Math.random() * 5) + 1
      text = `${a} × ${b} + ${c}`
      answer = a * b + c
    }
  }

  return { text: `${text} = ?`, answer, options: makeOptions(answer, 3) }
}

export { generateQuestion }
