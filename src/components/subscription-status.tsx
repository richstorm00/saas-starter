'use client';

import { useUser } from '@clerk/nextjs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function SubscriptionStatus() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 animate-pulse" role="status" aria-label="Loading subscription status">
        <CardContent className="p-6">
          <div className="h-4 bg-slate-700 rounded w-32 mb-2" aria-hidden="true"></div>
          <div className="h-3 bg-slate-700 rounded w-24" aria-hidden="true"></div>
          <span className="sr-only">Loading subscription information...</span>
        </CardContent>
      </Card>
    );
  }

  interface SubscriptionData {
    plan: string;
    status: string;
    active: boolean;
  }

  const subscription = (user?.publicMetadata?.subscription || user?.unsafeMetadata?.subscription) as SubscriptionData | undefined;

  if (!subscription) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">No Subscription</p>
              <p className="text-xs text-slate-400">Upgrade to unlock premium features</p>
            </div>
            <Link href="/pricing"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View Plans <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      canceled: 'bg-red-500/20 text-red-400 border-red-500/30',
      past_due: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return statusColors[status] || statusColors.inactive;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-white">{subscription?.plan} Plan</p>
              <Badge className={getStatusColor(subscription?.status || 'inactive')} aria-label={`Subscription status: ${subscription?.status || 'inactive'}`}>
                {subscription?.status || 'inactive'}
              </Badge>
            </div>
          </div>
          <Link href="/dashboard/subscription"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Manage <Calendar className="w-3 h-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}