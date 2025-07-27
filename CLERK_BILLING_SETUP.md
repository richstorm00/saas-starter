# Clerk Billing Integration Setup Guide

This guide explains how to integrate pricing plans from Clerk's billing system into your SaaS starter app.

## Overview

The pricing plans on your landing page are designed to pull directly from your Clerk account's billing configuration. This ensures that your pricing stays in sync with your actual subscription plans managed through Clerk.

## Steps to Set Up Clerk Pricing Plans

### 1. Configure Clerk Billing

1. **Go to Clerk Dashboard**
   - Visit https://dashboard.clerk.com
   - Select your application

2. **Enable Billing**
   - Navigate to **Billing** in the left sidebar
   - Click **Get Started** or **Configure Billing**

3. **Connect Stripe**
   - Click **Connect Stripe Account**
   - Follow the prompts to connect your Stripe account
   - This enables payment processing for your pricing plans

### 2. Create Pricing Plans

1. **Create Products**
   - Go to **Billing > Products and Pricing**
   - Click **Create Product**
   - Add product details:
     - **Name**: e.g., "Starter", "Professional", "Enterprise"
     - **Description**: Brief description of the plan

2. **Add Pricing**
   - For each product, add pricing:
     - **Monthly Price**: Set the monthly subscription amount
     - **Yearly Price**: Optionally set yearly pricing with discount
     - **Currency**: Choose your pricing currency (USD, EUR, etc.)

3. **Configure Metadata**
   - In the product metadata, add:
     ```json
     {
       "features": "Feature 1\nFeature 2\nFeature 3",
       "popular": "true", // for highlighting a plan
       "limits": "{\"users\": 1000, \"storage\": \"1GB\", \"apiCalls\": \"10K/month\"}"
     }
     ```

### 3. Features and Limits Configuration

When setting up your plans, use the following metadata structure:

**For the Starter Plan:**
- Name: "Starter"
- Price: $9/month
- Metadata:
  ```json
  {
    "features": "Up to 1,000 monthly active users\nBasic authentication\nCommunity support\n1GB storage\n10K API calls/month\nEmail notifications",
    "limits": "{\"users\": 1000, \"storage\": \"1GB\", \"apiCalls\": \"10K/month\"}"
  }
  ```

**For the Professional Plan:**
- Name: "Professional"
- Price: $29/month
- Metadata:
  ```json
  {
    "features": "Up to 10,000 monthly active users\nAdvanced authentication (MFA, SSO)\nPriority support\n10GB storage\n100K API calls/month\nCustom domains\nAdvanced analytics\nTeam management",
    "popular": "true",
    "limits": "{\"users\": 10000, \"storage\": \"10GB\", \"apiCalls\": \"100K/month\"}"
  }
  ```

**For the Enterprise Plan:**
- Name: "Enterprise"
- Price: $99/month
- Metadata:
  ```json
  {
    "features": "Unlimited monthly active users\nEnterprise authentication\nDedicated support\n100GB storage\n1M API calls/month\nCustom integrations\nSLA guarantee\nOn-premise option\nAdvanced security",
    "limits": "{\"storage\": \"100GB\", \"apiCalls\": \"1M/month\"}"
  }
  ```

### 4. Verify Integration

Once you've configured your pricing plans in Clerk:

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Visit your landing page**
   - Navigate to http://localhost:3000 (or your deployed URL)
   - The pricing plans should now display your actual Clerk pricing

3. **Test the integration**
   - The pricing plans will automatically update when you make changes in Clerk
   - No code changes required after initial setup

## Technical Implementation

### How It Works

1. **Frontend**: The `pricing-table.tsx` component fetches plans from `/api/pricing/plans`
2. **API Route**: `/api/pricing/plans` checks for Clerk configuration and returns actual pricing data
3. **Display**: Plans are displayed with proper formatting, including yearly discounts
4. **Checkout**: When users select a plan, they're redirected to Clerk's checkout flow

### Environment Variables

Ensure these variables are set in your `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## Troubleshooting

### Common Issues

1. **No plans showing up**
   - Ensure you've created products in Clerk's billing section
   - Check that Stripe is properly connected
   - Verify your Clerk keys are correct in `.env.local`

2. **Plans not updating**
   - Changes in Clerk may take a few minutes to propagate
   - Clear your browser cache and refresh the page
   - Check the browser console for any error messages

3. **Checkout not working**
   - Ensure Stripe webhooks are properly configured
   - Verify your domain is added to Clerk's allowed domains
   - Check that users can properly authenticate before checkout

### Testing

To test the integration:

1. **Development**: Use Clerk's test mode keys
2. **Test Cards**: Use Stripe's test card numbers
3. **Webhooks**: Set up webhook endpoints for production

## Production Deployment

### Before Going Live

1. **Switch to Live Keys**
   - Replace test keys with live keys from Clerk dashboard
   - Replace Stripe test keys with live keys

2. **Configure Domains**
   - Add your production domain to Clerk's allowed domains
   - Configure Stripe webhooks for your production URL

3. **Test End-to-End**
   - Test the complete signup and subscription flow
   - Verify that webhooks are working correctly
   - Ensure pricing displays correctly on all devices

### Monitoring

- Monitor Clerk's billing dashboard for subscription metrics
- Set up Stripe webhooks for subscription events
- Track conversion rates from pricing page to subscription

## Support

If you encounter issues:

1. **Clerk Documentation**: https://clerk.com/docs
2. **Stripe Documentation**: https://stripe.com/docs
3. **Clerk Support**: Contact through the Clerk dashboard
4. **Community**: Check the project's GitHub issues for common solutions