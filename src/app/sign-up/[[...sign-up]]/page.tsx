import { SignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function SignUpPage() {
  // Use environment variable to control waitlist vs sign-up
  if (process.env.NEXT_PUBLIC_SIGNUP_MODE === 'waitlist') {
    redirect('/waitlist');
  }

  // For public mode, show the sign-up form
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold">Quantum AI</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-gray-400">Join thousands of innovators building with AI</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'mx-auto',
                  cardBox: 'w-full',
                  card: 'bg-transparent border-0 shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'bg-white/10 border border-white/20 text-white hover:bg-white/20',
                  formFieldLabel: 'text-gray-300',
                  formFieldInput: 'bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-blue-500',
                  formButtonPrimary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
                  footerActionLink: 'text-blue-400 hover:text-blue-300',
                  identityPreviewText: 'text-gray-300',
                  identityPreviewEditButton: 'text-blue-400 hover:text-blue-300',
                  dividerLine: 'bg-white/20',
                  dividerText: 'text-gray-400',
                  alert: 'bg-red-500/20 border-red-500/50 text-red-300',
                  spinner: 'text-blue-400',
                },
                variables: {
                  colorPrimary: '#3b82f6',
                  colorBackground: 'transparent',
                  colorText: '#ffffff',
                  colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                  colorInputText: '#ffffff',
                  colorNeutral: '#6b7280',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  borderRadius: '0.5rem',
                },
              }}
              redirectUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <a href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}