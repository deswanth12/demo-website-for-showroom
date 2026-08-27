// src/components/common/QuoteCartDrawer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useQuoteCart } from '@/context/QuoteCartContext';
import { calculateCommercialPricing } from '@/services/pricingService';

export default function QuoteCartDrawer() {
  const { items, isDrawerOpen, setIsDrawerOpen, removeItem, updateQuantity, clearCart, totalItems } = useQuoteCart();

  if (!isDrawerOpen) return null;

  const pricing = calculateCommercialPricing(items);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-[#0B1220]/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col text-[#0F172A]">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E0F2FE] text-[#0284C7]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">B2B Quote Wishlist</h3>
                <p className="text-xs text-slate-500">{totalItems} commercial unit(s) selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:text-black hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white">
            {items.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <FileText className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-700">Your quote cart is empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Add commercial freezers, visi coolers, or cold rooms to generate an instant formal B2B proforma quotation.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-6 rounded-lg bg-[#22D3EE] px-4 py-2.5 text-xs font-bold text-[#0B1220] hover:bg-[#06B6D4] transition-colors"
                >
                  Explore Equipment Catalogue
                </button>
              </div>
            ) : (
              items.map(({ product, variant, quantity }) => (
                <div
                  key={variant.id}
                  className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col gap-3 shadow-sm"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded font-bold">
                        {variant.sku}
                      </span>
                      <h4 className="text-xs font-bold text-[#0F172A] mt-1.5 leading-snug">{product.name}</h4>
                      <p className="text-[11px] text-slate-500">Variant: {variant.name} ({variant.capacity})</p>
                    </div>
                    <button
                      onClick={() => removeItem(variant.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#CBD5E1] rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(variant.id, quantity - 1)}
                        className="px-2.5 py-1 text-slate-500 hover:text-black"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-mono-data font-bold text-[#0F172A]">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(variant.id, quantity + 1)}
                        className="px-2.5 py-1 text-slate-500 hover:text-black"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Price Estimate */}
                    <div className="text-right">
                      <p className="text-xs font-mono-data font-bold text-[#0F172A]">
                        ₹{((variant.offerPrice || variant.basePrice) * quantity).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        @ ₹{(variant.offerPrice || variant.basePrice).toLocaleString('en-IN')} / unit
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
              {pricing.totalDiscount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Tier Bulk Discount:</span>
                  </div>
                  <span className="font-mono-data font-bold">- ₹{pricing.totalDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline text-xs text-slate-600">
                <span>Estimated Subtotal (excl. tax):</span>
                <span className="text-sm font-mono-data font-bold text-[#0F172A]">
                  ₹{(pricing.subtotal - pricing.totalDiscount).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/quote"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#22D3EE] py-3.5 text-xs font-bold text-[#0B1220] hover:bg-[#06B6D4] transition-all shadow-md"
                >
                  <span>Complete B2B Quote Request</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full py-1.5 text-center text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Clear All Selected Items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
