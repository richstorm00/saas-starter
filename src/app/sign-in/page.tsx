import { SignIn } from '@clerk/nextjs'
import { Suspense } from 'react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to your account to continue
          </p>
        </div>
        
        <Suspense fallback={
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        }>
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                cardBox: "bg-white dark:bg-slate-800 rounded-lg shadow-lg",
                card: "p-8",
                headerTitle: "text-2xl font-semibold text-slate-900 dark:text-white mb-2",
                headerSubtitle: "text-sm text-slate-600 dark:text-slate-400",
                socialButtonsBlockButton: "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-lg",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
                footerActionLink: "text-blue-600 hover:text-blue-700",
                formFieldInput: "rounded-lg border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                identityPreviewText: "text-slate-700 dark:text-slate-300",
                alternativeMethodsBlockButton: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
              },
            }}
            routing="hash"
            redirectUrl="/dashboard"
            afterSignInUrl="/dashboard"
          />
        </Suspense>
      </div>
    </div>
  )
}