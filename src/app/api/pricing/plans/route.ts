import { NextResponse } from 'next/server';

interface ClerkPlan {
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

export async function GET() {
  try {
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    
    if (!clerkSecretKey) {
      return NextResponse.json({ 
        plans: [],
        error: 'Clerk secret key not configured. Please add CLERK_SECRET_KEY to your .env.local file.'
      });
    }

    // Test connection to Clerk instance
    const instanceResponse = await fetch('https://api.clerk.com/v1/instance', {
      headers: {
        'Authorization': `Bearer ${clerkSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!instanceResponse.ok) {
      return NextResponse.json({ 
        plans: [],
        error: 'Invalid Clerk configuration. Please check your CLERK_SECRET_KEY.'
      });
    }

    // Since Clerk doesn't expose billing plans via REST API directly,
    // we need to check if billing is configured in the dashboard
    // For now, return a clear message about the setup requirement

    return NextResponse.json({ 
      plans: [],
      error: 'Clerk billing not configured. Required steps: 1. Visit https://dashboard.clerk.com 2. Select your application 3. Navigate to Billing > Products and Pricing 4. Connect your Stripe account 5. Create subscription plans 6. Add products with pricing tiers',
      instance_id: (await instanceResponse.json()).id,
      setup_guide: {
        step1: 'Go to Clerk Dashboard',
        step2: 'Select your application',
        step3: 'Navigate to Billing > Products and Pricing',
        step4: 'Connect Stripe account',
        step5: 'Create subscription plans',
        step6: 'Add products with features and limits'
      }
    });

  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    
    return NextResponse.json({ 
      plans: [],
      error: 'Failed to fetch pricing plans. Please check your Clerk dashboard for billing configuration.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}