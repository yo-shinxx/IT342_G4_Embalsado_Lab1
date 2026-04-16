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
import GoogleButton from '@/components/google-button'

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

  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#1e3a8a] to-[#020617] text-white overflow-hidden flex items-center justify-center p-20">
      <Background />

      <Link 
        href="/" 
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-gray-400 no-underline hover:text-gray-300 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </Link>

      <div className="relative w-full max-w-md">
        <Logo />

        <AuthCard title="Sign Up">
          <GoogleButton text="Sign up with Google" />
          <Divider text="Or" />

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
                  required: true,
                },
                {
                  id: 'lastName',
                  type: 'text',
                  label: 'Last Name',
                  placeholder: 'Last',
                  value: lastName,
                  onChange: (e) => setLastName(e.target.value),
                  icon: User,
                  required: true,
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
            <p className="text-xs text-gray-500 -mt-2 mb-4">
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

            <p className="mt-4 text-center text-sm">
              <span className="text-gray-400">Already have an account? </span>
              <Link href="/login" className="text-blue-400 font-semibold no-underline hover:text-blue-300">
                Log in
              </Link>
            </p>
          </form>
        </AuthCard>

        <p className="mt-6 text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-blue-400 no-underline hover:text-blue-300">Terms of Service</a> and{' '}
          <a href="#" className="text-blue-400 no-underline hover:text-blue-300">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}