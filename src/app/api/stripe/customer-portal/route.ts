import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data directly from Clerk
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const customerId = user.privateMetadata?.subscription?.customerId;

    if (!customerId) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    // Create a Stripe Customer Portal session with configuration
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/account`,
      configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID || undefined,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    console.error('Error creating customer portal:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      if (error.message.includes('configuration provided')) {
        return NextResponse.json({ 
          error: 'Stripe Customer Portal not configured. Please set up your billing portal at https://dashboard.stripe.com/test/settings/billing/portal',
          type: 'configuration_error'
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to create portal', 
      details: error.message 
    }, { status: 500 });
  }
}