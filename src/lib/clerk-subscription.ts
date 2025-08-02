import { auth } from '@clerk/nextjs/server';

export interface SubscriptionData {
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  current_period_end: number;
  cancel_at_period_end: boolean;
  price_id: string;
  subscriptionId: string;
  customerId: string;
}

/**
 * Fetches the current user's subscription data from Clerk metadata
 * This function queries both public and private metadata to find subscription details
 */
export async function getCurrentSubscription(): Promise<SubscriptionData | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // Check both public and private metadata
    const publicMetadata = user.publicMetadata || {};
    const privateMetadata = user.privateMetadata || {};
    
    // Try multiple possible locations for subscription data
    let subscription: any = null;
    
    // Priority order for finding subscription data
    const possibleLocations = [
      publicMetadata.subscription,
      privateMetadata.subscription,
      publicMetadata.stripeSubscription,
      privateMetadata.stripeSubscription,
      publicMetadata.billingSubscription,
      privateMetadata.billingSubscription
    ];
    
    for (const location of possibleLocations) {
      if (location) {
        subscription = location;
        break;
      }
    }
    
    if (!subscription) {
      console.log('No subscription data found in Clerk metadata');
      return null;
    }
    
    // Normalize the subscription data structure
    return {
      plan: subscription.plan || subscription.planId || subscription.planName || 'Unknown',
      status: subscription.status || 'active',
      current_period_end: subscription.currentPeriodEnd || subscription.current_period_end || subscription.endDate || Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
      cancel_at_period_end: subscription.cancelAtPeriodEnd || subscription.cancel_at_period_end || false,
      price_id: subscription.priceId || subscription.price_id || subscription.planId || '',
      subscriptionId: subscription.subscriptionId || subscription.id || subscription.subscription_id || '',
      customerId: subscription.customerId || subscription.customer_id || subscription.stripeCustomerId || ''
    };
  } catch (error) {
    console.error('Error fetching subscription from Clerk:', error);
    return null;
  }
}

/**
 * Updates the user's subscription data in Clerk metadata
 * This can be used to sync subscription data from Stripe webhooks
 */
export async function updateSubscriptionMetadata(
  userId: string,
  subscriptionData: Partial<SubscriptionData>
) {
  try {
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        subscription: subscriptionData
      }
    });
    
    console.log('Subscription metadata updated for user:', userId);
  } catch (error) {
    console.error('Error updating subscription metadata:', error);
    throw error;
  }
}

/**
 * Helper function to check if a user has an active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const subscription = await getCurrentSubscription();
  return subscription?.status === 'active' && subscription.plan !== null;
}

/**
 * Gets the user's subscription tier/plan name
 */
export async function getSubscriptionPlan(): Promise<string | null> {
  const subscription = await getCurrentSubscription();
  return subscription?.plan || null;
}

/**
 * Checks if subscription is in grace period or past due
 */
export async function isSubscriptionValid(): Promise<boolean> {
  const subscription = await getCurrentSubscription();
  
  if (!subscription) return false;
  
  const validStatuses = ['active', 'trialing'];
  const currentTime = Math.floor(Date.now() / 1000);
  
  return (
    validStatuses.includes(subscription.status) &&
    subscription.current_period_end > currentTime
  );
}