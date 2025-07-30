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

    // In a real application, you would:
    // 1. Save to your database
    // 2. Send confirmation email
    // 3. Add to email marketing service
    // 4. Send admin notification
    
    console.log('Waitlist signup:', { email, name, timestamp: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}