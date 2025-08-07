'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { 
  User, 
  CreditCard, 
  LifeBuoy, 
  LogOut,
  Menu,
  X,
  Home,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, label, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-gray-800/60 text-white border border-gray-700/50 shadow-sm'
          : 'text-gray-300 hover:bg-gray-800/30 hover:text-white hover:translate-x-1'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/' });
  };

  const navItems = [
    {
      href: '/dashboard',
      icon: <Home className="w-5 h-5" />,
      label: 'Dashboard',
    },
    {
      href: '/dashboard/account',
      icon: <User className="w-5 h-5" />,
      label: 'Account',
    },
    {
      href: '/dashboard/support',
      icon: <LifeBuoy className="w-5 h-5" />,
      label: 'Support',
    },
  ];

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#111111] backdrop-blur-xl border-r border-gray-800/50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white">Quantum AI</span>
            </div>
            <button
              className="lg:hidden text-gray-400 hover:text-blue-400 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.slice(0, 1).map((item) => (
              <NavItem
                key={item.href}
                {...item}
                isActive={pathname === item.href}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-800/50">
            <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-medium">{userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>

            {/* Account and Support links */}
            <nav className="space-y-1 mb-4">
              {navItems.slice(1).map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  isActive={pathname === item.href}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </nav>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-[#111111]/95 backdrop-blur-sm border-b border-gray-800/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-medium">{userInitials}</span>
            </div>
          </div>
        </div>

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}