"use client"

import { Box, CalendarDays, FileText, LogOut, PackageSearch, Users } from 'lucide-react'
import Logo from './logo'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logoutUser } from '@/lib/api/auth'
import { toast } from 'sonner'

type HeaderUser = {
  email: string
  firstName: string
  lastName: string
  avatar: string
}

export default function Navbar() {
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
      localStorage.removeItem('userEmail')
      toast.success('Logged out successfully!')
    } catch (err) {
      console.log('Logout error:', err)
    } finally {
      setUser(null)
      router.replace("/")
    }
  }

    return(
        <nav style={{ display: 'grid', gap: '10px' }}>
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Logo />
                </div>
                <div style={{ display: 'grid', placeItems: 'center', textAlign: 'center', padding: '20px' }}>
                    {/* <p style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{userFirstName} {userLastName}</p> */}
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>{userEmail}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0' }}>NAS</p>
                </div>
            </div>
            
            <button 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 16px', borderRadius: '18px', background: 'rgba(31, 41, 55, 0.9)', border: '1px solid rgba(56, 189, 248, 0.2)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                <PackageSearch style={{ width: '18px', height: '18px' }} />
                Dashboard
            </button>
            
            <button 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 16px', borderRadius: '18px', background: 'transparent', color: '#94a3b8', border: '1px solid transparent', cursor: 'pointer' }}>
                <Box style={{ width: '18px', height: '18px' }} />
                Equipments
            </button>
            
            <button 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 16px', borderRadius: '18px', background: 'transparent', color: '#94a3b8', border: '1px solid transparent', cursor: 'pointer' }}>
                <CalendarDays style={{ width: '18px', height: '18px' }} />
                Inventory
            </button>
            
            <button 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 16px', borderRadius: '18px', background: 'transparent', color: '#94a3b8', border: '1px solid transparent', cursor: 'pointer' }}>
                <FileText style={{ width: '18px', height: '18px' }} />
                Transactions
            </button>
            
            <button 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 16px', borderRadius: '18px', background: 'transparent', color: '#94a3b8', border: '1px solid transparent', cursor: 'pointer' }}>
                <Users style={{ width: '18px', height: '18px' }} />
                Settings
            </button>
            
            <button 
                onClick={handleLogout} 
                style={{ marginTop: '36px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px 16px', borderRadius: '18px', background: 'rgba(248, 113, 113, 0.16)', border: '1px solid rgba(248, 113, 113, 0.4)', color: '#fca5a5', fontWeight: 700, cursor: 'pointer' }}>
                <LogOut style={{ width: '18px', height: '18px' }} />
                Logout
            </button>
        </nav>
    )
}