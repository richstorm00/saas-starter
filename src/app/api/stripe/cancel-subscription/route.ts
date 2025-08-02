import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const { userId } = await auth();
    console.log('Cancel subscription - Auth check:', { userId, hasAuth: !!userId });
    
    if (!userId) {
      console.log('No userId found in auth');
      return NextResponse.json({ error: 'Unauthorized - User not authenticated' }, { status: 401 });
    }

    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // Get subscription data from Clerk metadata
    const subscriptionData = user.privateMetadata?.subscription || user.publicMetadata?.subscription;
    
    if (!subscriptionData?.subscriptionId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const subscriptionId = subscriptionData.subscriptionId;
    
    // Initialize Stripe
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    });

    try {
      // Try to cancel the subscription
      await stripe.subscriptions.cancel(subscriptionId);
    } catch (stripeError: any) {
      if (stripeError.code === 'resource_missing') {
        // Subscription already cancelled or doesn't exist - continue with metadata cleanup
        console.log('Subscription already cancelled or not found, proceeding with metadata cleanup');
      } else {
        // Re-throw other Stripe errors
        throw stripeError;
      }
    }

    // Preserve customer ID for future use
    const customerId = 
      user.privateMetadata?.subscription?.customerId || 
      user.publicMetadata?.subscription?.customerId ||
      user.privateMetadata?.stripeCustomerId ||
      user.publicMetadata?.stripeCustomerId;

    console.log('Clearing subscription metadata, preserving customerId:', customerId);

    // Use Clerk's API correctly - set subscription to null to remove it
    try {
      const updatePayload = {
        privateMetadata: {
          subscription: null,
          stripeSubscription: null,
          ...(customerId && { stripeCustomerId: customerId })
        },
        publicMetadata: {
          subscription: null,
          stripeSubscription: null,
          ...(customerId && { stripeCustomerId: customerId })
        }
      };

      console.log('Setting metadata payload:', updatePayload);

      await client.users.updateUserMetadata(userId, updatePayload);
      console.log('Subscription metadata successfully removed via null values');
    } catch (updateError) {
      console.error('Failed to update metadata:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user metadata', details: updateError.message },
        { status: 500 }
      );
    }

    // Verify the metadata was actually cleared
    const updatedUser = await client.users.getUser(userId);
    console.log('Metadata after cleanup:', {
      private: updatedUser.privateMetadata,
      public: updatedUser.publicMetadata
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription cancelled successfully and metadata removed',
      subscription: null,
      hasSubscription: false,
      metadataCleared: true
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' }, 
      { status: 500 }
    );
  }
}