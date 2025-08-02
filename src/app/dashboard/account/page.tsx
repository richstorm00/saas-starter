'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface SubscriptionData {
  plan: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  price_id: string;
}

export default function AccountPage() {
  const { user } = useUser();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/user/current-plan');
      const data = await response.json();
      
      if (data.subscription) {
        setSubscriptionData(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ return_url: window.location.href }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setRefreshLoading(true);
    await fetchSubscriptionData();
    setRefreshLoading(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'past_due':
        return 'warning';
      case 'canceled':
        return 'destructive';
      case 'incomplete':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account information and subscription details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your basic account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <p className="text-gray-900 dark:text-white">{user?.firstName || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <p className="text-gray-900 dark:text-white">{user?.lastName || 'Not provided'}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <p className="text-gray-900 dark:text-white">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Account created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Subscription Details</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshData}
              disabled={refreshLoading}
            >
              <RefreshCw className={`w-4 h-4 ${refreshLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscriptionData ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Plan</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {subscriptionData.plan}
                  </p>
                </div>
                <Badge variant={getStatusColor(subscriptionData.status)} className="capitalize">
                  {subscriptionData.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Billing Period</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Renews on {formatDate(subscriptionData.current_period_end)}
                </p>
                {subscriptionData.cancel_at_period_end && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    ⓘ Will cancel at end of period
                  </p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="w-full sm:w-auto"
                >
                  {portalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No active subscription found.
              </p>
              <Link href="/pricing" className="text-blue-600 hover:underline">
                View pricing plans
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => window.open('https://dashboard.clerk.com', '_blank')}
              className="w-full sm:w-auto"
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced Account Settings
            </Button>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access your full account settings including password, email, and security options.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}