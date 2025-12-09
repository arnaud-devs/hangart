"use client"

import React, { useState, useTransition, useEffect, Suspense } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useAuth, default as AuthProvider } from '@/lib/authProvider'

type FormValues = {
  identifier: string // username or email
  password: string
}

// Demo users removed — production-ready login only

function LoginContent(){
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const [isPending, startTransition] = useTransition()
  const { register, handleSubmit, formState } = useForm<FormValues>()
  const { errors, isSubmitting } = formState
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showRedirectMessage, setShowRedirectMessage] = useState(false)
  const auth = useAuth();

  useEffect(() => {
    if (redirect) {
      setShowRedirectMessage(true)
    }
  }, [redirect])

  const onSubmit = async (data: FormValues) => {
    setError(null)
    setSuccess(null)
    try {
      const me = await auth.signIn(data.identifier, data.password);
      console.log('Login successful, user object:', me);
      
      // Use redirect parameter if available, otherwise determine by role
      let targetPath = redirect || '/dashboard';
      if (!redirect) {
        const role = (me?.role || '').toLowerCase();
        if (role === 'artist') targetPath = '/dashboard/artworks';
        else if (role === 'buyer') targetPath = '/';
        else if (role === 'museum') targetPath = '/dashboard/museum';
        else if (role === 'admin') targetPath = '/dashboard/approvals';
      }
      
      console.log('Redirecting to:', targetPath);
      try { localStorage.setItem('auth_ok', 'true') } catch {}
      
      console.log('About to call router.push with path:', targetPath);
      startTransition(() => {
        router.push(targetPath);
      });
      console.log('router.push called, also using window.location as fallback');
      
      // Fallback: use window.location if router doesn't work
      setTimeout(() => {
        window.location.href = targetPath;
      }, 500);
    } catch (e: any) {
      console.error('Login failed:', e);
      setError(String(e?.message ?? e))
    }
  }

  // No demo login helper — use real credentials to sign in

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-[#0b1220] px-4">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold">H</div>
            <div>
              <h1 className="text-2xl font-semibold">Welcome back to Hangart</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to manage your artworks, purchases and dashboard.</p>
            </div>
          </div>

          <div className="space-y-4">
          <h1 className="text-2xl font-semibold mb-4">Sign in</h1>

          {showRedirectMessage && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Please log in to continue to checkout
              </p>
            </div>
          )}

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
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required' })} />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{String(errors.password.message)}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Need an account? <Link href={redirect ? `/signup?redirect=${redirect}` : "/signup"} className="text-emerald-600 hover:underline">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
    </main>
  )
}

export default function LoginPage(){
  return (
    <AuthProvider>
      <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
        <LoginContent />
      </Suspense>
    </AuthProvider>
  )
}
