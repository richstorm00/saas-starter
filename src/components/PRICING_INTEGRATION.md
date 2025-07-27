# Clerk Pricing Table Integration

This component integrates Clerk billing with a dynamic pricing table that fetches subscription plans and manages subscription flow.

## Features

- ✅ **Dynamic Pricing Plans**: Fetches plans from Clerk's billing system
- ✅ **Real-time Subscription Status**: Shows current plan for logged-in users
- ✅ **Monthly/Yearly Toggle**: Users can switch billing intervals with 20% yearly discount
- ✅ **Clerk Authentication**: Integrates with Clerk's user management
- ✅ **Responsive Design**: Mobile-friendly pricing cards
- ✅ **TDD Tests**: Comprehensive test coverage
- ✅ **API Routes**: Backend endpoints for plan management

## Usage

### Basic Usage in Landing Page

```tsx
import { PricingTable } from '@/components/pricing-table';

export function LandingPage() {
  return (
    <section id="pricing">
      <PricingTable />
    </section>
  );
}
```

### With Custom Plan Selection Handler

```tsx
import { PricingTable } from '@/components/pricing-table';

export function PricingPage() {
  const handlePlanSelect = (plan) => {
    console.log('Selected plan:', plan);
    // Custom logic for plan selection
  };

  return (
    <PricingTable 
      onPlanSelect={handlePlanSelect}
      showCurrentPlan={true}
    />
  );
}
```

## API Endpoints

### GET /api/pricing/plans
Returns all available pricing plans with features and limits.

**Response:**
```json
{
  "plans": [
    {
      "id": "starter",
      "name": "Starter",
      "price": 9,
      "currency": "USD",
      "interval": "month",
      "description": "Perfect for side projects and MVPs",
      "features": ["Up to 1,000 users", "Basic analytics", ...],
      "limits": { "users": 1000, "storage": "1GB", ... }
    }
  ]
}
```

### POST /api/create-checkout-session
Creates a checkout session for subscription.

**Request:**
```json
{
  "planId": "professional",
  "interval": "year",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### GET /api/user/current-plan
Returns the current subscription for the authenticated user.

**Response:**
```json
{
  "planId": "professional",
  "status": "active",
  "currentPeriodEnd": "2024-12-31T23:59:59Z"
}
```

## Configuration

### Environment Variables
Add these to your `.env.local`:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Clerk Billing Setup

1. **Enable Clerk Billing** in your Clerk dashboard
2. **Create Pricing Plans** with the following structure:
   - Starter: $9/month
   - Professional: $29/month (popular)
   - Enterprise: $99/month
3. **Configure Webhooks** to handle subscription events
4. **Set Up Stripe Integration** (if using Stripe)

## Component Structure

```
src/
├── components/
│   ├── pricing-table.tsx           # Main pricing table component
│   └── PRICING_INTEGRATION.md      # This documentation
├── app/
│   ├── api/
│   │   ├── pricing/
│   │   │   └── plans/route.ts     # Pricing plans endpoint
│   │   ├── create-checkout-session/route.ts  # Checkout creation
│   │   └── user/
│   │       └── current-plan/route.ts         # Current subscription
└── __tests__/
    ├── components/
    │   └── pricing-table.test.tsx  # Component tests
    └── api/
        └── pricing/
            └── plans.test.ts       # API tests
```

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run pricing component tests
npm test pricing-table

# Run API tests
npm test api/pricing/plans
```

## Customization

### Styling
The component uses Tailwind CSS and matches the existing design system. Customize by:

1. **Colors**: Update the color classes in the component
2. **Layout**: Adjust the grid layout and card styling
3. **Animations**: Modify the Framer Motion animations

### Plan Data
Update the mock plans in the API routes to match your actual Clerk billing plans.

### Features
Add or remove features from the plan configuration in the API routes.

## Integration Steps

1. **Install Dependencies** (already included):
   ```bash
   npm install @clerk/nextjs framer-motion lucide-react
   ```

2. **Add API Routes** (already created):
   - `/api/pricing/plans`
   - `/api/create-checkout-session`
   - `/api/user/current-plan`

3. **Update Landing Page** (already done):
   - Replace static pricing with `PricingTable` component

4. **Configure Clerk Billing** in your Clerk dashboard

5. **Test Integration**:
   ```bash
   npm run dev
   # Visit http://localhost:3000 to see the pricing table
   ```

## Error Handling

The component handles various error scenarios:

- **API Failures**: Gracefully handles network errors
- **Authentication**: Redirects to sign-up for non-authenticated users
- **Invalid Plans**: Validates plan IDs before processing
- **Loading States**: Shows appropriate loading indicators

## Next Steps

1. **Replace Mock Data**: Update API routes to use actual Clerk billing
2. **Configure Webhooks**: Set up Clerk webhooks for subscription events
3. **Add Payment Processing**: Integrate with Stripe or other payment providers
4. **Enhance Analytics**: Add conversion tracking and analytics
5. **A/B Testing**: Implement pricing experiments

## Support

For questions about Clerk billing integration, refer to:
- [Clerk Billing Documentation](https://clerk.com/docs/billing)
- [Stripe Integration Guide](https://stripe.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)