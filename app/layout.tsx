import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arqon Tortish - Matematik O\'yin',
  description: 'Ikki o\'yinchi uchun arqon tortish matematik o\'yini',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  )
}
