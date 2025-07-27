'use client';

import { PricingTable as ClerkPricingTable } from '@clerk/nextjs';

export function PricingTable() {
  return (
    <div className="w-full">
      <ClerkPricingTable />
    </div>
  );
}