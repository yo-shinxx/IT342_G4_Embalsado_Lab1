'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Box, Database, Shield, Zap, BarChart3, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Background from '@/components/background'
import { useEffect, useState } from 'react'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      <Background />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Box className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold gradient-text">Quantix</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm">CIT-U Laboratory Management System</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">One-click</span> for Asset{' '}
            <span className="relative">
              Management
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full" />
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Streamline your laboratory equipment inventory with innovative technology that meets institutional excellence
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
              About Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}