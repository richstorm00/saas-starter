import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const userId = session.metadata?.userId;
  const priceId = session.metadata?.priceId;

  if (!userId || !priceId) {
    console.error('Missing userId or priceId in session metadata');
    return;
  }

  try {
    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    
    // Get the price information and fetch product details
    const subscriptionItem = subscription.items.data[0];
    const price = subscriptionItem.price;
    
    // Fetch product details to get the actual name
    let productName = 'Unknown';
    try {
      if (price && price.product) {
        const product = await stripe.products.retrieve(price.product as string);
        productName = price.nickname || product.name || product.id;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      productName = price.nickname || (price.product as string);
    }
    
    const planName = productName;
    
    // Update Clerk user metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        subscription: {
          subscriptionId: subscription.id,
          customerId: customerId,
          plan: planName,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          priceId: priceId,
          createdAt: new Date().toISOString(),
        }
      },
      publicMetadata: {
        subscription: {
          plan: planName,
          status: subscription.status,
        }
      }
    });

    console.log(`Updated Clerk metadata for user ${userId}:`, {
      plan: planName,
      status: subscription.status,
      subscriptionId: subscription.id,
      priceId: priceId,
      productId: price.product,
      rawProduct: price.product
    });

  } catch (error) {
    console.error('Error updating Clerk metadata:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  try {
    // Find user by customer ID (you might need to store this mapping)
    const client = await clerkClient();
    const users = await client.users.getUserList({
      limit: 100
    });
    
    const user = users.data.find(u => 
      u.privateMetadata?.subscription?.customerId === customerId
    );
    
    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    const price = subscription.items.data[0]?.price;
    
    // Fetch product details to get the actual name
    let productName = 'Unknown';
    try {
      if (price && price.product) {
        const product = await stripe.products.retrieve(price.product as string);
        productName = price.nickname || product.name || product.id;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      productName = price?.nickname || (price?.product as string);
    }
    
    const planName = productName;

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        subscription: {
          ...user.privateMetadata?.subscription,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          plan: planName,
          updatedAt: new Date().toISOString(),
        }
      },
      publicMetadata: {
        subscription: {
          plan: planName,
          status: subscription.status,
        }
      }
    });

    console.log(`Updated subscription status for user ${user.id}:`, subscription.status);
  } catch (error) {
    console.error('Error updating subscription status:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({
      limit: 100
    });
    
    const user = users.data.find(u => 
      u.privateMetadata?.subscription?.customerId === customerId
    );
    
    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        subscription: {
          ...user.privateMetadata?.subscription,
          status: 'canceled',
          canceledAt: new Date().toISOString(),
        }
      },
      publicMetadata: {
        subscription: {
          plan: user.privateMetadata?.subscription?.plan || 'Unknown',
          status: 'canceled',
        }
      }
    });

    console.log(`Marked subscription as canceled for user ${user.id}`);
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({
      limit: 100
    });
    
    const user = users.data.find(u => 
      u.privateMetadata?.subscription?.customerId === customerId
    );
    
    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        subscription: {
          ...user.privateMetadata?.subscription,
          lastPaymentStatus: 'succeeded',
          lastPaymentDate: new Date().toISOString(),
        }
      }
    });

    console.log(`Updated payment success for user ${user.id}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({
      limit: 100
    });
    
    const user = users.data.find(u => 
      u.privateMetadata?.subscription?.customerId === customerId
    );
    
    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        subscription: {
          ...user.privateMetadata?.subscription,
          lastPaymentStatus: 'failed',
          lastPaymentDate: new Date().toISOString(),
        }
      }
    });

    console.log(`Updated payment failure for user ${user.id}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

