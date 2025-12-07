"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getMe } from '@/lib/authClient'

type FormValues = {
  identifier: string // username or email
  password: string
}

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
      // Backend expects username. We pass identifier as username; cookies are set server-side.
      const payload = { username: data.identifier, password: data.password }
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(json?.message ?? 'Login failed')
        return
      }

      // Optionally persist non-sensitive bits in localStorage; tokens are in httpOnly cookies
      try { localStorage.setItem('auth_ok', 'true') } catch {}
      // Fetch user to determine role-based redirect
      let rolePath = '/dashboard';
      try {
        const me = await getMe();
        const role = (me?.role || '').toLowerCase();
        // Persist a minimal user snapshot for client features
        try { localStorage.setItem('user', JSON.stringify(me)) } catch {}
        if (role === 'artist') {
          rolePath = '/dashboard/artworks';
        } else if (role === 'buyer') {
          rolePath = '/dashboard/wishlist';
        } else if (role === 'museum') {
          rolePath = '/dashboard/museum';
        } else if (role === 'admin') {
          rolePath = '/dashboard/approvals';
        }
      } catch {}
      setSuccess('Logged in')
      router.push(rolePath)
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
    <main className="h-[70vh] flex justify-center bg-gray-50 dark:bg-[#1B1B1F] py-5">
      <div className="w-full max-w-xl grid grid-cols-1">
        

        <div className="bg-white dark:bg-[#1E1F20] p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Sign in</h1>

          {error && <div className="mb-4 text-sm text-red-700 dark:text-red-400">{error}</div>}
          {success && <div className="mb-4 text-sm text-green-700 dark:text-green-400">{success}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="identifier">Username or Email</Label>
              <Input id="identifier" type="text" placeholder="e.g. amina or amina@example.com" {...register('identifier', { required: 'Username or email is required' })} />
              {errors.identifier && <p className="text-sm text-red-600">{String(errors.identifier.message)}</p>}
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

          

          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
