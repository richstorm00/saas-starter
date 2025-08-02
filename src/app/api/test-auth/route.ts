import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        authenticated: false, 
        error: 'User not authenticated' 
      }, { status: 401 });
    }

    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return NextResponse.json({
      authenticated: true,
      userId,
      email: user.emailAddresses[0]?.emailAddress,
      hasSubscription: !!(user.privateMetadata?.subscription || user.publicMetadata?.subscription)
    });

  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({ 
      authenticated: false, 
      error: error.message 
    }, { status: 500 });
  }
}