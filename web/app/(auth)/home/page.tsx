'use client'

import { Box, LogOut, Package, Users, FileText, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logoutUser } from '@/lib/api/auth'
import Background from '@/components/background'
import Logo from '@/components/logo'
import { toast } from 'sonner'

type HeaderUser = {
  email: string
  firdtName: string
  lastName: string
  avatar: string
}

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

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (err) {
      console.error("Failed to logout", err)
    } finally {
      setUser(null)
      router.replace("/")
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #020617, #1e3a8a, #020617)',
      color: 'white',
      overflow: 'hidden'
    }}>
      <Background />

      {/* Header */}
      <nav style={{
        position: 'relative',
        zIndex: 10,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box style={{ width: '24px', height: '24px' }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(to right, #60a5fa, #22d3ee, #34d399)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Quantix
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>{userEmail}</span>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '8px',
                  color: '#f87171',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                }}
              >
                <LogOut style={{ width: '16px', height: '16px' }}/>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
            Welcome Back!
          </h1>
          <p style={{ fontSize: '20px', color: '#9ca3af' }}>
            Yippiee!
          </p>
        </div>
      </div>
    </div>
  )
}