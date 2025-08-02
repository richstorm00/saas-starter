import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    console.log('Test subscription - User ID:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Query Clerk metadata for subscription details
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    console.log('Raw Clerk user data:', {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata
    });

    return NextResponse.json({
      userId,
      email: user.emailAddresses[0]?.emailAddress,
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata,
      subscriptionFound: !!(user.publicMetadata?.subscription || user.privateMetadata?.subscription),
      stripeCustomerFound: !!(user.publicMetadata?.stripeCustomerId || user.privateMetadata?.stripeCustomerId)
    });

  } catch (error) {
    console.error('Error testing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to test subscription', details: error.message },
      { status: 500 }
    );
  }
}