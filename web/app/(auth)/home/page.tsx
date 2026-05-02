'use client'

import { ArrowRight, Bell, Box, FileText, LogOut, PackageSearch, PlusCircle, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logoutUser } from '@/lib/api/auth'
import Background from '@/components/background'
import Navbar from '@/components/navbar'
import Logo from '@/components/logo'
import { toast } from 'sonner'
import Header from '@/components/header'

type HeaderUser = {
  email: string
  firstName: string
  lastName: string
  avatar: string
}

// placeholders only for now 
const stats = [
  {
    label: 'Total Equipment',
    value: '267',
    icon: PackageSearch,
    accent: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
  },
  {
    label: 'Active Transactions',
    value: '190',
    icon: TrendingUp,
    accent: 'linear-gradient(135deg, #22c55e, #14b8a6)',
  },
  {
    label: 'Pending Requests',
    value: '101',
    icon: TrendingDown,
    accent: 'linear-gradient(135deg, #f59e0b, #facc15)',
  },
  {
    label: 'Low Stock Alerts',
    value: '7',
    icon: Users,
    accent: 'linear-gradient(135deg, #fb7185, #f43f5e)',
  },
]

const recentActivity = [
  { user: 'Aileen', action: 'checked out a microscope', time: '2m ago', initials: 'A' },
  { user: 'Marcus', action: 'returned a thermal cycler', time: '12m ago', initials: 'M' },
  { user: 'Nina', action: 'requested new pipette tips', time: '24m ago', initials: 'N' },
  { user: 'Sophia', action: 'approved a transfer request', time: '1h ago', initials: 'S' },
]

export default function Dashboard() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/login')
    } else {
      setUserEmail(email)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">
      <Background />
      
      <Navbar />

      <div className="min-h-screen flex flex-col" style={{ marginLeft: '280px' }}>
        <Header />

        {/* Main Content */}
        <main className="flex-1 p-8 pt-6 overflow-y-auto">
          <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {stats.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-3xl bg-[rgba(15,23,42,0.9)] border border-[rgba(255,255,255,0.08)] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.18)]">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="m-0 text-[#94a3b8] text-xs tracking-[0.25em] uppercase">{item.label}</p>
                      <p className="mt-3.5 mb-0 text-4xl font-bold">{item.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl grid place-items-center text-white" style={{ background: item.accent }}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-6 grid-cols-[1.8fr_1fr] mt-6">
            {/* Chart Section */}
            <div className="rounded-3xl bg-[rgba(15,23,42,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_30px_60px_rgba(0,0,0,0.16)] p-7">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="m-0 text-[#94a3b8] text-xs tracking-[0.24em] uppercase">Statistics</p>
                  <h2 className="mt-3.5 mb-0 text-3xl font-bold">March 2026</h2>
                </div>
                <div className="flex items-center gap-2 text-[#94a3b8]">
                  <span className="text-xs">Updated</span>
                  <TrendingUp className="w-5 h-5 text-[#4ade80]" />
                </div>
              </div>

              <div className="mt-7 min-h-80 rounded-3xl bg-[rgba(255,255,255,0.03)] p-6 relative">
                <div className="absolute inset-0 bg-linear-to-b from-[rgba(255,255,255,0.05)] to-transparent rounded-3xl pointer-events-none" />
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex justify-between text-[#94a3b8] text-xs mb-5">
                    <span>0k</span>
                    <span>100k</span>
                    <span>200k</span>
                    <span>500k</span>
                  </div>
                  <div className="relative flex-1 flex items-end justify-between">
                    <div className="absolute inset-0 grid grid-rows-5 gap-0 opacity-18">
                      {Array.from({ length: 5 }).map((_, index) => <div key={index} className="border-t border-dashed border-[rgba(255,255,255,0.1)]" />)}
                    </div>
                    <div className="h-[calc(100%-20px)] w-full relative">
                      <svg viewBox="0 0 600 320" className="w-full h-full">
                        <path d="M20 260 C120 180 200 160 280 200 S460 180 520 140" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                        <path d="M20 260 C120 210 200 190 280 220 S460 200 520 170" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" opacity="0.7" />
                        <circle cx="50" cy="250" r="6" fill="#38bdf8" />
                        <circle cx="180" cy="190" r="6" fill="#38bdf8" />
                        <circle cx="310" cy="210" r="6" fill="#38bdf8" />
                        <circle cx="430" cy="180" r="6" fill="#38bdf8" />
                        <circle cx="520" cy="145" r="6" fill="#38bdf8" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="rounded-3xl bg-[rgba(15,23,42,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_30px_60px_rgba(0,0,0,0.16)] p-7 flex flex-col">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="m-0 text-[#94a3b8] text-xs tracking-[0.24em] uppercase">Recent Transactions</p>
                  <h2 className="mt-3.5 mb-0 text-2xl font-bold">Latest activity</h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.08)] grid place-items-center text-[#38bdf8]">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {recentActivity.map((item) => (
                  <div key={item.user} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[rgba(56,189,248,0.18)] to-[rgba(34,197,94,0.18)] grid place-items-center font-bold text-[#38bdf8]">
                        {item.initials}
                      </div>
                      <div>
                        <p className="m-0 text-sm font-bold text-white">{item.user}</p>
                        <p className="mt-1.5 mb-0 text-[#94a3b8] text-xs">{item.action}</p>
                      </div>
                    </div>
                    <span className="text-[#64748b] text-xs tracking-[0.18em] uppercase">{item.time}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.08)]">
                <a href="#" className="inline-flex items-center gap-2 text-[#38bdf8] font-bold no-underline hover:gap-3 transition-all">
                  View All Transactions
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}