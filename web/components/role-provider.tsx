'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface RoleContextType {
  role: string | null
  isCoordinator: boolean
  isAdmin: boolean
  isLoading: boolean
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  isCoordinator: false,
  isAdmin: false,
  isLoading: true
})

export const useRole = () => useContext(RoleContext)

export default function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        // Try to get from localStorage first
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

    fetchRole()
  }, [])

  const isCoordinator = role === 'COORDINATOR' || role === 'ADMIN'
  const isAdmin = role === 'ADMIN'

  return (
    <RoleContext.Provider value={{ role, isCoordinator, isAdmin, isLoading }}>
      {children}
    </RoleContext.Provider>
  )
}