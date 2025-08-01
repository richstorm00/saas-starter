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

    // Production: Fetch actual subscription from Clerk metadata
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    const subscription = user.privateMetadata?.subscription;
    
    if (!subscription) {
      return NextResponse.json({
        planId: null,
        status: 'inactive',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        hasSubscription: false
      });
    }

    return NextResponse.json({
      planId: subscription.plan?.toLowerCase(),
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.currentPeriodEnd * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.status === 'canceled',
      hasSubscription: true,
      subscriptionId: subscription.subscriptionId,
      customerId: subscription.customerId
    });
  } catch (error) {
    console.error('Error fetching current plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current plan' },
      { status: 500 }
    );
  }
}