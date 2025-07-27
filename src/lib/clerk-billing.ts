// Clerk Billing Integration Guide
// This file provides the structure for integrating with Clerk's billing system

interface ClerkPricingPlan {
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

// This is the structure you'll need to implement
// to fetch pricing plans from Clerk's billing system
export async function fetchClerkPricingPlans() {
  // To integrate with Clerk's billing system:
  // 1. Set up Stripe integration in Clerk dashboard
  // 2. Create products and pricing plans in Clerk
  // 3. Use Clerk's REST API to fetch the plans
  
  // Example implementation would look like:
  /*
  const response = await fetch('https://api.clerk.com/v1/billing/products', {
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data.data.map((product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    prices: {
      monthly: {
        id: product.default_price,
        amount: product.prices.find(p => p.recurring.interval === 'month')?.unit_amount / 100,
        currency: product.prices.find(p => p.recurring.interval === 'month')?.currency
      },
      yearly: product.prices.find(p => p.recurring.interval === 'year') ? {
        id: product.prices.find(p => p.recurring.interval === 'year')?.id,
        amount: product.prices.find(p => p.recurring.interval === 'year')?.unit_amount / 100,
        currency: product.prices.find(p => p.recurring.interval === 'year')?.currency
      } : undefined
    },
    features: product.metadata?.features?.split('\n') || [],
    limits: JSON.parse(product.metadata?.limits || '{}'),
    popular: product.metadata?.popular === 'true'
  }));
  */
  
  // For now, return empty until properly configured
  return [];
}

// Steps to set up Clerk pricing plans:
// 1. Go to https://dashboard.clerk.com
// 2. Select your application
// 3. Navigate to Billing > Products and Pricing
// 4. Connect your Stripe account
// 5. Create your pricing plans with features and limits
// 6. The API will then return the configured plans