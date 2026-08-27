// src/app/compare/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Trash2,
  FileText,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { useQuoteCart } from '@/context/QuoteCartContext';
import { useTenant } from '@/context/TenantContext';
import { getWhatsAppProductInquiryUrl } from '@/lib/integrations/whatsapp';

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addItem } = useQuoteCart();
  const { selectedBranch } = useTenant();

  const [highlightDiff, setHighlightDiff] = useState(false);

  const handleAddAllToQuote = () => {
    compareItems.forEach(({ product, variant }) => {
      addItem(product, variant, 1);
    });
  };

  if (compareItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center flex flex-col items-center bg-[#F8FAFC]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E0F2FE] text-[#0284C7] mb-4">
          <Scale className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">No Equipment in Comparison Tray</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
          Select up to 4 commercial refrigeration units or freezers across our catalogue to compare capacity, power draw, temperature ranges, and pricing side-by-side.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-lg bg-[#22D3EE] px-6 py-3 text-xs font-bold text-[#0B1220] hover:bg-[#06B6D4] transition-all flex items-center gap-2 shadow-sm"
        >
          <span>Browse Equipment Catalogue</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // Common spec keys to compare
  const specKeys = [
    'Refrigerant Gas',
    'Defrost Type',
    'Door Type',
    'Temperature Controller',
    'Electrical Supply',
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 bg-[#F8FAFC]">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono-data uppercase tracking-wider text-[#0E7490] font-bold">
            Engineering Comparison Matrix
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-1">
            Side-by-Side Equipment Compare
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comparing <strong className="text-[#0F172A]">{compareItems.length}</strong> selected commercial unit(s)
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Highlight Differences Toggle */}
          <button
            onClick={() => setHighlightDiff(!highlightDiff)}
            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
              highlightDiff
                ? 'border-[#22D3EE] bg-[#E0F2FE] text-[#0284C7]'
                : 'border-[#CBD5E1] bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            {highlightDiff ? '✓ Highlighting Differences' : 'Highlight Differences'}
          </button>

          {/* Add All to Quote Cart */}
          <button
            onClick={handleAddAllToQuote}
            className="flex items-center gap-1.5 rounded-lg bg-[#22D3EE] px-4 py-2 text-xs font-bold text-[#0B1220] hover:bg-[#06B6D4] transition-all shadow-sm"
          >
            <FileText className="h-4 w-4" />
            <span>Add All to Quote</span>
          </button>

          {/* Clear Button */}
          <button
            onClick={clearCompare}
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden text-[11px] text-[#0E7490] font-mono-data mb-2 font-semibold flex items-center gap-1">
        <span>← Swipe horizontally to compare specifications →</span>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-600 w-1/5 min-w-[180px]">
                Specification Parameter
              </th>
              {compareItems.map(({ product, variant }) => (
                <th key={variant.id} className="p-5 w-1/4 min-w-[240px] align-top bg-white border-l border-[#E2E8F0]">
                  <div className="flex flex-col gap-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-[#E2E8F0] bg-slate-100">
                      <img
                        src={product.media[0]?.url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=600&auto=format&fit=crop'}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => removeFromCompare(variant.id)}
                        className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-red-600 transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="rounded bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-mono-data font-bold text-[#0284C7]">
                        {variant.sku}
                      </span>
                      <h4 className="text-xs font-bold text-[#0F172A] mt-1.5 leading-snug">
                        <Link href={`/products/${product.slug}`} className="hover:text-[#0284C7]">
                          {product.name}
                        </Link>
                      </h4>
                      <p className="text-[11px] text-slate-500">{variant.name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addItem(product, variant, 1)}
                        className="flex-1 rounded-lg bg-[#22D3EE] py-2 text-center text-[11px] font-bold text-[#0B1220] hover:bg-[#06B6D4]"
                      >
                        Add to Quote
                      </button>
                      <a
                        href={getWhatsAppProductInquiryUrl(selectedBranch.whatsapp, product, variant, selectedBranch)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-[#22C55E]/40 bg-[#F0FDF4] p-2 text-[#15803D] hover:bg-[#22C55E] hover:text-white"
                        title="Inquire via WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-[#0F172A]">
            {/* Price Row */}
            <tr className="bg-[#F8FAFC]">
              <td className="p-4 font-bold text-slate-700">Estimated Unit Rate</td>
              {compareItems.map(({ variant }) => (
                <td key={variant.id} className="p-4 font-mono-data font-extrabold text-base text-[#0F172A] border-l border-[#E2E8F0]">
                  ₹{(variant.offerPrice || variant.basePrice).toLocaleString('en-IN')}
                </td>
              ))}
            </tr>

            {/* Capacity Row */}
            <tr className={highlightDiff ? 'bg-amber-50/60' : ''}>
              <td className="p-4 font-bold text-slate-700">Capacity / Volume</td>
              {compareItems.map(({ variant }) => (
                <td key={variant.id} className="p-4 font-mono-data font-bold text-slate-800 border-l border-[#E2E8F0]">
                  {variant.capacity}
                </td>
              ))}
            </tr>

            {/* Operating Temp Range */}
            <tr className={highlightDiff ? 'bg-amber-50/60' : ''}>
              <td className="p-4 font-bold text-slate-700">Operating Temperature</td>
              {compareItems.map(({ variant }) => (
                <td key={variant.id} className="p-4 border-l border-[#E2E8F0]">
                  <span className="badge-cyan-temp inline-block rounded px-2 py-0.5 font-mono-data font-bold">
                    {variant.temperatureRange}
                  </span>
                </td>
              ))}
            </tr>

            {/* Dimensions */}
            <tr className={highlightDiff ? 'bg-amber-50/60' : ''}>
              <td className="p-4 font-bold text-slate-700">Physical Dimensions</td>
              {compareItems.map(({ variant }) => (
                <td key={variant.id} className="p-4 font-mono-data text-slate-600 border-l border-[#E2E8F0]">
                  {variant.dimensions}
                </td>
              ))}
            </tr>

            {/* Power Draw */}
            <tr className={highlightDiff ? 'bg-amber-50/60' : ''}>
              <td className="p-4 font-bold text-slate-700">Daily Power Draw</td>
              {compareItems.map(({ variant }) => (
                <td key={variant.id} className="p-4 font-mono-data text-slate-600 border-l border-[#E2E8F0]">
                  {variant.powerConsumption}
                </td>
              ))}
            </tr>

            {/* Stock Status */}
            <tr>
              <td className="p-4 font-bold text-slate-700">Stock Availability</td>
              {compareItems.map(({ variant }) => (
                <td key={variant.id} className="p-4 font-mono-data font-bold text-emerald-600 border-l border-[#E2E8F0]">
                  {variant.stockStatus.replace(/_/g, ' ').toUpperCase()}
                </td>
              ))}
            </tr>

            {/* Dynamic Specs */}
            {specKeys.map((key) => (
              <tr key={key} className={highlightDiff ? 'bg-amber-50/60' : ''}>
                <td className="p-4 font-bold text-slate-700">{key}</td>
                {compareItems.map(({ product, variant }) => (
                  <td key={variant.id} className="p-4 text-slate-600 border-l border-[#E2E8F0]">
                    {product.specifications[key] || 'Standard Commercial'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
