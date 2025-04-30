import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Excel Editor',
  description: 'Created By Ayush',
  generator: 'Ayush Sasane',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
