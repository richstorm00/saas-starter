'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Support</h1>
        <p className="text-gray-300">
          Get help and support for your account.
        </p>
      </div>

      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <LifeBuoy className="w-5 h-5" />
            <span>Support Center</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Our support team is here to help you with any questions or issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-12">
            <LifeBuoy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-white mb-2">
              Support Coming Soon
            </h3>
            <p className="text-gray-300">
              Our support system is currently being developed. Please check back soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}