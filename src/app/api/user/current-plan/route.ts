import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real implementation with Clerk Billing:
    // 1. Fetch the user's current subscription from Clerk
    // 2. Return the plan ID and subscription details
    
    // Mock implementation for now
    const mockSubscription = {
      planId: null, // or 'starter', 'professional', 'enterprise'
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false
    };

    return NextResponse.json(mockSubscription);
  } catch (error) {
    console.error('Error fetching current plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current plan' },
      { status: 500 }
    );
  }
}