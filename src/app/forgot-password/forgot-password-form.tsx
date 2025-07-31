'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) {
      setError('Authentication service not available');
      return;
    }

    if (!emailAddress.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create sign-in with reset password strategy
      const result = await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress.trim(),
      });

      if (result.status === 'needs_first_factor') {
        setStep('verify');
        setSuccessMessage('Check your email for the verification code');
      } else {
        setError('Unable to send reset code. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Send code error:', err);
      
      const clerkError = err as {
        errors?: Array<{
          longMessage?: string;
          message?: string;
          code?: string;
        }>;
        message?: string;
      };
      
      let errorMessage = 'Failed to send reset code. Please try again.';
      
      if (clerkError.errors?.[0]?.longMessage) {
        errorMessage = clerkError.errors[0].longMessage;
      } else if (clerkError.errors?.[0]?.message) {
        errorMessage = clerkError.errors[0].message;
      } else if (clerkError.message) {
        errorMessage = clerkError.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) {
      setError('Authentication service not available');
      return;
    }

    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
      });

      if (result.status === 'needs_new_password') {
        setStep('reset');
        setSuccessMessage('Code verified. Please set your new password.');
      } else {
        setError('Invalid or expired code. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Verify code error:', err);
      
      const clerkError = err as {
        errors?: Array<{
          longMessage?: string;
          message?: string;
          code?: string;
        }>;
        message?: string;
      };
      
      let errorMessage = 'Invalid or expired code. Please try again.';
      
      if (clerkError.errors?.[0]?.longMessage) {
        errorMessage = clerkError.errors[0].longMessage;
      } else if (clerkError.errors?.[0]?.message) {
        errorMessage = clerkError.errors[0].message;
      } else if (clerkError.message) {
        errorMessage = clerkError.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) {
      setError('Authentication service not available');
      return;
    }

    if (!password) {
      setError('Please enter a new password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn.resetPassword({
        password: password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
      } else {
        setError('Unable to reset password. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Reset password error:', err);
      
      const clerkError = err as {
        errors?: Array<{
          longMessage?: string;
          message?: string;
          code?: string;
        }>;
        message?: string;
      };
      
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (clerkError.errors?.[0]?.longMessage) {
        errorMessage = clerkError.errors[0].longMessage;
      } else if (clerkError.errors?.[0]?.message) {
        errorMessage = clerkError.errors[0].message;
      } else if (clerkError.message) {
        errorMessage = clerkError.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSendCode} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="john@example.com"
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !isLoaded}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Sending Code...</span>
          </>
        ) : (
          'Send Reset Code'
        )}
      </button>
    </form>
  );

  const renderVerifyStep = () => (
    <form onSubmit={handleVerifyCode} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-300 mb-4">
          We've sent a 6-digit code to <strong className="text-white">{emailAddress}</strong>
        </p>
        <p className="text-sm text-gray-400">
          Enter the code below to continue
        </p>
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
          Verification Code
        </label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-center text-lg tracking-widest"
          placeholder="123456"
          maxLength={6}
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !isLoaded}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Verifying...</span>
          </>
        ) : (
          'Verify Code'
        )}
      </button>

      <button
        type="button"
        onClick={() => {
          setStep('email');
          setCode('');
          setError('');
          setSuccessMessage('');
        }}
        className="w-full py-3 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-200"
      >
        Back to Email
      </button>
    </form>
  );

  const renderResetStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-300">
          Create a new password for your account
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          New Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="••••••••"
          required
          disabled={loading}
          minLength={8}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="••••••••"
          required
          disabled={loading}
          minLength={8}
        />
      </div>

      <div className="text-sm text-gray-400">
        <p>Password must be at least 8 characters long</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !isLoaded}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Setting New Password...</span>
          </>
        ) : (
          'Set New Password'
        )}
      </button>
    </form>
  );

  return (
    <div className="w-full">
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
          Reset Your Password
        </h1>
        <p className="text-gray-400">
          {step === 'email' && 'Enter your email to receive a reset code'}
          {step === 'verify' && 'Enter the code sent to your email'}
          {step === 'reset' && 'Create a new password for your account'}
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        {step === 'email' && renderEmailStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'reset' && renderResetStep()}
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Remember your password?{' '}
          <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}