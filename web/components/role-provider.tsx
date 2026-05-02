'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface RoleContextType {
  role: string | null
  isCoordinator: boolean
  isAdmin: boolean
  isLoading: boolean
  refreshRole: () => Promise<void>
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  isCoordinator: false,
  isAdmin: false,
  isLoading: true,
  refreshRole: async () => {}
})

export const useRole = () => useContext(RoleContext)

export default function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchRole = async () => {
    try {
        // Check if logged in
        const token = localStorage.getItem('authToken')
        if (!token) {
          setRole(null)
          localStorage.removeItem('userRole')
          return
        }
        // Try to get from localStorage
        const storedRole = localStorage.getItem('userRole')
        let userRole: string
        
        if (storedRole && storedRole !== 'null') {
          userRole = storedRole
        } else {
          const userData = await apiRequest<any>('/profile')
          userRole = userData.role || 'NAS'
          localStorage.setItem('userRole', userRole)
        }
        
        setRole(userRole)
    } catch (error) {
      console.error('Failed to fetch role:', error)
      setRole('NAS')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
      fetchRole()
  }, [])

  useEffect(() => {
    // when localStorage changes in another tab/window
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'userRole') {
        fetchRole()
      }
    }

    const handleAuthChange = () => {
      fetchRole()
    }

     window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

   useEffect(() => {
    // when the window gains focus (user might have switched in another tab)
    const handleFocus = () => {
      fetchRole()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const isCoordinator = role === 'COORDINATOR' || role === 'ADMIN'
  const isAdmin = role === 'ADMIN'

  return (
    <RoleContext.Provider value={{ role, isCoordinator, isAdmin, isLoading, refreshRole: fetchRole }}>
      {children}
    </RoleContext.Provider>
  )
}