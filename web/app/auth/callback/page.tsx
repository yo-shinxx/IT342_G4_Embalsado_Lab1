'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token') || searchParams.get('tokens')
    const error = searchParams.get('error')

    if (error) {
      toast.error(decodeURIComponent(error))
      router.push('/login')
      return
    }

    if (token) {
      // Decode and store token
      const decodedToken = decodeURIComponent(token)
      
      localStorage.setItem('authToken', decodedToken)

      document.cookie = `authToken=${decodedToken}; path=/; max-age=86400`;
      
      try {
        const parts = decodedToken.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          
          // Store user info if available
          if (payload.sub) localStorage.setItem('userEmail', payload.sub)
          if (payload.userId) localStorage.setItem('userId', payload.userId)
          if (payload.email) localStorage.setItem('userEmail', payload.email)
        } else {
          console.log('Token is not a JWT, storing as-is')
        }
      } catch (err) {
        console.log('Token is not a JWT or cannot be decoded:', err)
      }
      
      toast.success('Successfully logged in with Google!')
      router.push('/home')
    } else {
      toast.error('Authentication failed. Please try again.')
      router.push('/login')
    }
  }, [searchParams, router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #020617, #1e3a8a, #020617)'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ fontSize: '18px' }}>Completing authentication...</p>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}