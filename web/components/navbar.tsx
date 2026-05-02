"use client"

import { Box, CalendarDays, FileText, LogOut, PackageSearch, Users } from 'lucide-react'
import Logo from './logo'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logoutUser } from '@/lib/api/auth'
import { toast } from 'sonner'
import { apiRequest } from '@/lib/api'
import { useRole } from '@/components/role-provider'

type HeaderUser = {
  email: string
  firstName: string
  lastName: string
  avatar: string
  role: string
}

type NavItem = {
  name: string
  path: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/home', icon: PackageSearch },
  { name: 'Equipments', path: '/equipments', icon: Box },
  { name: 'Inventory', path: '/inventory', icon: CalendarDays },
  { name: 'Transactions', path: '/transactions', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Users },
]

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const { isCoordinator, role, refreshRole } = useRole()
    const [user, setUser] = useState<HeaderUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserProfile = async () => {
            const email = localStorage.getItem('userEmail')
            const token = localStorage.getItem('authToken')
            
            if (!email || !token) {
                router.push('/login')
                return
            }
            try {
                const userData = await apiRequest<any>('/profile', {
                    method: 'GET'
                })
                
                setUser({
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    avatar: userData.avatar,
                    role: userData.role || 'NAS'
                })
                await refreshRole()
            } catch (error) {
                console.error('Failed to fetch user profile:', error)
                toast.error('Failed to load user profile.')
            } finally {
                setLoading(false)
            }
        }
        fetchUserProfile()
    }, [router, refreshRole])

    const handleLogout = async () => {
        try {
            await logoutUser()
            toast.success('Logged out successfully!')
        } catch (err) {
            console.log('Logout error:', err)
            toast.error('Logout failed. Please try again.')
        } finally {
            setUser(null)
            window.dispatchEvent(new Event('authChange'))
            router.replace("/")
        }
    }

    const handleProfileClick = () => {
        router.push('/profile')
    }

    const isActive = (path: string) => {
        return pathname === path
    }

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen bg-[rgba(8,15,41,0.96)] border-r border-[rgba(255,255,255,0.08)] p-8 overflow-y-auto" style={{ width: '280px' }}>
            <nav className="flex flex-col gap-2.5">
                <div className="mb-4">
                    <div className="mb-2.5">
                        <Logo compact={true} />
                    </div>
                    <div 
                        onClick={handleProfileClick}
                        className="grid place-items-center text-center p-2.5 cursor-pointer rounded-2xl transition-all duration-200 hover:bg-[rgba(255,255,255,0.05)]"
                    >
                        <div>
                            <img 
                                src={user?.avatar} 
                                alt={`${user?.firstName} ${user?.lastName}`}
                                className="w-20 h-20 rounded-full object-cover border-2 border-[rgba(56,189,248,0.5)]"
                            />
                        </div>
                    </div>
                    <div className="grid place-items-center text-center p-2.5">
                        <p className="text-base font-bold m-0">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-[#94a3b8] mt-1 mb-0">{user?.email}</p>
                        <p className="text-xs text-[#94a3b8] mt-2 mb-0">{isCoordinator ? 'Coordinator' : 'NAS'}</p>
                    </div>
                </div>
                
                {navItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.path)
                    return (
                        <button 
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex items-center gap-3 w-full py-3.5 px-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                                active 
                                    ? 'bg-[rgba(31,41,55,0.9)] border border-[rgba(56,189,248,0.2)] text-white font-semibold' 
                                    : 'bg-transparent border border-transparent text-[#94a3b8] hover:bg-[rgba(255,255,255,0.05)]'
                            }`}
                        >
                            <Icon className="w-4.5 h-4.5" />
                            {item.name}
                        </button>
                    )
                })}
                
                <button 
                    onClick={handleLogout} 
                    className="mt-8 w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-[rgba(248,113,113,0.16)] border border-[rgba(248,113,113,0.4)] text-[#fca5a5] font-bold cursor-pointer hover:bg-[rgba(248,113,113,0.24)] transition-all duration-200"
                >
                    <LogOut className="w-4.5 h-4.5" />
                    Logout
                </button>
            </nav>
        </aside>
    )
}