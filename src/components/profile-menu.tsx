'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth, useUser, useClerk } from '@clerk/nextjs';
import { ChevronDown, User, CreditCard, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ProfileMenuProps {
  className?: string;
}

export function ProfileMenu({ className = '' }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/' });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleMenuItemKeyDown = (event: React.KeyboardEvent, index: number, totalItems: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = index + 1 >= totalItems ? 0 : index + 1;
        const nextElement = document.querySelector(`[data-menu-item="${nextIndex}"]`) as HTMLElement;
        nextElement?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = index - 1 < 0 ? totalItems - 1 : index - 1;
        const prevElement = document.querySelector(`[data-menu-item="${prevIndex}"]`) as HTMLElement;
        prevElement?.focus();
        break;
      case 'Home':
        event.preventDefault();
        const firstElement = document.querySelector('[data-menu-item="0"]') as HTMLElement;
        firstElement?.focus();
        break;
      case 'End':
        event.preventDefault();
        const lastElement = document.querySelector(`[data-menu-item="${totalItems - 1}"]`) as HTMLElement;
        lastElement?.focus();
        break;
    }
  };

  if (!user) return null;

  const userInitials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'U';

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
          <span className="text-white text-sm font-medium">{userInitials}</span>
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
          {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-medium">{userInitials}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          </div>

          <nav className="p-2" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              data-menu-item="0"
              onKeyDown={(e) => handleMenuItemKeyDown(e, 0, 4)}
              tabIndex={0}
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/subscription"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              data-menu-item="1"
              onKeyDown={(e) => handleMenuItemKeyDown(e, 1, 4)}
              tabIndex={0}
            >
              <CreditCard className="w-4 h-4" />
              <span>Manage Subscription</span>
            </Link>

            <Link
              href="/dashboard/account"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              data-menu-item="2"
              onKeyDown={(e) => handleMenuItemKeyDown(e, 2, 4)}
              tabIndex={0}
            >
              <Settings className="w-4 h-4" />
              <span>Manage Account</span>
            </Link>

            <hr className="my-2 border-gray-200 dark:border-gray-700" role="separator" />

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              role="menuitem"
              data-menu-item="3"
              onKeyDown={(e) => handleMenuItemKeyDown(e, 3, 4)}
              tabIndex={0}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}