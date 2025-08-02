import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

/**
 * API endpoint to sync Stripe subscription data to Clerk metadata
 * This should be called from your Stripe webhook handler
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subscriptionId, customerId } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'subscriptionId is required' },
        { status: 400 }
      );
    }

    // Fetch subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Fetch the price/product details
    const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);
    const product = await stripe.products.retrieve(price.product as string);

    // Prepare subscription data for Clerk metadata
    const subscriptionData = {
      plan: product.name.toLowerCase(),
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      priceId: subscription.items.data[0].price.id,
      subscriptionId: subscription.id,
      customerId: customerId || subscription.customer,
      productId: product.id,
      interval: price.recurring?.interval || 'month',
      amount: price.unit_amount ? price.unit_amount / 100 : 0,
      currency: price.currency
    };

    // Update Clerk user metadata
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        subscription: subscriptionData,
        stripeCustomerId: customerId || subscription.customer
      }
    });

    console.log('Updated Clerk metadata for user:', userId);
    console.log('Subscription data:', subscriptionData);

    return NextResponse.json({
      success: true,
      subscription: subscriptionData
    });

  } catch (error) {
    console.error('Error updating Clerk metadata:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription metadata', details: error.message },
      { status: 500 }
    );
  }
}