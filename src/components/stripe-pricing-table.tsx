'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Zap, Shield, Building, Check, Rocket } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePrice {
  id: string;
  unit_amount: number;
  currency: string;
  type: string;
  recurring?: {
    interval: string;
    interval_count: number;
  };
}

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  metadata: {
    features?: string;
    popular?: string;
    highlight?: string;
  };
  prices: StripePrice[];
}

export function StripePricingTable() {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');

  useEffect(() => {
    fetchStripeProducts();
  }, []);

  const fetchStripeProducts = async () => {
    try {
      const response = await fetch('/api/stripe/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      const sortedProducts = data.products.sort((a: StripeProduct, b: StripeProduct) => {
        const priceA = getCurrentPrice(a)?.unit_amount || 0;
        const priceB = getCurrentPrice(b)?.unit_amount || 0;
        return priceA - priceB;
      });
      setProducts(sortedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing');
      // Fallback data if Stripe fetch fails - ordered from cheapest to most expensive
      setProducts([
        {
          id: 'enterprise',
          name: 'Enterprise',
          description: 'For large organizations',
          metadata: {
            features: 'Unlimited tokens,Dedicated models,White-label API,24/7 dedicated support,On-premise deployment',
            highlight: 'false'
          },
          prices: [
            {
              id: 'price_enterprise_monthly',
              unit_amount: 0,
              currency: 'usd',
              type: 'recurring',
              recurring: { interval: 'month', interval_count: 1 }
            }
          ]
        },
        {
          id: 'professional',
          name: 'Professional',
          description: 'For growing teams',
          metadata: {
            features: '50M tokens per month,Unlimited AI models,Advanced API,Priority support,Custom training',
            highlight: 'true'
          },
          prices: [
            {
              id: 'price_pro_monthly',
              unit_amount: 9900,
              currency: 'usd',
              type: 'recurring',
              recurring: { interval: 'month', interval_count: 1 }
            },
            {
              id: 'price_pro_yearly',
              unit_amount: 9900 * 12 * 0.75,
              currency: 'usd',
              type: 'recurring',
              recurring: { interval: 'year', interval_count: 1 }
            }
          ]
        },
        {
          id: 'starter',
          name: 'Starter',
          description: 'Perfect for individuals',
          metadata: {
            features: '5M tokens per month,10 AI models,API access,Email support',
            highlight: 'false'
          },
          prices: [
            {
              id: 'price_starter_monthly',
              unit_amount: 2900,
              currency: 'usd',
              type: 'recurring',
              recurring: { interval: 'month', interval_count: 1 }
            },
            {
              id: 'price_starter_yearly',
              unit_amount: 2900 * 12 * 0.75,
              currency: 'usd',
              type: 'recurring',
              recurring: { interval: 'year', interval_count: 1 }
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (priceId: string) => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getCurrentPrice = (product: StripeProduct) => {
    const prices = product.prices.filter(p => 
      p.type === 'recurring' && 
      p.recurring?.interval === billingCycle
    );
    return prices[0];
  };

  const getFeatures = (metadata: { features?: string }) => {
    return metadata.features?.split(',') || [];
  };

  const getIconForPlan = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return <Rocket className="w-6 h-6" />;
      case 'professional':
        return <Zap className="w-6 h-6" />;
      case 'enterprise':
        return <Building className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Loading pricing information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-xl text-red-400 max-w-2xl mx-auto mb-12">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Choose Your Plan
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Scale with confidence. From startups to enterprises, we have the perfect AI solution for your needs.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10">
          <button
            onClick={() => setBillingCycle('month')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === 'month'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('year')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === 'year'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Annual <span className="text-green-400 ml-1">-25%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product, index) => {
          const currentPrice = getCurrentPrice(product);
          const isPopular = index === 1; // Always set 2nd option as most popular
          const isCustom = currentPrice?.unit_amount === 0;

          return (
            <div
              key={product.id}
              className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
                isPopular
                  ? 'border-blue-500/50 shadow-2xl scale-[1.02] bg-gradient-to-b from-white/10 to-white/5'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  isPopular
                    ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/20'
                    : 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20'
                }`}>
                  {getIconForPlan(product.name)}
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-medium tracking-tight">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline mb-2">
                  {isCustom ? (
                    <span className="text-4xl font-light">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-light">{formatPrice(currentPrice?.unit_amount || 0, currentPrice?.currency || 'usd')}</span>
                      <span className="text-gray-400 ml-2">/{billingCycle}</span>
                    </>
                  )}
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>

              <ul className="space-y-4 mb-8">
                {getFeatures(product.metadata).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature.trim()}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (currentPrice && !isCustom) {
                    handleCheckout(currentPrice.id);
                  } else if (isCustom) {
                    // Handle custom pricing contact
                    window.location.href = '/contact-sales';
                  }
                }}
                className={`w-full py-3 rounded-xl transition-all font-medium ${
                  isPopular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    : isCustom
                    ? 'bg-white/10 hover:bg-white/20 border border-white/20'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
              >
                {isCustom ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}