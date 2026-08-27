// src/components/products/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Plus, Check, FileText } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { brandService } from '@/lib/store';
import { useQuoteCart } from '@/context/QuoteCartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const brand = brandService.getAll().find((b) => b.id === product.brandId);
  const defaultVar = product.variants.find((v) => v.isDefault) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVar);
  const { addItem, setIsDrawerOpen } = useQuoteCart();
  const [added, setAdded] = useState(false);

  const primaryMedia = product.media.find((m) => m.isPrimary) || product.media[0];
  const imageUrl = primaryMedia?.url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800&auto=format&fit=crop';

  const handleAddQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setIsDrawerOpen(true);
    }, 400);
  };

  const lowestPrice = Math.min(
    ...product.variants.map((v) => v.offerPrice || v.basePrice)
  );

  return (
    <div className="luxury-card group rounded-xl overflow-hidden bg-white flex flex-col justify-between border border-[#E5E7EB] hover:border-[#202832] transition-all shadow-sm">
      {/* 1. Image Container (Studio Equipment Frame) */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-[#080B10] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Minimal Subtle Temp Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#080B10]/85 backdrop-blur-md text-[#8DD8E8] border border-white/10 px-2.5 py-0.5 rounded text-[11px] font-mono-data font-medium">
            {selectedVariant.temperatureRange}
          </span>
        </div>

        {/* Brand Pill */}
        {brand && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-[#080B10]/85 backdrop-blur-md text-white border border-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
              {brand.name}
            </span>
          </div>
        )}
      </Link>

      {/* 2. Structured Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* SKU Code */}
          <div className="flex items-center justify-between text-[11px] font-mono-data text-slate-500 mb-1">
            <span>MODEL CODE</span>
            <span className="font-semibold text-slate-700">{selectedVariant.sku}</span>
          </div>

          {/* Model Name */}
          <h3 className="text-sm font-bold text-[#080B10] group-hover:text-[#0E7490] transition-colors leading-snug">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Telemetry Row */}
          <div className="mt-3 pt-3 border-t border-[#F4F5F7] flex items-center gap-2 text-xs text-slate-600 font-mono-data">
            <span className="font-semibold text-[#080B10]">{selectedVariant.capacity}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{selectedVariant.temperatureRange}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{product.variants.length} Sizes</span>
          </div>
        </div>

        {/* 3. B2B Pricing & Primary Action */}
        <div className="pt-3 border-t border-[#F4F5F7] space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Indicative Sourcing Price
              </span>
              <span className="text-sm font-mono-data font-extrabold text-[#080B10]">
                Starting from ₹{lowestPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] font-mono-data text-slate-400">Excl. Tax</span>
          </div>

          {/* Action Row: Primary Request Quote + View Details */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddQuote}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-bold transition-all shadow-sm ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#27C7D9] text-[#080B10] hover:bg-[#8DD8E8]'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <FileText className="h-3.5 w-3.5" />
                  <span>Request Quote</span>
                </>
              )}
            </button>

            <Link
              href={`/products/${product.slug}`}
              className="flex items-center justify-center gap-1 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] hover:bg-[#080B10] hover:text-white py-2 px-3 text-xs font-bold text-[#080B10] transition-colors"
            >
              <span>Specs</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
