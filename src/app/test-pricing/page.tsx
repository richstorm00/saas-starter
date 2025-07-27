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
            Styled PricingTable component
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Subscription Plans
          </h2>
          
          {/* This will display your configured Clerk billing plans with custom styling */}
          <ClerkPricingTable 
            appearance={{
              elements: {
                root: 'max-w-6xl mx-auto',
                planCard: 'border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 relative overflow-hidden',
                planCardPopular: 'border-2 border-blue-500 shadow-2xl scale-[1.02] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900/30 dark:via-gray-800 dark:to-blue-900/30 ring-2 ring-blue-500/20',
                planName: 'text-2xl font-bold text-gray-900 dark:text-white mb-2',
                price: 'text-4xl font-bold text-gray-900 dark:text-white',
                priceAmount: 'text-5xl font-extrabold',
                priceInterval: 'text-lg text-gray-600 dark:text-gray-400 ml-2',
                description: 'text-gray-600 dark:text-gray-400 text-base mb-6',
                featuresList: 'space-y-4 mb-8',
                featureItem: 'flex items-start space-x-3',
                featureIcon: 'w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0',
                featureText: 'text-gray-700 dark:text-gray-300 text-base',
                ctaButton: 'w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
                ctaButtonCurrent: 'w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-4 px-6 rounded-lg border-2 border-gray-300 dark:border-gray-600',
                popularBadge: 'absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg z-10',
                gridContainer: 'grid md:grid-cols-3 gap-8 items-stretch',
                cardContent: 'p-8',
                cardHeader: 'text-center pb-6 border-b-2 border-gray-100 dark:border-gray-700',
              },
              variables: {
                colorPrimary: '#3b82f6',
                colorBackground: '#ffffff',
                colorText: '#111827',
                borderRadius: '0.5rem',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              },
              layout: {
                ctaPosition: 'bottom',
                collapseFeatures: false,
              }
            }}
          />
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