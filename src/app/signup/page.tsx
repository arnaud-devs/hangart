"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

type FormValues = {
  username: string
  email: string
  password: string
  password2: string
  role: 'artist' | 'buyer'
  first_name?: string
  last_name?: string
  phone?: string
}

export default function SignupPage() {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>()
  const { errors, isSubmitting } = formState
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const password = watch('password')

  const onSubmit = async (data: FormValues) => {
    setError(null)
    setSuccess(null)

    if (data.password !== data.password2) {
      setError('Passwords do not match')
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          password2: data.password2,
          role: data.role,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
        }),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(json?.message ?? 'Signup failed')
        return
      }

      setSuccess('Account created successfully! You can now log in.')
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-[#1B1B1F] px-4">
      <div className="w-full max-w-md dark:border p-8 rounded shadow bg-gray-50 dark:bg-[#1B1B1F]">
        <h1 className="text-2xl font-semibold mb-4">Create Account</h1>

        {error && <div className="mb-4 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-700">{success}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              type="text" 
              {...register('username', { required: 'Username is required' })} 
            />
            {errors.username && <p className="text-sm text-red-600">{String(errors.username.message)}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })} 
            />
            {errors.email && <p className="text-sm text-red-600">{String(errors.email.message)}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })} 
            />
            {errors.password && <p className="text-sm text-red-600">{String(errors.password.message)}</p>}
          </div>

          <div>
            <Label htmlFor="password2">Confirm Password</Label>
            <Input 
              id="password2" 
              type="password" 
              {...register('password2', { 
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match'
              })} 
            />
            {errors.password2 && <p className="text-sm text-red-600">{String(errors.password2.message)}</p>}
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <select id="role" className="mt-1 block w-full border rounded px-3 py-2" {...register('role', { required: 'Role is required' })}>
              <option value="">Select role</option>
              <option value="artist">Artist</option>
              <option value="buyer">Buyer</option>
            </select>
            {errors.role && <p className="text-sm text-red-600">{String(errors.role.message)}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="first_name">First Name (optional)</Label>
              <Input id="first_name" type="text" {...register('first_name')} />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name (optional)</Label>
              <Input id="last_name" type="text" {...register('last_name')} />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" type="tel" {...register('phone')} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Sign up'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
