// src/components/common/FloatingActionDock.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Scale, FileText } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { useQuoteCart } from '@/context/QuoteCartContext';
import { useCompare } from '@/context/CompareContext';
import { getWhatsAppGeneralUrl } from '@/lib/integrations/whatsapp';

export default function FloatingActionDock() {
  const { selectedBranch } = useTenant();
  const { totalItems, setIsDrawerOpen } = useQuoteCart();
  const { compareCount } = useCompare();

  return (
    <>
      {/* Floating Bottom Action Bar for Active Compare Tray */}
      {compareCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto max-w-lg rounded-full border border-[#0B1220] bg-[#0B1220]/95 px-5 py-2.5 shadow-2xl backdrop-blur-md flex items-center gap-4 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Scale className="h-4 w-4 text-[#22D3EE]" />
            <span>{compareCount} models in compare</span>
          </div>

          <Link
            href="/compare"
            className="rounded-full bg-[#22D3EE] px-4 py-1 text-xs font-bold text-[#0B1220] hover:bg-[#06B6D4] transition-all shadow-sm"
          >
            View Spec Matrix
          </Link>
        </div>
      )}

      {/* Floating Speed Dial on bottom right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Quote Trigger if cart has items */}
        {totalItems > 0 && (
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#0B1220] text-white border border-[#334155] px-4 py-2.5 text-xs font-bold shadow-xl hover:scale-105 transition-transform"
          >
            <FileText className="h-4 w-4 text-[#22D3EE]" />
            <span>Quote Cart ({totalItems})</span>
          </button>
        )}

        {/* WhatsApp Direct Specialist CTA */}
        <a
          href={getWhatsAppGeneralUrl(selectedBranch.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 rounded-full bg-[#22C55E] px-4 py-3 text-xs font-bold text-white shadow-xl shadow-green-600/20 hover:bg-[#16A34A] hover:scale-105 transition-all"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">WhatsApp Specialist ({selectedBranch.city})</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </div>
    </>
  );
}
