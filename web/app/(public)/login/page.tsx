'use client'

import { Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useState } from 'react'
import type { FormEvent } from "react"
import { loginUser } from "@/lib/api/auth"
import { toast } from 'sonner'
import Background from '@/components/background'
import Logo from '@/components/logo'
import AuthCard from '@/components/ui/auth-card'
import FormInput from '@/components/ui/form-input'
import PrimaryButton from '@/components/ui/primary-button'
import Divider from '@/components/ui/divider'
import MicrosoftButton from '@/components/microsoft-button'
import GoogleButton from '@/components/google-button'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate CIT-U email
      if (!formData.email.endsWith('@cit.edu')) {
        toast.error('Please use your institutional email (@cit.edu)')
        return
      }

      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      })

      // Store auth data
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userEmail', response.user.email)
      localStorage.setItem('userId', response.user.id.toString())


      toast.success('Login successful!')
      router.push('/home')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleMicrosoftSignIn = () => {
    toast.info('Microsoft OAuth will be implemented soon')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #020617, #1e3a8a, #020617)',
      color: 'white',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px'
    }}>
      <Background />

      <div style={{ position: 'relative', width: '100%', maxWidth: '448px' }}>
        <Logo />

        <AuthCard title="Sign In">

          {/* <MicrosoftButton onClick={handleMicrosoftSignIn} /> */}
          <GoogleButton text="Sign in with Google" />

          <Divider text="Or" />

          <form onSubmit={handleSubmit}>
            <FormInput
              id="email"
              type="email"
              label="Institutional Email"
              placeholder="student@cit.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={Mail}
              required
            />

            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              icon={Lock}
              required
            />

            <PrimaryButton type="submit" disabled={loading} fullWidth>
              {loading ? 'Logging in...' : 'Log in'}
            </PrimaryButton>

            <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
              <span style={{ color: '#9ca3af' }}>Don't have an account? </span>
              <Link href="/register" style={{ color: '#60a5fa', fontWeight: '600', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </p>
          </form>
        </AuthCard>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Need help? Contact{' '}
            <a href="mailto:support@cit.edu" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              support@cit.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}