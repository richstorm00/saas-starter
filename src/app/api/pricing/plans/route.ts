import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // This would typically fetch from Clerk's billing API
    // For now, we'll return mock data that matches the frontend
    const plans = [
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

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing plans' },
      { status: 500 }
    );
  }
}