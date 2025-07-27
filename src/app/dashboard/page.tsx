import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to your SaaS dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  Manage Subscription
                </Button>
                <Button className="w-full" variant="outline">
                  Invite Team Members
                </Button>
                <Button className="w-full" variant="outline">
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Next steps to customize your app</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Update branding in src/app</li>
                <li>• Configure your pricing plans</li>
                <li>• Set up webhook endpoints</li>
                <li>• Customize email templates</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Helpful links and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• <a href="#" className="text-blue-600 hover:underline">Documentation</a></li>
                <li>• <a href="#" className="text-blue-600 hover:underline">API Reference</a></li>
                <li>• <a href="#" className="text-blue-600 hover:underline">Support</a></li>
                <li>• <a href="#" className="text-blue-600 hover:underline">Community</a></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}