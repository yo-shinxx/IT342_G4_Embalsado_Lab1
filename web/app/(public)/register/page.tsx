'use client'

import { Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useState } from 'react'
import type { FormEvent } from "react"
import { registerUser } from "@/lib/api/auth"
import { toast } from 'sonner'
import Background from '@/components/background'
import Logo from '@/components/logo'
import AuthCard from '@/components/ui/auth-card'
import FormInput from '@/components/ui/form-input'
import FormInputGrid from '@/components/ui/form-input-grid'
import PrimaryButton from '@/components/ui/primary-button'
import Divider from '@/components/ui/divider'
import MicrosoftButton from '@/components/microsoft-button'

export default function Register() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.endsWith('@cit.edu')) {
      toast.error('Please use your institutional email (@cit.edu)')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      await registerUser({ 
        firstName, 
        lastName, 
        email, 
        password 
      })
      toast.success('Account created successfully!')
      router.push("/home")
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Failed to register")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMicrosoftSignUp = () => {
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

      <Link 
        href="/" 
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#9ca3af',
          textDecoration: 'none',
          transition: 'color 0.2s'
        }}
      >
        <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </Link>

      <div style={{ position: 'relative', width: '100%', maxWidth: '448px' }}>
        <Logo />

        <AuthCard title="Create Account" subtitle="Join CIT-U's laboratory management system">

          <MicrosoftButton onClick={handleMicrosoftSignUp} />

          <Divider text="Or continue with email" />

          <form onSubmit={handleSubmit}>
            <FormInputGrid 
              inputs={[
                {
                  id: 'firstName',
                  type: 'text',
                  label: 'First Name',
                  placeholder: 'First',
                  value: firstName,
                  onChange: (e) => setFirstName(e.target.value),
                  icon: User,
                  required: true
                },
                {
                  id: 'lastName',
                  type: 'text',
                  label: 'Last Name',
                  placeholder: 'Last',
                  value: lastName,
                  onChange: (e) => setLastName(e.target.value),
                  icon: User,
                  required: true
                }
              ]}
            />

            <FormInput
              id="email"
              type="email"
              label="Institutional Email"
              placeholder="student@cit.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <p style={{ marginTop: '-8px', marginBottom: '16px', fontSize: '12px', color: '#6b7280' }}>
              Use your CIT-U institutional email
            </p>

            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <FormInput
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Lock}
              required
            />

            <PrimaryButton type="submit" disabled={loading} fullWidth>
              {loading ? 'Creating account...' : 'Create Account'}
            </PrimaryButton>

            <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
              <span style={{ color: '#9ca3af' }}>Already have an account? </span>
              <Link href="/login" style={{ color: '#60a5fa', fontWeight: '600', textDecoration: 'none' }}>
                Log in
              </Link>
            </p>
          </form>
        </AuthCard>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
          By creating an account, you agree to our{' '}
          <a href="#" style={{ color: '#60a5fa', textDecoration: 'none' }}>Terms of Service</a> and{' '}
          <a href="#" style={{ color: '#60a5fa', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}