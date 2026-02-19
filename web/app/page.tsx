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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      <Background />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Box className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold gradient-text">Quantix</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
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
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full" />
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Streamline your laboratory equipment inventory with innovative technology that meets institutional excellence
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 py-6">
                Open Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
              Discover More
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm text-gray-400">Scroll down</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full p-1">
            <div className="w-1.5 h-3 bg-blue-500 rounded-full mx-auto animate-glow" />
          </div>
        </div> */}
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage laboratory equipment efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: 'Real-time Tracking',
                description: 'Monitor equipment status, location, and availability in real-time with instant updates',
              },
              {
                icon: Shield,
                title: 'Secure Access',
                description: 'Role-based permissions with Microsoft OAuth integration for institutional security',
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                description: 'Comprehensive reports and analytics for informed decision-making',
              },
              {
                icon: Users,
                title: 'Multi-user Support',
                description: 'Collaborate with NAS and coordinators seamlessly across laboratories',
              },
              {
                icon: Zap,
                title: 'Quick Transactions',
                description: 'Process check-ins, check-outs, and transfers with a few clicks',
              },
              {
                icon: CheckCircle,
                title: 'Audit Trail',
                description: 'Complete history of all transactions for compliance and accountability',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="glass p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all group hover:scale-105"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id='start' className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass p-12 md:p-16 rounded-3xl border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Laboratory?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join CIT-U's modern inventory management system today
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-10">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-10 border-2">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold gradient-text">Quantix</span>
            </div>

            <p className="text-gray-400 text-center">
              © 2026 Quantix. Built for CIT-U Laboratory Management.
            </p>

            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}