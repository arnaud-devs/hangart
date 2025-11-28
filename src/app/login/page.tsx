"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

type FormValues = {
  email: string
  password: string
}

const DEMO_USERS = [
  { id: 'admin-01', role: 'ADMIN', label: 'Admin', email: 'admin@example.com' },
  { id: 'artist-01', role: 'ARTIST', label: 'Artist', email: 'artist@example.com' },
  // { id: 'buyer-01', role: 'BUYER', label: 'Buyer', email: 'buyer@example.com' },
  { id: 'museum-01', role: 'MUSEUM', label: 'Museum', email: 'museum@example.com' },
]

export default function LoginPage() {
  const router = useRouter()
  const { register, handleSubmit, formState } = useForm<FormValues>()
  const { errors, isSubmitting } = formState
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (data: FormValues) => {
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(json?.message ?? 'Login failed')
        return
      }

      // If API returns user, persist it; otherwise keep token-only demo behavior
      if (json.user) {
        try { localStorage.setItem('user', JSON.stringify(json.user)) } catch {}
      }
      setSuccess('Logged in')
      router.push('/dashboard')
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
  }

  const demoLogin = (u: { id: string; role: string; label: string; email?: string }) => {
    const demoUser = {
      id: u.id,
      firstName: u.label,
      lastName: 'Demo',
      email: u.email || `${u.label.toLowerCase()}@example.com`,
      role: u.role,
      profileImage: '',
    }
    try { localStorage.setItem('user', JSON.stringify(demoUser)) } catch {}
    // redirect to dashboard — dashboard reads localStorage user to show role view
    router.push('/dashboard')
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-[#0b1220] px-4">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-lg p-8 hidden md:block">
          <h2 className="text-2xl font-bold mb-2">Welcome back to Hangart</h2>
          <p className="text-sm opacity-90">Manage artworks, view analytics, and connect with collectors. Pick a demo profile below to preview role-specific dashboards.</p>

          <div className="mt-6 space-y-3">
            {DEMO_USERS.map(u => (
              <button key={u.id} onClick={() => demoLogin(u)} className="w-full text-left bg-white/20 hover:bg-white/30 px-4 py-2 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{u.label} (Demo)</div>
                  <div className="text-xs opacity-90">{u.email}</div>
                </div>
                <div className="text-xs opacity-90">Go</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Sign in</h1>

          {error && <div className="mb-4 text-sm text-red-700">{error}</div>}
          {success && <div className="mb-4 text-sm text-green-700">{success}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-sm text-red-600">{String(errors.email.message)}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password', { required: 'Password is required' })} />
              {errors.password && <p className="text-sm text-red-600">{String(errors.password.message)}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-sm text-gray-600 mb-2">Quick demo logins</div>
            <div className="flex flex-wrap gap-2">
              {DEMO_USERS.map(u => (
                <button key={u.id} onClick={() => demoLogin(u)} className="px-3 py-2 border rounded text-sm hover:bg-gray-50">{u.label}</button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Demo credentials are available; pick a role to preview the dashboard.
          </p>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Don't have an account?{' '}
            <Link href="/signup" className="text-emerald-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
