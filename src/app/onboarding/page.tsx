'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOnboarding = async () => {
      if (!isLoaded) return;
      
      if (!isSignedIn) {
        router.push('/sign-in');
        return;
      }

      const plan = searchParams.get('plan');
      const checkout = searchParams.get('checkout');

      if (plan && checkout === 'true') {
        // Start Stripe checkout immediately
        try {
          const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              priceId: plan,
              userId: user?.id,
              email: user?.emailAddresses[0]?.emailAddress
            }),
          });

          if (response.ok) {
            const { sessionId } = await response.json();
            const stripe = await stripePromise;
            
            if (stripe) {
              await stripe.redirectToCheckout({ sessionId });
              return;
            }
          } else {
            const data = await response.json();
            setError(data.error || 'Failed to create checkout session');
          }
        } catch (error) {
          console.error('Failed to start checkout:', error);
          setError('Failed to start checkout. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        // No checkout needed, go to dashboard
        router.push('/dashboard');
      }
    };

    handleOnboarding();
  }, [isSignedIn, isLoaded, searchParams, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300 mb-2">Setting up your account...</p>
          {searchParams.get('plan') && (
            <p className="text-sm text-gray-400">Preparing checkout for your selected plan...</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Setup Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            
            <div className="space-y-4">
              <button
                onClick={() => router.push('/pricing')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Try Again
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null; // Redirects will handle navigation
}