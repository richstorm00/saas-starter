'use client';

import { PricingTable as ClerkPricingTable } from '@clerk/nextjs';

export default function TestPricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Test Clerk Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            This page uses Clerk's built-in PricingTable component
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Subscription Plans
          </h2>
          
          {/* This will display your configured Clerk billing plans */}
          <ClerkPricingTable />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            If you see "No plans available" or similar, check your Clerk dashboard:
            <br />
            1. Go to https://dashboard.clerk.com
            <br />
            2. Select your application
            <br />
            3. Navigate to Billing → Plans
            <br />
            4. Ensure you have plans configured (free_user, starter, professional)
          </p>
        </div>
      </div>
    </div>
  );
}