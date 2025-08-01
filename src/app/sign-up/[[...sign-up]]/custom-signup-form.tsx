'use client';

import { useState, useEffect } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ProviderIcon = ({ provider, size = 5 }: { provider: string; size?: number }) => {
  const sizeClass = `w-${size} h-${size}`;
  
  switch (provider) {
    case 'google':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M11.4 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      );
    case 'github':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    case 'microsoft':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#00BCF2" d="M11.4 11.4H0V0h11.4v11.4z"/>
          <path fill="#00BCF2" d="M24 11.4H12.6V0H24v11.4z"/>
          <path fill="#00BCF2" d="M11.4 24H0V12.6h11.4V24z"/>
          <path fill="#00BCF2" d="M24 24H12.6V12.6H24V24z"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'discord':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="#1DA1F2" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      );
    case 'apple':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17.48 2.94 12.04 4.95 9.36c1.01-1.36 2.64-2.23 4.23-2.26 1.32-.03 2.56.87 3.38.87.82 0 2.36-1.07 3.99-.92.68.03 2.6.27 3.85 2.03C21.26 11.5 19.27 16.5 18.71 19.5zM13.03 3.49c.72-.89 1.21-2.13 1.08-3.37-1.04.09-2.29.72-3.02 1.61-.67.83-1.26 2.16-1.1 3.38 1.13.08 2.29-.61 3.04-1.62z"/>
        </svg>
      );
    case 'twitch':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="#9146FF" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.86L20.57 12V2M19.14 11.43l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z"/>
        </svg>
      );
    case 'slack':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
          <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52h-2.521zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
          <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.52A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522v-2.52zM17.688 8.834a2.528 2.528 0 0 1-2.522 2.521 2.528 2.528 0 0 1-2.522-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.522 2.522v6.312z" fill="#2EB67D"/>
          <path d="M15.165 18.956a2.528 2.528 0 0 1 2.522 2.522A2.528 2.528 0 0 1 15.165 24a2.528 2.528 0 0 1-2.521-2.522v-2.522h2.521zM15.165 17.688a2.528 2.528 0 0 1-2.521-2.522 2.528 2.528 0 0 1 2.521-2.521h6.313A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.522h-6.313z" fill="#ECB22E"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="#0077B5" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case 'notion':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.793 1.254 1.88 1.254h12.5c1.254 0 1.88-.7 1.88-1.254V7.288c0-.7-.56-.98-1.254-1.027L6.64 5.137c-.7-.047-1.393.28-1.393 1.027zm4.542 1.254l.793 11.7c.046.28-.046.56-.327.653-.28.14-.607.047-.7-.187L7.83 16.7c-.14-.28-.14-.653-.047-.933zm4.542-.187c.28-.047.607.046.7.28l2.43 11.276c.14.28-.047.56-.327.7-.28.14-.607.047-.7-.187L13.36 16.7c-.14-.28-.047-.56.187-.653z"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg className={sizeClass} viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.525 0c-1.518 0-2.964.34-4.268.956C6.951.34 5.505 0 3.987 0H0v19.809c0 1.519.34 2.965.956 4.269.617-1.304.956-2.75.956-4.269V12.73h2.527c.34 2.326 1.519 4.456 3.173 6.11 1.654 1.654 3.784 2.833 6.11 3.173v-2.527c-2.326-.34-4.456-1.519-6.11-3.173-1.654-1.654-2.833-3.784-3.173-6.11h6.283v-2.527H9.444c.34-2.326 1.519-4.456 3.173-6.11C13.271 1.519 15.401.34 17.727 0z"/>
        </svg>
      );
    default:
      return <span className={sizeClass}>⚡</span>;
  }
};

export function CustomSignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);
  const [availableProviders, setAvailableProviders] = useState<Array<{id: string, name: string, icon: string}>>([]);
  const [providersLoading, setProvidersLoading] = useState(true);

  // CAPTCHA error detection
  const isCaptchaError = (error: any): boolean => {
    if (!error) return false;
    const message = error.message || error.toString();
    return message.includes('CAPTCHA') || 
           message.includes('Smart CAPTCHA') || 
           message.includes('captcha') ||
           error.status === 403 ||
           error.code === 'captcha_required';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) {
      console.error('Clerk not loaded or signUp unavailable');
      setError('Authentication service not available');
      setLoading(false);
      return;
    }

    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !emailAddress.trim() || !password || !verifyPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (password !== verifyPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starting sign-up process...');
      const result = await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      
      console.log('Sign-up created:', result);
      
      const verificationResult = await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      console.log('Verification prepared:', verificationResult);
      
      setPendingVerification(true);
    } catch (err: unknown) {
      console.error('Sign-up error:', err);
      
      // Handle different error types
      const clerkError = err as {
        errors?: Array<{
          longMessage?: string;
          message?: string;
          code?: string;
        }>;
        message?: string;
        status?: number;
      };
      
      console.error('Detailed error object:', {
        error: clerkError,
        status: clerkError.status,
        errors: clerkError.errors,
        message: clerkError.message
      });
      
      let errorMessage = 'An error occurred during sign up';
      
      if (clerkError.errors?.[0]?.longMessage) {
        errorMessage = clerkError.errors[0].longMessage;
      } else if (clerkError.errors?.[0]?.message) {
        errorMessage = clerkError.errors[0].message;
      } else if (clerkError.message) {
        errorMessage = clerkError.message;
      }
      
      // CAPTCHA error detection and enhanced handling
      const isCaptcha = isCaptchaError(clerkError);
      setCaptchaError(isCaptcha);
      
      // Handle CAPTCHA errors with enhanced guidance
      if (isCaptcha) {
        errorMessage = `🚨 **CAPTCHA Verification Failed**

This appears to be a security verification issue. Here are your **immediate options**:

✅ **Recommended**: Use OAuth below (Google/GitHub) - bypasses CAPTCHA entirely
🔄 **Alternative Steps**:
   • Disable ad blockers or security extensions
   • Use incognito/private mode
   • Try a different browser (Chrome, Firefox, Safari)
   • Check your network connection/firewall

🆘 **Still stuck?**: Contact support@quantumai.com`;
      }
      
      // Show actual error to user
      setError(errorMessage);
      
      // Log for debugging
      console.error('Clerk API Error:', {
        status: clerkError.status,
        message: errorMessage,
        fullError: clerkError
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        
        // Check for plan parameter to start checkout immediately
        const plan = searchParams.get('plan');
        const checkout = searchParams.get('checkout');
        const returnUrl = searchParams.get('return_url');
        
        if (plan && checkout === 'true') {
          // Start Stripe checkout with the selected plan
          try {
            const response = await fetch('/api/stripe/create-checkout-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                priceId: plan,
                userId: completeSignUp.createdUserId,
                email: emailAddress
              }),
            });

            if (response.ok) {
              const { sessionId } = await response.json();
              const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!));
              
              if (stripe) {
                await stripe.redirectToCheckout({ sessionId });
                return;
              }
            }
          } catch (stripeError) {
            console.error('Failed to start checkout:', stripeError);
            // Fall back to dashboard if checkout fails
          }
        }
        
        // Handle regular return URL or dashboard
        if (returnUrl && !checkout) {
          router.push(decodeURIComponent(returnUrl));
        } else {
          router.push('/dashboard');
        }
      } else {
        setLoading(false);
      }
    } catch (err: unknown) {
      const error = err as { errors?: { longMessage?: string }[] };
      const errorMessage = error.errors?.[0]?.longMessage || 'Invalid verification code';
      
      if (!errorMessage.includes('Smart CAPTCHA widget')) {
        setError(errorMessage);
      }
      setLoading(false);
    }
  };

  const handleSSOSignUp = async (provider: string) => {
    if (!isLoaded) return;
    
    setSsoLoading(provider);
    setError('');
    
    try {
      // Handle plan preservation for SSO
      const plan = searchParams.get('plan');
      const checkout = searchParams.get('checkout');
      
      let redirectUrlComplete = '/dashboard';
      
      if (plan && checkout === 'true') {
        // Create a special onboarding route that will handle checkout
        redirectUrlComplete = `/onboarding?plan=${plan}&checkout=true`;
      } else {
        const returnUrl = searchParams.get('return_url');
        if (returnUrl) {
          redirectUrlComplete = decodeURIComponent(returnUrl);
        }
      }
      
      await signUp.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: '/onboarding',
        redirectUrlComplete,
      });
    } catch (err) {
      console.error(`${provider} sign-up error:`, err);
      setError(`Failed to sign up with ${provider}. Please try again.`);
      setSsoLoading(null);
    }
  };

  // Detect available SSO providers from Clerk configuration
  useEffect(() => {
    const detectProviders = async () => {
      if (isLoaded && signUp) {
        try {
          console.log('Clerk loaded, signUp available:', !!signUp);
          console.log('SignUp object:', signUp);
          
          // Use Clerk's built-in OAuth provider detection
          const oauthProviders = signUp.supportedExternalAccounts || [];
          console.log('Clerk supported external accounts for sign-up:', oauthProviders);
          
          // Also check supported first factors as fallback
          const oauthStrategies = signUp.supportedFirstFactors?.filter(
            factor => factor.strategy && factor.strategy.startsWith('oauth_')
          ) || [];
          
          console.log('OAuth strategies from first factors for sign-up:', oauthStrategies);

          const providerMap = {
            'google': { id: 'google', name: 'Google', icon: 'google' },
            'github': { id: 'github', name: 'GitHub', icon: 'github' },
            'microsoft': { id: 'microsoft', name: 'Microsoft', icon: 'microsoft' },
            'facebook': { id: 'facebook', name: 'Facebook', icon: 'facebook' },
            'discord': { id: 'discord', name: 'Discord', icon: 'discord' },
            'twitter': { id: 'twitter', name: 'Twitter', icon: 'twitter' },
            'apple': { id: 'apple', name: 'Apple', icon: 'apple' },
            'twitch': { id: 'twitch', name: 'Twitch', icon: 'twitch' },
            'slack': { id: 'slack', name: 'Slack', icon: 'slack' },
            'linkedin': { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
            'notion': { id: 'notion', name: 'Notion', icon: 'notion' },
            'tiktok': { id: 'tiktok', name: 'TikTok', icon: 'tiktok' },
          };

          // Build providers from both sources
          const providers = [];
          
          // From supportedExternalAccounts (newer API)
          if (oauthProviders.length > 0) {
            oauthProviders.forEach(provider => {
              if (providerMap[provider.provider]) {
                providers.push(providerMap[provider.provider]);
              }
            });
          }
          
          // From supportedFirstFactors (fallback)
          if (providers.length === 0 && oauthStrategies.length > 0) {
            oauthStrategies.forEach(strategy => {
              const providerKey = strategy.strategy?.replace('oauth_', '');
              if (providerKey && providerMap[providerKey]) {
                providers.push(providerMap[providerKey]);
              }
            });
          }

          // Manual fallback for Google since we know it's enabled
          if (providers.length === 0) {
            providers.push({ id: 'google', name: 'Google', icon: 'google' });
            console.log('Using manual fallback for Google provider in sign-up');
          }

          console.log('Final configured providers for sign-up:', providers);
          setAvailableProviders(providers);
        } catch (error) {
          console.error('Error detecting providers for sign-up:', error);
          // Manual fallback for Google
          setAvailableProviders([
            { id: 'google', name: 'Google', icon: 'google' }
          ]);
        } finally {
          setProvidersLoading(false);
        }
      } else if (!isLoaded) {
        // Still loading Clerk
        setProvidersLoading(true);
      }
    };

    detectProviders();
  }, [isLoaded, signUp]);

  if (pendingVerification) {
    return (
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
            Verify Your Email
          </h1>
          <p className="text-gray-400">Enter the verification code sent to {emailAddress}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleVerification} className="space-y-6">
            {/* Clerk CAPTCHA container - required for Smart CAPTCHA */}
            <div id="clerk-captcha" className="hidden" />
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {error && (
              <div className={`p-4 rounded-lg text-sm ${captchaError ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    {captchaError ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="whitespace-pre-line">{error}</div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify Email'
            )}
            </button>
          </form>
        </div>
      </div>
    );
  }

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
          Create Your Account
        </h1>
        <p className="text-gray-400">Join thousands of innovators building with AI</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* SSO Providers */}
        {providersLoading ? (
          <div className="space-y-3 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full py-3 bg-white/5 border border-white/10 rounded-lg animate-pulse">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                  <div className="w-32 h-4 bg-white/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : availableProviders.length > 0 ? (
          <div className="space-y-3 mb-6">
            {availableProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => handleSSOSignUp(provider.id)}
                disabled={ssoLoading === provider.id}
                className="w-full flex items-center justify-center space-x-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ssoLoading === provider.id ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <ProviderIcon provider={provider.icon} />
                    <span>Sign up with {provider.name}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm mb-6">
            <p>No SSO providers configured. Please check your Clerk dashboard settings.</p>
            <p className="mt-1">Expected Google OAuth to be available.</p>
          </div>
        )}

        {availableProviders.length > 0 && (
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">Or sign up with email</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Clerk CAPTCHA container - required for Smart CAPTCHA */}
          <div id="clerk-captcha" className="hidden" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Doe"
                required
              />
            </div>
          </div>

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
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="verifyPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Verify Password
            </label>
            <input
              type="password"
              id="verifyPassword"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
              required
            />
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
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm mb-4">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
        
        {captchaError && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-300 max-w-md mx-auto">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium mb-1">CAPTCHA Issues?</p>
                <p className="text-yellow-200">
                  Try <strong>Google/GitHub sign-up</strong> above - it bypasses CAPTCHA entirely!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}