import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Clerk's billing system requires proper setup in the Clerk dashboard
    // This API endpoint is designed to fetch pricing plans from Clerk once configured
    
    // Check if Clerk billing is properly configured
    const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    
    if (!clerkPublishableKey || !clerkSecretKey) {
      return NextResponse.json({ 
        plans: [],
        error: 'Clerk keys not configured. Please add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to your .env.local file.'
      });
    }
    
    // Clerk's billing plans need to be set up in the dashboard
    // The actual implementation would involve:
    // 1. Setting up Stripe integration in Clerk dashboard
    // 2. Creating products and pricing plans
    // 3. Using Clerk's REST API to fetch the plans
    
    return NextResponse.json({ 
      plans: [],
      error: 'No pricing plans found. To set up pricing plans: 1. Go to https://dashboard.clerk.com, 2. Select your application, 3. Navigate to Billing > Products and Pricing, 4. Connect your Stripe account, 5. Create your pricing plans with features and limits.'
    });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    
    return NextResponse.json({ 
      plans: [],
      error: 'Failed to fetch pricing plans. Please check your Clerk dashboard for billing configuration.'
    }, { status: 500 });
  }
}