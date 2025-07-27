import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  // Clerk handles forgot password in the SignIn component
  // Redirect to sign-in with forgot password flow
  redirect('/sign-in?reset=true')
  
  // This content won't be shown due to redirect, but included for completeness
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Reset your password
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Redirecting to password reset...
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            If you&apos;re not redirected automatically, click the link below:
          </p>
          
          <Link 
            href="/sign-in?reset=true" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to sign in with password reset
          </Link>
        </div>
      </div>
    </div>
  )
}