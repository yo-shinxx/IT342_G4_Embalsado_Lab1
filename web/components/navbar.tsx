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
    const [user, setUser] = useState<HeaderUser | null>(null)

    useEffect(() => {
        const email = localStorage.getItem('userEmail')
        const firstName = localStorage.getItem('userFirstName')
        const lastName = localStorage.getItem('userLastName')
        const avatar = localStorage.getItem('userAvatar')
        
        if (!email || !firstName || !lastName) {
            console.error('Missing user data:', { email, firstName, lastName })
            router.push('/login')
            return
        }
        
        setUser({
            email,
            firstName,
            lastName,
            avatar: avatar || ''
        })
    }, [router])


    const handleLogout = async () => {
        try {
        await logoutUser()
        const authKeys = [
            'userEmail',
            'userFirstName', 
            'userLastName',
            'userAvatar',
            'token',
            'refreshToken',
            'userId'
        ]
        authKeys.forEach(key => localStorage.removeItem(key))
        toast.success('Logged out successfully!')
        } catch (err) {
        console.log('Logout error:', err)
        toast.error('Logout failed. Please try again.')
        } finally {
        setUser(null)
        router.replace("/")
        }
    }

    const handleProfileClick = () => {
        router.push('/profile')
    }

    return(
        <nav style={{ display: 'grid', gap: '10px' }}>
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Logo />
                </div>
                <div 
                    onClick={handleProfileClick}
                    style={{ 
                        display: 'grid', 
                        placeItems: 'center', 
                        textAlign: 'center', 
                        padding: '20px',
                        cursor: 'pointer',
                        borderRadius: '16px',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                >
                    <div style={{ marginBottom: '12px' }}>
                        <img 
                                src={user?.avatar} 
                                alt={`${user?.firstName} ${user?.lastName}`}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '3px solid rgba(56, 189, 248, 0.5)'
                                }}
                            />
                    </div>
                </div>
                <div style={{ display: 'grid', placeItems: 'center', textAlign: 'center', padding: '20px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{user?.firstName} {user?.lastName}</p>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>{user?.email}</p>
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