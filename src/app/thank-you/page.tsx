'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifySession(sessionId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const verifySession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      }
    } catch (err) {
      setError('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Verifying your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome Aboard! 🎉
          </h1>
          
          <p className="text-gray-300 mb-6">
            Your subscription has been successfully activated. You're now ready to unlock the full potential of our platform.
          </p>

          {sessionData?.subscription?.items?.data[0]?.price && (
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Subscription Details</h3>
              <p className="text-gray-300 text-sm">
                Plan: <span className="font-medium">{sessionData.subscription.items.data[0].price.nickname || sessionData.subscription.items.data[0].price.id}</span>
              </p>
              <p className="text-gray-300 text-sm">
                Status: <span className="text-green-400 font-medium">Active</span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <p className="text-sm text-gray-400">
              You can access your dashboard anytime from the navigation menu.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold text-white mb-2">What's Next?</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Explore your new features</li>
              <li>• Set up your profile</li>
              <li>• Start using premium tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center"><div className="text-xl text-gray-300">Loading...</div></div>}>
      <ThankYouContent />
    </Suspense>
  );
}