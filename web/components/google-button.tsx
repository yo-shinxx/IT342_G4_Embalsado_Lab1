// components/google-button.tsx
'use client'

import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import OutlineButton from './ui/outline-button'

interface GoogleButtonProps {
  onClick?: () => void
}

export default function GoogleButton({ onClick }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Handle successful authentication
  useEffect(() => {
    if (session?.user?.backendToken) {
      // Store the token in localStorage for your API calls
      localStorage.setItem('token', session.user.backendToken)
      
      // Store user data
      localStorage.setItem('user', JSON.stringify({
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        role: session.user.role,
        avatar: session.user.avatar
      }))
      
      toast.success(`Welcome ${session.user.firstName || 'back'}!`)
      router.push('/home')
    }
  }, [session, router])

  const handleGoogleSignIn = async () => {
    // Prevent multiple clicks while loading
    if (loading) return
    
    try {
      setLoading(true)
      
      if (onClick) {
        onClick()
      }

      const result = await signIn('google', {
        callbackUrl: '/home',
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'invalid_email') {
          toast.error('Please use your institutional email (@cit.edu)')
        } else {
          toast.error(result.error)
        }
        setLoading(false) // Reset loading on error
      }
      // Note: Don't reset loading on success because we'll redirect

    } catch (error) {
      toast.error('Failed to sign in with Google')
      console.error('Google sign in error:', error)
      setLoading(false) // Reset loading on error
    }
  }

  // Add a style for disabled state
  const buttonStyle = loading ? {
    opacity: 0.6,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const
  } : {}

  return (
    <div style={buttonStyle}>
      <OutlineButton onClick={handleGoogleSignIn} fullWidth={true}>
        {loading ? (
          <>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </>
        )}
      </OutlineButton>
    </div>
  )
}