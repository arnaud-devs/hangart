"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

type FormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
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

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
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
    <main className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-[#1B1B1F]">
      <div className="w-full max-w-md dark:border p-8 rounded shadow bg-gray-50 dark:bg-[#1B1B1F]">
        <h1 className="text-2xl font-semibold mb-4">Create Account</h1>

        {error && <div className="mb-4 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-700">{success}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              {...register('name', { required: 'Name is required' })} 
            />
            {errors.name && <p className="text-sm text-red-600">{String(errors.name.message)}</p>}
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
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })} 
            />
            {errors.password && <p className="text-sm text-red-600">{String(errors.password.message)}</p>}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match'
              })} 
            />
            {errors.confirmPassword && <p className="text-sm text-red-600">{String(errors.confirmPassword.message)}</p>}
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
