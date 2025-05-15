import { z } from 'zod'
import { createClient } from './supabase/client'
import { redirect } from 'next/navigation'

// Validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

// Auth utilities
export async function signUp(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resetPassword(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })
  
  if (error) throw error
}

export async function updatePassword(password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({
    password
  })
  
  if (error) throw error
}

export async function getUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) throw error
  return user
}

export function routePush(path: string) {
  redirect(path)
}