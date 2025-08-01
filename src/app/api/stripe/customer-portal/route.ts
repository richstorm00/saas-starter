import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Import clerkClient here to avoid SSR issues
    const { clerkClient } = await import('@clerk/nextjs/server');
    
    // Get user data
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const customerId = user.privateMetadata?.subscription?.customerId;

    if (!customerId) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    // Create a Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error) {
    console.error('Error creating customer portal:', error);
    return NextResponse.json({ error: 'Failed to create portal' }, { status: 500 });
  }
}