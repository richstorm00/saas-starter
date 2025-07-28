'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { StripePricingTable } from './stripe-pricing-table';
import { Zap, Shield, Layers, BarChart2, Rocket, Check, Menu, X } from 'lucide-react';

const ShaderBackground = dynamic(() => import('./shader-background').then(mod => mod.ShaderBackground), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
});

export function NewLandingPage() {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Performance",
      description: "Inference times measured in microseconds using optimized quantum kernels."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise-Grade Security",
      description: "End-to-end encryption, SOC 2 compliance and on-prem deployment options."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Modular Design",
      description: "Compose, swap and chain models on-the-fly thanks to our plug-and-play API."
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Actionable Analytics",
      description: "Real-time dashboards turn raw predictions into business intelligence."
    }
  ];

  const testimonials = [
    {
      name: "Amelia Carter",
      role: "CTO, NovaTech",
      image: "https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80",
      quote: "Quantum AI outperformed every benchmark we threw at it. Integration took a single afternoon."
    },
    {
      name: "Diego Mendez",
      role: "Head of ML, Apex",
      image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=128&q=80",
      quote: "Our data science team reduced inference costs by 70% while increasing accuracy. Absolutely game-changing."
    },
    {
      name: "Sofia Zhang",
      role: "Founder, HelixAI",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=128&q=80",
      quote: "From prototype to production in days, not months. The support team feels like an extension of our own."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Shader Background */}
      <ShaderBackground />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className={`px-6 py-8 transition-all duration-300 ${scrolled ? 'bg-black/50 backdrop-blur-sm' : ''}`}>
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium tracking-tight">Quantum&nbsp;AI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              
              <SignedOut>
                <Link href="/sign-in">
                  <button className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all">
                    Sign In
                  </button>
                </Link>
              </SignedOut>
              
              <SignedIn>
                <Link href="/dashboard">
                  <button className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all">
                    Dashboard
                  </button>
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </SignedIn>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4">
              <div className="px-4 py-3 space-y-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg">
                <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white">Features</a>
                <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-white">Pricing</a>
                <a href="#testimonials" className="block px-3 py-2 text-gray-300 hover:text-white">Testimonials</a>
                
                <SignedOut>
                  <div className="pt-2 space-y-2">
                    <Link href="/sign-in">
                      <button className="w-full px-3 py-2 text-gray-300 hover:text-white">Sign In</button>
                    </Link>
                    <Link href="/sign-up">
                      <button className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">Get Started</button>
                    </Link>
                  </div>
                </SignedOut>
                
                <SignedIn>
                  <div className="pt-2">
                    <Link href="/dashboard">
                      <button className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">Dashboard</button>
                    </Link>
                  </div>
                </SignedIn>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 px-6">
          {/* Hero Section */}
          <section id="hero" className="max-w-7xl mx-auto text-center pt-14 md:pt-24 pb-32">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unlock Quantum-Grade Intelligence
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12">
              Build, deploy and scale advanced AI solutions without infrastructure headaches.
            </p>
            
            <div className="inline-flex gap-4">
              <SignedOut>
                <Link href="/sign-up">
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all">
                    Get Started Free
                  </button>
                </Link>
              </SignedOut>
              
              <SignedIn>
                <Link href="/dashboard">
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all">
                    Go to Dashboard
                  </button>
                </Link>
              </SignedIn>
              
              <a href="#features" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all">
                Explore Features
              </a>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="max-w-7xl mx-auto pb-28">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-16">
              Powering your workflow from <span className="text-blue-400">data</span> to <span className="text-purple-400">insight</span>
            </h2>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300"
                  style={{ animationDelay: `${0.15 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 mb-5 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-400/30">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium tracking-tight mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="max-w-7xl mx-auto pb-32">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-16">
              Loved by innovators worldwide
            </h2>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300"
                  style={{ animationDelay: `${0.15 + index * 0.1}s` }}
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <p className="font-medium tracking-tight">{testimonial.name}</p>
                      <p className="text-xs text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="pb-24">
              <StripePricingTable />
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12 text-sm">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-medium tracking-tight">Quantum&nbsp;AI</span>
              </div>
              <p className="text-gray-400">
                © {new Date().getFullYear()} Quantum AI Inc.<br />All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="font-medium tracking-tight mb-3">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Docs</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium tracking-tight mb-3">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium tracking-tight mb-3">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}