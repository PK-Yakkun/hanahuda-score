import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '花札得点計算',
  description: '花札の得点計算・進行を行うWebサービス',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  )
} 