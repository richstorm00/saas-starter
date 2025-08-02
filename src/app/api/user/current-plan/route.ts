import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Query Clerk metadata for subscription details
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // Check both public and private metadata for subscription info
    const publicMetadata = user.publicMetadata || {};
    const privateMetadata = user.privateMetadata || {};
    
    // Try to get subscription from private metadata first (more reliable)
    let subscription = privateMetadata.subscription;
    
    // Fallback to public metadata
    if (!subscription) {
      subscription = publicMetadata.subscription;
    }
    
    // If we have subscription data, format it properly
    if (subscription) {
      // Handle nested subscription structure properly
      const subscriptionData = subscription.subscription || subscription;
      
      const endDate = subscriptionData.currentPeriodEnd || subscriptionData.current_period_end || subscriptionData.endDate;
      if (!endDate) {
        console.error('No end date found in subscription data:', subscription);
        return NextResponse.json({
          error: 'Invalid subscription data - missing end date'
        }, { status: 500 });
      }
      
      return NextResponse.json({
        plan: subscriptionData.plan || subscriptionData.planId || subscriptionData.plan_name || 'Unknown',
        status: subscriptionData.status || 'active',
        current_period_end: endDate,
        cancel_at_period_end: subscriptionData.cancelAtPeriodEnd || subscriptionData.cancel_at_period_end || false,
        price_id: subscriptionData.priceId || subscriptionData.price_id || subscriptionData.planId || '',
        subscriptionId: subscriptionData.subscriptionId || subscriptionData.subscription_id || subscriptionData.id,
        customerId: subscriptionData.customerId || subscriptionData.customer_id,
        hasSubscription: true,
        subscription: subscriptionData // Include the full subscription object
      });
    }

    // Check if user has any Stripe customer ID stored
    const stripeCustomerId = privateMetadata.stripeCustomerId || publicMetadata.stripeCustomerId;
    
    if (stripeCustomerId) {
      // User has a Stripe customer ID but no active subscription found
      return NextResponse.json({
        plan: null,
        status: 'inactive',
        current_period_end: null,
        cancel_at_period_end: false,
        price_id: null,
        subscriptionId: null,
        customerId: stripeCustomerId,
        hasSubscription: false,
        message: 'Customer found but no active subscription'
      });
    }

    // No subscription data found
    return NextResponse.json({
      plan: null,
      status: 'inactive',
      current_period_end: null,
      cancel_at_period_end: false,
      price_id: null,
      subscriptionId: null,
      customerId: null,
      hasSubscription: false,
      message: 'No subscription found'
    });
  } catch (error) {
    console.error('Error fetching current plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current plan', details: error.message },
      { status: 500 }
    );
  }
}