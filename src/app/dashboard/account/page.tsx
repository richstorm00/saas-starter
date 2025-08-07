'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, RefreshCw, Lock, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SubscriptionData {
  plan: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  price_id: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  prices: {
    monthly: {
      id: string;
      amount: number;
      currency: string;
    };
    yearly?: {
      id: string;
      amount: number;
      currency: string;
    };
  };
  features: string[];
  limits: {
    users?: number;
    storage?: string;
    apiCalls?: string;
  };
  popular?: boolean;
}

export default function AccountPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [confirmChange, setConfirmChange] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
    fetchPlans();
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      // Add cache busting to prevent stale data
      const response = await fetch(`/api/user/current-plan?t=${Date.now()}`);
      const data = await response.json();
      
      console.log('Subscription data received:', data);
      
      // Force re-evaluation of subscription state
      if (data.hasSubscription || data.plan) {
        setSubscriptionData({
          plan: data.plan,
          status: data.status,
          current_period_end: data.current_period_end,
          cancel_at_period_end: data.cancel_at_period_end,
          price_id: data.price_id
        });
      } else {
        setSubscriptionData(null);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/pricing/plans');
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedPlan || !confirmChange) return;
    
    setProcessing(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: selectedPlan,
          mode: 'subscription',
          success_url: `${window.location.origin}/dashboard/account`,
          cancel_url: `${window.location.origin}/dashboard/account`,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error changing plan:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (response.ok) {
        // Force immediate state update to show no subscription
        setSubscriptionData(null);
        
        // Give Clerk a moment to update, then refresh
        setTimeout(async () => {
          await fetchSubscriptionData();
        }, 1000);
        
        setShowCancelModal(false);
        alert('Subscription cancelled successfully!');
      } else {
        alert(`Error: ${data.error || 'Failed to cancel subscription'}`);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePasswordChange = () => {
    window.open('https://accounts.clerk.com/password', '_blank');
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ return_url: window.location.href }),
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error('Portal error:', data.error);
        
        // Handle configuration error
        if (data.type === 'configuration_error') {
          // Redirect to Stripe portal setup
          window.open('https://dashboard.stripe.com/test/settings/billing/portal', '_blank');
        } else {
          alert(`Error: ${data.error || 'Failed to open billing portal'}`);
        }
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Failed to open billing portal. Please check your setup.');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Ensure consistent timezone handling
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-gray-300 mt-2">
          Manage your account information and subscription details.
        </p>
      </div>

      {/* Profile Section */}
      <Card className="bg-[#1a1a1a] border-gray-800/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white">Profile Information</CardTitle>
          <CardDescription className="text-gray-400">Your basic account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">
                First Name
              </label>
              <p className="text-gray-900 mt-1">{user?.firstName || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Last Name
              </label>
              <p className="text-gray-900 mt-1">{user?.lastName || 'Not provided'}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">
              Email Address
            </label>
            <p className="text-white mt-1">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => setShowPasswordModal(true)}
              variant="outline"
              className="flex items-center space-x-2 border-white/20 text-white hover:bg-white/10"
            >
              <Lock className="w-4 h-4" />
              <span>Change Password</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Plan Section */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Current Plan</CardTitle>
          <CardDescription className="text-gray-300">Your subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscriptionData ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Current Plan</p>
                  <p className="text-lg font-semibold text-white capitalize">
                    {subscriptionData.plan}
                  </p>
                </div>
                <Badge 
                  variant={getStatusColor(subscriptionData.status)} 
                  className="capitalize"
                >
                  {subscriptionData.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-300">Billing Period</p>
                <p className="text-sm text-gray-300">
                  Renews on {formatDate(subscriptionData.current_period_end)}
                </p>
                {subscriptionData.cancel_at_period_end && (
                  <Alert className="mt-2 bg-yellow-500/10 border-yellow-500/20 text-yellow-200">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription>
                      Your subscription will be canceled at the end of the current billing period.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => setShowChangePlanModal(true)}
                  variant="outline"
                  className="flex items-center space-x-2 border-white/20 text-white hover:bg-white/10"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Change Plan</span>
                </Button>
                <Button
                  onClick={handleManageSubscription}
                  variant="outline"
                  className="flex items-center space-x-2 border-white/20 text-white hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                  <span>Manage Billing</span>
                </Button>
                {!subscriptionData.cancel_at_period_end && (
                  <Button
                    onClick={() => setShowCancelModal(true)}
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Cancel Plan</span>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-300 mb-4">
                No active subscription found.
              </p>
              <a href="/pricing" className="text-blue-400 hover:text-blue-300 transition-colors">
                View pricing plans
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Plan Modal */}
      <Dialog open={showChangePlanModal} onOpenChange={setShowChangePlanModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>
              Select a new plan that best fits your needs. Changes take effect immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.prices.monthly.id 
                    ? 'ring-2 ring-blue-500' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPlan(plan.prices.monthly.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.popular && (
                      <Badge variant="secondary">Popular</Badge>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-4">
                    {formatCurrency(plan.prices.monthly.amount, plan.prices.monthly.currency)}
                    <span className="text-sm font-normal text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirm"
                checked={confirmChange}
                onCheckedChange={(checked) => setConfirmChange(checked as boolean)}
              />
              <label
                htmlFor="confirm"
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                I understand that plan changes take effect immediately and I'll be charged accordingly.
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowChangePlanModal(false);
                setSelectedPlan('');
                setConfirmChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePlan}
              disabled={!selectedPlan || !confirmChange || processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Change Plan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Plan Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? This will immediately cancel your Stripe subscription and remove it from your account. You'll lose access to premium features immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
            >
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancelSubscription}
              variant="destructive"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Cancel Immediately'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              You'll be redirected to Clerk's secure password change page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordChange}>
              Continue to Password Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}