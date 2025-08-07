'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Zap, 
  Shield, 
  CreditCard, 
  Users, 
  Settings,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { PricingTable } from './pricing-table';
import Link from 'next/link';

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Built with Next.js 15 and optimized for performance with edge runtime."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Complete authentication with Clerk, including MFA and social logins."
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Stripe Integration",
      description: "Subscription management, usage billing, and webhook handling ready."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Management",
      description: "Multi-tenant architecture with organization support and role management."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Type-Safe Database",
      description: "Drizzle ORM with Neon PostgreSQL for scalable data management."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Production Ready",
      description: "Docker support, monitoring, and deployment configurations included."
    }
  ];

  // Pricing plans are now fetched dynamically via PricingTable component

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                SaaS Starter
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                About
              </a>
              
              <SignedOut>
                <div className="flex items-center space-x-4">
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              </SignedOut>
              
              <SignedIn>
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 dark:text-gray-300"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <a href="#features" className="block px-3 py-2 text-gray-700 dark:text-gray-300">Features</a>
                <a href="#pricing" className="block px-3 py-2 text-gray-700 dark:text-gray-300">Pricing</a>
                <a href="#about" className="block px-3 py-2 text-gray-700 dark:text-gray-300">About</a>
                
                <SignedOut>
                  <div className="px-3 py-2 space-y-2">
                    <Link href="/sign-in" className="block">
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/sign-up" className="block">
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </SignedOut>
                
                <SignedIn>
                  <div className="px-3 py-2 space-y-2">
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" className="w-full">Dashboard</Button>
                    </Link>
                    <div className="flex justify-center py-2">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                </SignedIn>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Build Your SaaS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">10x Faster</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Complete SaaS starter kit with authentication, billing, database, and deployment.
                Everything you need to launch your next big idea.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <SignedOut>
                  <Link href="/sign-up">
                    <Button size="lg" className="group">
                      Start Building Now
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </SignedOut>
                
                <SignedIn>
                  <Link href="/dashboard">
                    <Button size="lg" className="group">
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </SignedIn>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hours Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">100%+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Type Safe</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with modern technologies and best practices. Focus on your product, not the boilerplate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that works for you. All plans include our complete starter kit.
            </p>
          </div>

          <PricingTable />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build Your SaaS?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of developers who have launched successful SaaS products with our starter kit.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <Link href="/sign-up">
                  <Button size="lg" variant="secondary" className="group">
                    Start Building Today
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </SignedOut>
              
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="group">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </SignedIn>
              
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  View Features
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">SaaS Starter</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Everything you need to launch your SaaS product in days, not months.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Privacy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Terms</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 SaaS Starter. Built with ❤️ for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}