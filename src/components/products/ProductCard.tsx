// src/components/products/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Snowflake, ArrowUpRight, Plus, Check } from 'lucide-react';
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
  const { addItem } = useQuoteCart();
  const [added, setAdded] = useState(false);

  const primaryMedia = product.media.find((m) => m.isPrimary) || product.media[0];
  const imageUrl = primaryMedia?.url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800&auto=format&fit=crop';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="luxury-card group rounded-xl overflow-hidden bg-white flex flex-col justify-between">
      {/* 1. Image Container (Studio Lighting) */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-[#080B10] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Minimal Subtle Temp Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#080B10]/80 backdrop-blur-md text-[#8DD8E8] border border-white/10 px-2.5 py-0.5 rounded text-[11px] font-mono-data font-medium">
            {selectedVariant.temperatureRange}
          </span>
        </div>

        {/* Quick Add Quote Button */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 z-10 rounded-lg bg-white/90 hover:bg-white text-[#080B10] p-2 text-xs font-semibold shadow-md transition-all flex items-center gap-1 opacity-0 group-hover:opacity-100"
          title="Quick add to Quote"
        >
          {added ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      </Link>

      {/* 2. Structured Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Brand Eyebrow */}
          <div className="flex items-center justify-between text-[11px] tracking-wider uppercase font-bold text-slate-600">
            <span>{brand?.name || 'COMMERCIAL'}</span>
            <span className="font-mono-data text-slate-600 font-semibold">{selectedVariant.sku}</span>
          </div>

          {/* Model Name */}
          <h3 className="mt-1.5 text-sm font-bold text-[#080B10] group-hover:text-[#27C7D9] transition-colors leading-snug">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Clean Technical Telemetry Pill Row */}
          <div className="mt-3 pt-3 border-t border-[#F4F5F7] flex items-center gap-2 text-xs text-slate-600 font-mono-data">
            <span className="font-semibold text-[#080B10]">{selectedVariant.capacity}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{selectedVariant.temperatureRange}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 truncate max-w-[100px]">{selectedVariant.name}</span>
          </div>
        </div>

        {/* 3. Bottom Pricing & Details Link */}
        <div className="pt-3 border-t border-[#F4F5F7] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Commercial Price</span>
            <span className="text-base font-mono-data font-bold text-[#080B10]">
              ₹{(selectedVariant.offerPrice || selectedVariant.basePrice).toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="rounded-lg border border-[#E5E7EB] bg-[#F4F5F7] hover:bg-[#080B10] hover:text-white px-3 py-1.5 text-xs font-semibold text-[#080B10] transition-all flex items-center gap-1 group/btn"
          >
            <span>View Details</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover/btn:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
