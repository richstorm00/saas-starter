import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, User, CreditCard, BarChart3, Users, FileText } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch subscription data
  let subscriptionData = null;
  try {
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const subscription = user.privateMetadata?.subscription as any;
    if (subscription) {
      subscriptionData = {
        plan: subscription.planName || 'Basic',
        status: subscription.status || 'active',
        current_period_end: subscription.currentPeriodEnd || Date.now() / 1000 + 30 * 24 * 60 * 60,
        price_id: subscription.priceId || '',
      };
    }
  } catch (error) {
    console.error('Error fetching subscription data:', error);
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-300">
            Welcome to your SaaS dashboard
          </p>
        </div>

        {/* Subscription Status */}
        {subscriptionData && (
          <div className="mb-6">
            <Card className="bg-[#1a1a1a] border-gray-800/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">Your Subscription</CardTitle>
                    <CardDescription className="text-gray-400">Current plan and billing status</CardDescription>
                  </div>
                  <Badge
                    variant={subscriptionData.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize bg-blue-500/20 text-blue-400 border-blue-500/30"
                  >
                    {subscriptionData.plan} - {subscriptionData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300">
                    Next billing date: {new Date(subscriptionData.current_period_end * 1000).toLocaleDateString()}
                  </p>
                  <Link href="/dashboard/subscription">
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Management */}
          <Card className="lg:col-span-2 bg-[#1a1a1a] border-gray-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="w-5 h-5 mr-2" />
                Account Management
              </CardTitle>
              <CardDescription className="text-gray-400">Manage your account settings and subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/dashboard/account">
                  <Button className="w-full" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </Link>
                <Link href="/dashboard/subscription">
                  <Button className="w-full" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Subscription
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-[#1a1a1a] border-gray-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <BarChart3 className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-400">Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Team Members
                </Button>
                <Button className="w-full" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button className="w-full" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className="lg:col-span-2 bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Getting Started</CardTitle>
              <CardDescription className="text-gray-300">Next steps to customize your app</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">1.</span>
                  <span>Update branding in src/app</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">2.</span>
                  <span>Configure your pricing plans</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">3.</span>
                  <span>Set up webhook endpoints</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">4.</span>
                  <span>Customize email templates</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Resources</CardTitle>
              <CardDescription className="text-gray-300">Helpful links and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">API Reference</a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Support</a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Community</a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}