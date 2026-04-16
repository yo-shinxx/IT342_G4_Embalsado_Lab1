import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userData = await apiRequest<any>('/profile')
        setRole(userData.role || 'NAS')
        localStorage.setItem('userRole', userData.role || 'NAS')
      } catch (error) {
        console.error('Failed to fetch user role:', error)
        const storedRole = localStorage.getItem('userRole')
        if (storedRole) setRole(storedRole)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  const isCoordinator = role === 'COORDINATOR' || role === 'ADMIN'
  const isAdmin = role === 'ADMIN'

  return { role, isCoordinator, isAdmin, loading }
}