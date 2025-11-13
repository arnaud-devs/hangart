"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

type FormValues = {
  email: string
  password: string
}

export default function LoginPage() {
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

      setSuccess('Logged in (demo). Token: ' + (json.token ?? ''))
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-[#1B1B1F]">
      <div className="w-full max-w-md bg-white p-8 rounded shadow dark:bg-[#1B1B1F] dark:border-1">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>

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

        <p className="mt-4 text-sm text-gray-600">
          Demo credentials: <strong>test@example.com / password</strong>
        </p>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
