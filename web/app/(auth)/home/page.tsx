'use client'

import { ArrowRight, Bell, Box, FileText, LogOut, PackageSearch, PlusCircle, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logoutUser } from '@/lib/api/auth'
import Background from '@/components/background'
import Navbar from '@/components/navbar'
import Logo from '@/components/logo'
import { toast } from 'sonner'

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
   const [user, setUser] = useState<HeaderUser | null>(null)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/login')
    } else {
      setUserEmail(email)
    }
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #020617 100%)',
      color: 'white',
      overflow: 'hidden',
    }}>
      <Background />

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <aside style={{
          width: '280px',
          minHeight: '100vh',
          background: 'rgba(8, 15, 41, 0.96)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          padding: '32px 24px',
          boxSizing: 'border-box',
        }}>

        <Navbar />

        </aside>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 32px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>
                <h1 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 700 }}>Dashboard</h1>
              </div>
            </div>

            <button style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              <Bell style={{ width: '20px', height: '20px', color: '#93c5fd' }} />
            </button>
          </header>

          <main style={{ padding: '24px 32px 40px' }}>
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {stats.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} style={{
                    borderRadius: '24px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '22px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.18)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>{item.label}</p>
                        <p style={{ margin: '14px 0 0', fontSize: '34px', fontWeight: 700 }}>{item.value}</p>
                      </div>
                      <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: item.accent, display: 'grid', placeItems: 'center', color: 'white' }}>
                        <Icon style={{ width: '20px', height: '20px' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1.8fr 1fr', marginTop: '24px' }}>
              <div style={{ borderRadius: '32px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px rgba(0,0,0,0.16)', padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', letterSpacing: '0.24em', textTransform: 'uppercase' }}>Statistics</p>
                    <h2 style={{ margin: '14px 0 0', fontSize: '28px', fontWeight: 700 }}>March 2026</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                    <span style={{ fontSize: '12px' }}>Updated</span>
                    <TrendingUp style={{ width: '20px', height: '20px', color: '#4ade80' }} />
                  </div>
                </div>

                <div style={{ marginTop: '28px', minHeight: '320px', borderRadius: '28px', background: 'rgba(255,255,255,0.03)', padding: '24px', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent)', borderRadius: '28px', pointerEvents: 'none' }} />
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px', marginBottom: '20px' }}>
                      <span>0k</span>
                      <span>100k</span>
                      <span>200k</span>
                      <span>500k</span>
                    </div>
                    <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '1fr 1fr 1fr 1fr 1fr', rowGap: '0', opacity: 0.18 }}>
                        {Array.from({ length: 5 }).map((_, index) => <div key={index} style={{ borderTop: '1px dashed rgba(255,255,255,0.1)' }} />)}
                      </div>
                      <div style={{ height: 'calc(100% - 20px)', width: '100%', position: 'relative' }}>
                        <svg viewBox="0 0 600 320" style={{ width: '100%', height: '100%' }}>
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

              <div style={{ borderRadius: '32px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px rgba(0,0,0,0.16)', padding: '28px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', letterSpacing: '0.24em', textTransform: 'uppercase' }}>Recent Transactions</p>
                    <h2 style={{ margin: '14px 0 0', fontSize: '24px', fontWeight: 700 }}>Latest activity</h2>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', color: '#38bdf8' }}>
                    <FileText style={{ width: '20px', height: '20px' }} />
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
                  {recentActivity.map((item) => (
                    <div key={item.user} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 18px', borderRadius: '22px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(56,189,248,0.18), rgba(34,197,94,0.18))', display: 'grid', placeItems: 'center', fontWeight: 700, color: '#38bdf8' }}>
                          {item.initials}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'white' }}>{item.user}</p>
                          <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '13px' }}>{item.action}</p>
                        </div>
                      </div>
                      <span style={{ color: '#64748b', fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{item.time}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>
                    View All Transactions
                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}