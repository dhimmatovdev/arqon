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

function makeOptions(answer: number): number[] {
  const pool = new Set<number>([answer])
  const candidates = shuffle([1,-1,2,-2,3,-3,4,-4,5,-5,6,-6,7,8,9,10,-7,-8,-9,-10])
  for (const d of candidates) {
    if (pool.size >= 3) break
    const v = answer + d
    if (v > 0) pool.add(v)
  }
  while (pool.size < 3) pool.add(answer + pool.size * 13)
  return shuffle([...pool]).slice(0, 3)
}

export function generateQuestion(difficulty: Difficulty): Question {
  const r = Math.random()
  let text: string, answer: number

  if (difficulty === 'easy') {
    if (r < 0.5) {
      const a = Math.floor(Math.random() * 12) + 1
      const b = Math.floor(Math.random() * 12) + 1
      text = `${a} + ${b}`; answer = a + b
    } else {
      const b = Math.floor(Math.random() * 8) + 1
      const a = b + Math.floor(Math.random() * 10) + 1
      text = `${a} − ${b}`; answer = a - b
    }
  } else if (difficulty === 'medium') {
    if (r < 0.45) {
      const a = Math.floor(Math.random() * 9) + 2
      const b = Math.floor(Math.random() * 9) + 2
      text = `${a} × ${b}`; answer = a * b
    } else if (r < 0.75) {
      const a = Math.floor(Math.random() * 50) + 15
      const b = Math.floor(Math.random() * 30) + 5
      text = `${a} + ${b}`; answer = a + b
    } else {
      const a = Math.floor(Math.random() * 60) + 20
      const b = Math.floor(Math.random() * 20) + 5
      text = `${a} − ${b}`; answer = a - b
    }
  } else {
    if (r < 0.35) {
      const divs = [2,3,4,5,6,7,8,9]
      const b = divs[Math.floor(Math.random() * divs.length)]
      const q = Math.floor(Math.random() * 11) + 2
      text = `${b * q} ÷ ${b}`; answer = q
    } else if (r < 0.65) {
      const a = Math.floor(Math.random() * 9) + 2
      const b = Math.floor(Math.random() * 9) + 2
      const c = Math.floor(Math.random() * 8) + 2
      if (Math.random() > 0.5) {
        text = `${a} × ${b} + ${c}`; answer = a * b + c
      } else {
        const prod = a * b
        text = `${prod} − ${c}`; answer = prod - c
      }
    } else {
      const a = Math.floor(Math.random() * 9) + 3
      const b = Math.floor(Math.random() * 9) + 3
      const c = Math.floor(Math.random() * 9) + 2
      const d = Math.floor(Math.random() * 9) + 2
      text = `${a} × ${b} − ${c} × ${d}`
      answer = a * b - c * d
      if (answer <= 0) { text = `${a} × ${b} + ${c}`; answer = a * b + c }
    }
  }

  return { text: `${text} = ?`, answer, options: makeOptions(answer) }
}
