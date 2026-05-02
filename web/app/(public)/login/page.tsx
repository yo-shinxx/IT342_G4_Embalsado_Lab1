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
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      })

      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userEmail', response.user.email)
      localStorage.setItem('userId', response.user.id.toString())

      toast.success('Login successful!')
      window.dispatchEvent(new Event('authChange'))
      router.push('/home')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#1e3a8a] to-[#020617] text-white overflow-hidden flex items-center justify-center p-20">
      <Background />

      <div className="relative w-full max-w-md">
        <Logo />

        <AuthCard title="Sign In">
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

            <p className="mt-4 text-center text-sm">
              <span className="text-gray-400">Don't have an account? </span>
              <Link href="/register" className="text-blue-400 font-semibold no-underline hover:text-blue-300">
                Sign Up
              </Link>
            </p>
          </form>
        </AuthCard>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact{' '}
            <a href="mailto:support@cit.edu" className="text-blue-400 no-underline hover:text-blue-300">
              support@cit.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}