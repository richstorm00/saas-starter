'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function AuthNav() {
  const { userId } = useAuth()

  if (userId) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "bg-white dark:bg-slate-800",
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
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
    </div>
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
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              href="/sign-in" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm"
            >
              Sign Up
            </Link>
            <Link 
              href="/forgot-password" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm"
            >
              Forgot Password
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}