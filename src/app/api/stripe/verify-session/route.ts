import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    // Retrieve the checkout session with subscription
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    if (!session.subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const subscription = session.subscription as Stripe.Subscription;
    const customer = session.customer as Stripe.Customer;

    // Get user ID from session metadata
    const userId = session.metadata?.userId;
    
    if (!userId) {
      console.error('No userId found in session metadata');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the price information and fetch product details
    const subscriptionItem = subscription.items.data[0];
    const price = subscriptionItem.price;
    
    if (!price) {
      return NextResponse.json({ error: 'Price information not found' }, { status: 404 });
    }

    // Fetch product details to get the actual name
    let productName = 'Unknown';
    try {
      if (price.product) {
        const product = await stripe.products.retrieve(price.product as string);
        productName = price.nickname || product.name || product.id;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      productName = price.nickname || (price.product as string);
    }
    
    const planName = productName;

    // Update Clerk user metadata to ensure it's synchronized
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          subscription: {
            subscriptionId: subscription.id,
            customerId: customer.id,
            plan: planName,
            status: subscription.status,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            priceId: price.id,
            verifiedAt: new Date().toISOString(),
          }
        },
        publicMetadata: {
          subscription: {
            plan: planName,
            status: subscription.status,
            active: subscription.status === 'active',
          }
        }
      });

      console.log(`Verified and updated subscription for user ${userId}:`, {
        plan: planName,
        status: subscription.status,
        subscriptionId: subscription.id,
        priceId: price.id,
        productId: price.product,
        productName: productName
      });

    } catch (clerkError) {
      console.error('Error updating Clerk metadata:', clerkError);
      // Continue anyway, as the webhook will handle it
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        items: {
          data: [
            {
              price: {
                id: price.id,
                nickname: price.nickname || planName,
                unit_amount: price.unit_amount,
                currency: price.currency,
              }
            }
          ]
        }
      },
      customer: {
        id: customer.id,
        email: customer.email,
      }
    });

  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}

