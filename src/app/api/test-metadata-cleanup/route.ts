import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    
    // Get current user
    const user = await client.users.getUser(userId);
    console.log('Before cleanup:', {
      private: user.privateMetadata,
      public: user.publicMetadata
    });

    // Get customer ID before clearing
    const customerId = 
      user.privateMetadata?.subscription?.customerId || 
      user.publicMetadata?.subscription?.customerId ||
      user.privateMetadata?.stripeCustomerId ||
      user.publicMetadata?.stripeCustomerId;

    // Create new metadata objects
    const newPrivateMetadata = customerId ? { stripeCustomerId: customerId } : {};
    const newPublicMetadata = customerId ? { stripeCustomerId: customerId } : {};

    console.log('Setting metadata to:', {
      private: newPrivateMetadata,
      public: newPublicMetadata
    });

    // Update metadata
    await client.users.updateUserMetadata(userId, {
      privateMetadata: newPrivateMetadata,
      publicMetadata: newPublicMetadata
    });

    // Verify update
    const updatedUser = await client.users.getUser(userId);
    console.log('After cleanup:', {
      private: updatedUser.privateMetadata,
      public: updatedUser.publicMetadata
    });

    return NextResponse.json({
      success: true,
      message: 'Metadata cleaned successfully',
      before: {
        private: user.privateMetadata,
        public: user.publicMetadata
      },
      after: {
        private: updatedUser.privateMetadata,
        public: updatedUser.publicMetadata
      }
    });

  } catch (error) {
    console.error('Test cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to test cleanup', details: error.message },
      { status: 500 }
    );
  }
}