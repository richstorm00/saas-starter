import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthNav, AuthFooter } from '@/components/auth-nav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-4">
          <AuthNav />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            SaaS Starter Kit
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            A modern, scalable SaaS starter kit built with Next.js 15, TypeScript, 
            Clerk, Drizzle ORM, and Stripe.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>🔐 Authentication</CardTitle>
              <CardDescription>Secure user auth with Clerk</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Complete authentication system with social login, magic links, and multi-factor authentication.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💳 Billing</CardTitle>
              <CardDescription>Stripe integration ready</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Subscription management, usage-based billing, and webhook handling with Stripe.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🗄️ Database</CardTitle>
              <CardDescription>Drizzle ORM + PostgreSQL</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Type-safe database queries with Drizzle ORM and Neon PostgreSQL.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AuthFooter />
    </div>
  );
}
