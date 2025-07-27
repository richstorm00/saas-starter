'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
  limits: {
    users?: number;
    storage?: string;
    bandwidth?: string;
    apiCalls?: string;
  };
}

interface PricingTableProps {
  onPlanSelect?: (plan: PricingPlan) => void;
  showCurrentPlan?: boolean;
}

export function PricingTable({ onPlanSelect, showCurrentPlan = true }: PricingTableProps) {
  const { user, isSignedIn } = useUser();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  useEffect(() => {
    fetchPricingPlans();
    if (isSignedIn && showCurrentPlan) {
      fetchCurrentPlan();
    }
  }, [isSignedIn, showCurrentPlan]);

  const fetchPricingPlans = async () => {
    try {
      // In a real implementation, this would fetch from Clerk's billing API
      // For now, we'll use mock data that matches typical Clerk pricing structure
      const mockPlans: PricingPlan[] = [
        {
          id: 'starter',
          name: 'Starter',
          price: 9,
          currency: 'USD',
          interval: 'month',
          description: 'Perfect for side projects and MVPs',
          features: [
            'Up to 1,000 monthly active users',
            'Basic authentication',
            'Community support',
            '1GB storage',
            '10K API calls/month',
            'Email notifications'
          ],
          limits: {
            users: 1000,
            storage: '1GB',
            apiCalls: '10K/month'
          }
        },
        {
          id: 'professional',
          name: 'Professional',
          price: 29,
          currency: 'USD',
          interval: 'month',
          description: 'Best for growing businesses',
          features: [
            'Up to 10,000 monthly active users',
            'Advanced authentication (MFA, SSO)',
            'Priority support',
            '10GB storage',
            '100K API calls/month',
            'Custom domains',
            'Advanced analytics',
            'Team management'
          ],
          popular: true,
          limits: {
            users: 10000,
            storage: '10GB',
            apiCalls: '100K/month'
          }
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 99,
          currency: 'USD',
          interval: 'month',
          description: 'For large-scale applications',
          features: [
            'Unlimited monthly active users',
            'Enterprise authentication',
            'Dedicated support',
            '100GB storage',
            '1M API calls/month',
            'Custom integrations',
            'SLA guarantee',
            'On-premise option',
            'Advanced security'
          ],
          limits: {
            storage: '100GB',
            apiCalls: '1M/month'
          }
        }
      ];

      setPlans(mockPlans);
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      // In a real implementation, this would fetch from Clerk
      // For now, we'll simulate checking the user's current plan
      const response = await fetch('/api/user/current-plan');
      if (response.ok) {
        const data = await response.json();
        setCurrentPlanId(data.planId);
      }
    } catch (error) {
      console.error('Error fetching current plan:', error);
    }
  };

  const handlePlanSelect = async (plan: PricingPlan) => {
    if (onPlanSelect) {
      onPlanSelect(plan);
      return;
    }

    if (!isSignedIn) {
      // Redirect to sign up with plan selection
      window.location.href = `/sign-up?plan=${plan.id}&interval=${interval}`;
      return;
    }

    try {
      // In a real implementation, this would create a checkout session with Clerk
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          interval,
          userId: user?.id,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    }
  };

  const getPriceDisplay = (plan: PricingPlan) => {
    const price = interval === 'year' ? plan.price * 12 * 0.8 : plan.price;
    return price === 0 ? 'Free' : `$${price}`;
  };

  const getPeriodDisplay = (plan: PricingPlan) => {
    if (plan.price === 0) return '';
    return interval === 'year' ? '/year' : '/month';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20" data-testid="pricing-loading">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Interval Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setInterval('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              interval === 'month'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              interval === 'year'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Yearly (20% off)
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card
              className={`relative border-2 ${
                plan.popular
                  ? 'border-blue-500 shadow-2xl scale-105 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900'
                  : 'border-gray-200 dark:border-gray-700 hover:shadow-xl'
              } transition-all duration-300 h-full flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {currentPlanId === plan.id && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Current Plan
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {getPriceDisplay(plan)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">
                    {getPeriodDisplay(plan)}
                  </span>
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(plan)}
                  className="w-full"
                  variant={
                    currentPlanId === plan.id
                      ? 'outline'
                      : plan.popular
                      ? 'default'
                      : 'outline'
                  }
                  disabled={currentPlanId === plan.id}
                >
                  {currentPlanId === plan.id
                    ? 'Current Plan'
                    : isSignedIn
                    ? 'Upgrade Plan'
                    : 'Get Started'}
                  {currentPlanId !== plan.id && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-12">
        <p className="text-gray-600 dark:text-gray-400">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
}