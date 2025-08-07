'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, Zap, Settings, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface SubscriptionData {
  plan: string;
  status: string;
  active: boolean;
  subscriptionId?: string;
  customerId?: string;
  currentPeriodStart?: number;
  currentPeriodEnd?: number;
  lastPaymentStatus?: string;
}

export default function SubscriptionPage() {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      loadSubscription();
    }
  }, [isLoaded, user]);

  const loadSubscription = async () => {
    try {
      const publicMetadata = user?.publicMetadata?.subscription as SubscriptionData;
      const privateMetadata = user?.privateMetadata?.subscription as any;
      
      if (publicMetadata) {
        setSubscription({
          ...publicMetadata,
          ...privateMetadata,
        });
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'canceled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'past_due':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-white/10 text-gray-300 border-white/20';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'starter':
        return <Zap className="w-5 h-5" />;
      case 'professional':
        return <Zap className="w-5 h-5" />;
      case 'enterprise':
        return <Settings className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-48 mb-4"></div>
            <div className="h-64 bg-white/5 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-[#1a1a1a] border-gray-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">No Active Subscription</CardTitle>
              <CardDescription className="text-gray-300">
                You don't have an active subscription yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Choose a plan to unlock premium features and start building with AI.
                </p>
                <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  <Link href="/pricing">
                    <Zap className="w-4 h-4 mr-2" />
                    View Plans
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
          <p className="text-gray-300">Manage your subscription and billing information</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Plan */}
          <Card className="bg-[#1a1a1a] border-gray-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getPlanIcon(subscription.plan)}
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Plan:</span>
                <span className="text-white font-semibold">{subscription.plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <Badge 
                  variant={subscription.status === 'active' ? 'default' : 'secondary'}
                  className={`capitalize ${subscription.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}`}
                >
                  {subscription.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Active:</span>
                <Badge 
                  variant={subscription.active ? "default" : "secondary"}
                  className={subscription.active ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                >
                  {subscription.active ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Billing Details */}
          <Card className="bg-[#1a1a1a] border-gray-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Billing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription.currentPeriodStart && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Current Period:</span>
                  <span className="text-white text-sm">
                    {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd!)}
                  </span>
                </div>
              )}
              {subscription.customerId && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Customer ID:</span>
                  <span className="text-white text-sm font-mono">
                    {subscription.customerId.substring(0, 8)}...
                  </span>
                </div>
              )}
              {subscription.subscriptionId && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Subscription ID:</span>
                  <span className="text-white text-sm font-mono">
                    {subscription.subscriptionId.substring(0, 8)}...
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-[#1a1a1a] border-gray-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">Manage Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                onClick={() => {
                  // This would typically open a Stripe Customer Portal
                  window.open('/api/stripe/customer-portal', '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">Change Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                <Link href="/pricing">
                  <Zap className="w-4 h-4 mr-2" />
                  View Plans
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">Support</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                <Link href="/support">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Get Help
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{subscription.plan}</div>
                <div className="text-sm text-gray-300">Current Plan</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  subscription.status === 'active' ? 'text-green-400' : 
                  subscription.status === 'canceled' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {subscription.status}
                </div>
                <div className="text-sm text-gray-300">Status</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {subscription.currentPeriodEnd ? 
                    Math.ceil((subscription.currentPeriodEnd * 1000 - Date.now()) / (1000 * 60 * 60 * 24)) : 
                    'N/A'
                  }
                </div>
                <div className="text-sm text-gray-300">Days Left</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {subscription.lastPaymentStatus === 'succeeded' ? '✓' : '⚠'}
                </div>
                <div className="text-sm text-gray-300">Payment</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}