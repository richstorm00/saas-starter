'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { ProfileMenu } from './profile-menu'
import { Button } from '@/components/ui/button'

export function AuthNav() {
  const { userId } = useAuth()

  if (userId) {
    return (
      <nav className="flex items-center space-x-4" aria-label="User navigation">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
        <ProfileMenu />
      </nav>
    )
  }

  return (
    <nav className="flex items-center space-x-2" aria-label="Authentication navigation">
      <Link href="/sign-in">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button size="sm">
          Get Started
        </Button>
      </Link>
    </nav>
  )
}

export function AuthFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-600 dark:text-slate-400 text-sm">
            &copy; 2024 SaaS Starter. All rights reserved.
          </div>
          
          <nav className="flex space-x-6 mt-4 md:mt-0" aria-label="Footer navigation">
            <Link 
              href="/sign-in" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm transition-colors focus:outline-none focus:underline"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm transition-colors focus:outline-none focus:underline"
            >
              Sign Up
            </Link>
            <Link 
              href="/forgot-password" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm transition-colors focus:outline-none focus:underline"
            >
              Forgot Password
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}