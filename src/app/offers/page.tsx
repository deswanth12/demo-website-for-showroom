// src/app/offers/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, FileText } from 'lucide-react';
import { cmsService } from '@/lib/store';
import { useTenant } from '@/context/TenantContext';
import { getWhatsAppGeneralUrl } from '@/lib/integrations/whatsapp';

export default function OffersPage() {
  const offers = cmsService.getOffers();
  const { selectedBranch } = useTenant();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 space-y-8 bg-[#F4F5F7]">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-6">
        <div className="text-xs font-mono-data uppercase tracking-wider text-[#0E7490] font-bold">
          Commercial Deals & Campaigns
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#080B10] mt-1 tracking-tight">
          Seasonal Offers & Bulk Discount Schemes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Special showroom pricing on high-volume commercial cooling equipment orders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((off) => (
          <div
            key={off.id}
            className="rounded-2xl border border-[#202832] bg-[#080B10] p-6 sm:p-8 flex flex-col justify-between gap-6 text-white shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#27C7D9]/20 border border-[#27C7D9]/40 px-3 py-1 text-xs font-mono-data font-bold text-[#27C7D9]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{off.discountLabel}</span>
                </span>
                <span className="text-[11px] font-mono-data text-slate-400">Valid until {off.expiryDate}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mt-3">{off.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{off.description}</p>

              <div className="mt-4 rounded-lg bg-[#11161D] border border-[#202832] p-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">Commercial Promo Code:</span>
                <span className="font-mono-data font-bold text-[#27C7D9] tracking-wider text-xs">
                  {off.code}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/quote"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#27C7D9] py-2.5 text-xs uppercase tracking-wider font-bold text-[#080B10] hover:bg-[#8DD8E8] transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Apply in Quote Cart</span>
              </Link>

              <a
                href={getWhatsAppGeneralUrl(
                  selectedBranch.whatsapp,
                  `Hi, I want to avail the ${off.title} offer (Code: ${off.code}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-[#202832] bg-[#11161D] px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-white hover:bg-[#202832] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Claim</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
