// src/app/products/[slug]/page.tsx
'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Snowflake,
  Scale,
  FileText,
  MessageCircle,
  Download,
  Share2,
  Check,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';
import { productService, brandService, categoryService } from '@/lib/store';
import { useTenant } from '@/context/TenantContext';
import { useQuoteCart } from '@/context/QuoteCartContext';
import { useCompare } from '@/context/CompareContext';
import { getWhatsAppProductInquiryUrl } from '@/lib/integrations/whatsapp';
import { generateProductSpecSheetPDF } from '@/lib/integrations/pdf';
import ProductCard from '@/components/products/ProductCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const product = productService.getBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const { selectedBranch } = useTenant();
  const { addItem } = useQuoteCart();
  const { addToCompare, isInCompare } = useCompare();

  const brand = brandService.getAll().find((b) => b.id === product.brandId);
  const category = categoryService.getAll().find((c) => c.id === product.categoryId);

  const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeMedia = product.media[activeMediaIndex] || product.media[0];
  const isCompared = isInCompare(selectedVariant.id);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleDownloadPDF = () => {
    generateProductSpecSheetPDF(product, selectedVariant, selectedBranch);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedProducts = productService
    .getAll()
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: activeMedia?.url,
    description: product.description,
    sku: selectedVariant.sku,
    brand: {
      '@type': 'Brand',
      name: brand?.name || 'FrostFlow',
    },
    offers: {
      '@type': 'Offer',
      price: selectedVariant.offerPrice || selectedVariant.basePrice,
      priceCurrency: 'INR',
      availability:
        selectedVariant.stockStatus === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 bg-[#F8FAFC]">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-black transition-colors font-medium">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-black transition-colors font-medium">Catalogue</Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/products?category=${category.slug}`} className="hover:text-black transition-colors font-medium">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#0F172A] font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Media Gallery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Main Visual Display */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-sm">
            <img
              src={activeMedia?.url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800&auto=format&fit=crop'}
              alt={activeMedia?.altText || product.name}
              className="h-full w-full object-cover"
            />

            {/* Functional Operating Temperature Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="badge-cyan-temp flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono-data font-bold shadow-sm">
                <Snowflake className="h-3.5 w-3.5" />
                <span>{selectedVariant.temperatureRange}</span>
              </span>
            </div>

            {/* Functional Stock Status Badge */}
            <div className="absolute top-3 right-3 z-10">
              {selectedVariant.stockStatus === 'in_stock' && (
                <span className="badge-stock-in rounded-md px-2.5 py-1 text-xs font-bold shadow-sm">
                  ● In Stock (Immediate Dispatch)
                </span>
              )}
              {selectedVariant.stockStatus === 'low_stock' && (
                <span className="badge-stock-low rounded-md px-2.5 py-1 text-xs font-bold shadow-sm">
                  ● Low Stock
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.media.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.media.map((med, idx) => (
                <button
                  key={med.id}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`relative aspect-square w-20 rounded-xl overflow-hidden border transition-all ${
                    activeMediaIndex === idx
                      ? 'border-[#22D3EE] ring-2 ring-[#22D3EE]/40'
                      : 'border-[#E2E8F0] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={med.url} alt={med.title} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick PDF & Share Utility */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-white py-2.5 px-3 text-xs font-bold text-slate-700 hover:border-black hover:text-black transition-all shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Download Spec Sheet</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-white py-2.5 px-3 text-xs font-bold text-slate-700 hover:border-black hover:text-black transition-all shadow-sm"
            >
              <Share2 className="h-4 w-4" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
            </button>
          </div>
        </div>

        {/* Right: Technical Information & Configuration (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* Header / Brand & SKU */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#F0F9FF] border border-[#BAE6FD] px-2.5 py-1 text-xs font-mono-data font-bold text-[#0284C7]">
                  SKU: {selectedVariant.sku}
                </span>
                {brand && (
                  <span className="rounded-md bg-white border border-[#E2E8F0] px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm">
                    {brand.name}
                  </span>
                )}
              </div>

              <span className="text-xs text-slate-500 font-mono-data">
                Capacity: <strong className="text-[#0F172A]">{selectedVariant.capacity}</strong>
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Capacity Variant Switcher */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-700 font-bold uppercase tracking-wider">
                <span>Select Capacity Model:</span>
                <span className="text-[#0284C7] font-mono-data">{selectedVariant.name}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`rounded-xl p-3.5 text-left border transition-all flex flex-col justify-between gap-1 ${
                      selectedVariant.id === v.id
                        ? 'border-[#0B1220] bg-[#0B1220] text-white shadow-md'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className={`text-xs font-bold ${selectedVariant.id === v.id ? 'text-white' : 'text-[#0F172A]'}`}>
                      {v.capacity} Model
                    </span>
                    <span className={`text-[11px] font-mono-data ${selectedVariant.id === v.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {v.sku}
                    </span>
                    <span className={`text-xs font-mono-data font-bold mt-1 ${selectedVariant.id === v.id ? 'text-[#22D3EE]' : 'text-[#0F172A]'}`}>
                      ₹{(v.offerPrice || v.basePrice).toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Summary Box */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                  Indicative Unit Price (Excl. Tax)
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl sm:text-3xl font-mono-data font-extrabold text-[#080B10]">
                    ₹{(selectedVariant.offerPrice || selectedVariant.basePrice).toLocaleString('en-IN')}
                  </span>
                  {selectedVariant.offerPrice && (
                    <span className="text-sm font-mono-data text-slate-400 line-through">
                      ₹{selectedVariant.basePrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  ★ Automated volume discount: 5% (3+ units), 8% (6+ units), 12% (10+ units)
                </p>
              </div>

              {/* Quantity Adjuster */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-medium">Quantity:</span>
                <div className="flex items-center border border-[#CBD5E1] rounded-xl bg-[#F8FAFC]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-500 hover:text-black"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 font-mono-data font-bold text-sm text-[#080B10]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-500 hover:text-black"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Add to Quote Cart (Frost Cyan) */}
              <button
                onClick={handleAddToCart}
                className={`sm:col-span-2 flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-xs font-bold transition-all shadow-md ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#27C7D9] text-[#080B10] hover:bg-[#8DD8E8]'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Added to Quote Cart</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Add {quantity} Unit(s) to Quote</span>
                  </>
                )}
              </button>

              {/* Direct WhatsApp Consultation */}
              <a
                href={getWhatsAppProductInquiryUrl(selectedBranch.whatsapp, product, selectedVariant, selectedBranch)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#22C55E]/40 bg-[#F0FDF4] py-3.5 px-4 text-xs font-bold text-[#15803D] hover:bg-[#22C55E] hover:text-white transition-all shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Specialist</span>
              </a>
            </div>

            {/* Compare Toggle */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => addToCompare(product, selectedVariant)}
                className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                  isCompared ? 'text-[#0284C7] font-semibold' : 'text-slate-500 hover:text-black'
                }`}
              >
                <Scale className="h-3.5 w-3.5" />
                <span>{isCompared ? 'Added to Comparison Matrix' : 'Add to Side-by-Side Compare'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Technical Specification Matrix Table */}
      <div className="mt-16 border-t border-[#E2E8F0] pt-10">
        <div className="text-xs font-mono-data uppercase tracking-wider text-[#0E7490] font-bold">
          Engineering Datasheet
        </div>
        <h2 className="text-2xl font-extrabold text-[#0F172A] mt-1 mb-6">
          Full Technical Specifications ({selectedVariant.name})
        </h2>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Column 1: Thermal & Physical */}
            <div className="p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] pb-2 border-b border-slate-100">
                Dimensions & Thermal Parameters
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 spec-row">
                  <span className="text-slate-700 font-medium">Gross / Net Volume</span>
                  <span className="font-mono-data font-bold text-[#0F172A]">{selectedVariant.capacity}</span>
                </div>
                <div className="flex justify-between py-2 spec-row">
                  <span className="text-slate-700 font-medium">Operating Temperature</span>
                  <span className="font-mono-data font-bold text-[#0284C7]">{selectedVariant.temperatureRange}</span>
                </div>
                <div className="flex justify-between py-2 spec-row">
                  <span className="text-slate-700 font-medium">Physical Dimensions (W × D × H)</span>
                  <span className="font-mono-data font-bold text-[#0F172A]">{selectedVariant.dimensions}</span>
                </div>
                <div className="flex justify-between py-2 spec-row">
                  <span className="text-slate-700 font-medium">Daily Power Consumption</span>
                  <span className="font-mono-data font-bold text-[#0F172A]">{selectedVariant.powerConsumption}</span>
                </div>
                <div className="flex justify-between py-2 spec-row">
                  <span className="text-slate-700 font-medium">Stock Availability</span>
                  <span className="font-mono-data font-bold text-emerald-600">
                    {selectedVariant.stockStatus.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Electrical & Construction */}
            <div className="p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] pb-2 border-b border-slate-100">
                Refrigerant & Construction Details
              </h3>

              <div className="space-y-2 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2 spec-row">
                    <span className="text-slate-700 font-medium">{key}</span>
                    <span className="font-mono-data font-bold text-[#0F172A]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Features List */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-4">
            Commercial Grade Features
          </h3>
          <ul className="space-y-3 text-xs text-slate-600">
            {product.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-4">
            Recommended Commercial Applications
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.applications.map((app, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-slate-700"
              >
                {app}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Related Models */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-[#E2E8F0] pt-10">
          <h3 className="text-xl font-extrabold text-[#0F172A] mb-6">
            Similar Commercial Equipment
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
