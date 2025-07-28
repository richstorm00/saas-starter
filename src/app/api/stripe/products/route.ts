import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET() {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
        });

        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          metadata: product.metadata,
          prices: prices.data.map((price) => ({
            id: price.id,
            unit_amount: price.unit_amount,
            currency: price.currency,
            type: price.type,
            recurring: price.recurring,
          })),
        };
      })
    );

    // Sort products by price: free plans first, then ascending by price
    const sortedProducts = productsWithPrices.sort((a, b) => {
      const priceA = a.prices.find(p => p.type === 'recurring')?.unit_amount || 0;
      const priceB = b.prices.find(p => p.type === 'recurring')?.unit_amount || 0;
      return priceA - priceB;
    });

    return NextResponse.json({ products: sortedProducts });
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}