import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Submit to Clerk's waitlist API
    const clerkResponse = await fetch('https://api.clerk.com/v1/waitlist_entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({ 
        email_address: email,
        name: name 
      }),
    });

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json();
      console.error('Clerk waitlist error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to join waitlist' },
        { status: clerkResponse.status }
      );
    }

    const waitlistData = await clerkResponse.json();
    console.log('Successfully added to Clerk waitlist:', { email, name, waitlistId: waitlistData.id });

    return NextResponse.json({ 
      success: true, 
      waitlistId: waitlistData.id 
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}