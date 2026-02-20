import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ToasterProvider from '@/components/toaster-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quantix - Laboratory Equipment Inventory Management',
  description: 'CIT-U Laboratory Equipment Inventory Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <ToasterProvider />
        </body>
    </html>
  )
}