// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Building2,
  FileText,
  MessageCircle,
  Phone,
  Store,
  ChevronDown,
  Star,
  MapPin,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { productService, categoryService, brandService, cmsService } from '@/lib/store';
import ProductCard from '@/components/products/ProductCard';
import { useTenant } from '@/context/TenantContext';
import { getWhatsAppGeneralUrl } from '@/lib/integrations/whatsapp';

export default function HomePage() {
  const { selectedBranch } = useTenant();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories = categoryService.getAll();
  const brands = brandService.getAll();
  const featuredProducts = productService.getAll().slice(0, 6);
  const faqs = cmsService.getFAQs();
  const testimonials = cmsService.getTestimonials();
  const gallery = cmsService.getGallery();
  const industries = cmsService.getIndustries();

  return (
    <div className="flex flex-col bg-[#F4F5F7]">
      {/* 1. LUXURY INDUSTRIAL HERO (OBSIDIAN #080B10 / GRAPHITE #11161D) */}
      <section className="relative overflow-hidden bg-[#080B10] text-white border-b border-[#202832] pt-16 pb-20 sm:pt-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Typography & Hero CTAs (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              {/* Small Cyan Eyebrow */}
              <div className="inline-flex items-center gap-2 text-[11px] font-mono-data uppercase tracking-widest text-[#27C7D9] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#27C7D9]" />
                <span>COMMERCIAL COOLING SYSTEMS</span>
              </div>

              {/* Large Sharp Heading */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.02]">
                COMMERCIAL <br />
                REFRIGERATION <br />
                <span className="text-[#8DD8E8]">ENGINEERED FOR BUSINESS</span>
              </h1>

              {/* Short Punchy Body */}
              <p className="text-sm sm:text-base text-[#A8B0BA] max-w-lg leading-relaxed font-normal">
                Industrial visi coolers, tropicalized deep freezers, gourmet ice machines, and walk-in cold rooms. Direct factory supply and multi-city support.
              </p>

              {/* Dual Restrained CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/quote"
                  className="w-full sm:w-auto rounded-lg bg-[#27C7D9] px-7 py-3.5 text-xs uppercase tracking-wider font-bold text-[#080B10] hover:bg-[#8DD8E8] transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>REQUEST A QUOTE</span>
                </Link>

                <Link
                  href="/products"
                  className="w-full sm:w-auto rounded-lg border border-[#202832] bg-[#11161D] px-7 py-3.5 text-xs uppercase tracking-wider font-bold text-white hover:border-white/40 hover:bg-[#202832] transition-colors flex items-center justify-center gap-2"
                >
                  <span>EXPLORE EQUIPMENT</span>
                  <ArrowRight className="h-4 w-4 text-[#A8B0BA]" />
                </Link>
              </div>

              {/* Quick Capacity Links */}
              <div className="pt-6 border-t border-[#202832] flex flex-wrap items-center gap-2 text-xs text-[#A8B0BA]">
                <span className="font-mono-data text-[11px] uppercase tracking-wider">Direct Access:</span>
                {[
                  { label: '350L - 500L Units', href: '/products?search=500L' },
                  { label: '1000L Multi-Door', href: '/products?search=1000L' },
                  { label: 'Modular Cold Rooms', href: '/products?category=cold-storage' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded bg-[#11161D] border border-[#202832] px-2.5 py-1 text-slate-300 hover:text-white hover:border-[#8DD8E8] transition-colors font-mono-data text-[11px]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Studio Machinery Hero Visual (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-[#202832] bg-[#11161D] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=1000&auto=format&fit=crop"
                  alt="FrostFlow Commercial Refrigeration"
                  className="w-full h-full object-cover aspect-[4/5] opacity-90 hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B10] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-mono-data uppercase tracking-widest text-[#27C7D9] font-bold">
                      FLAGSHIP SPECIFICATION
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">Arctic Pro Dual Visi Cooler (1000L)</h3>
                    <p className="text-[11px] font-mono-data text-slate-400 mt-0.5">-2°C to +8°C • R290 Hydrocarbon</p>
                  </div>
                  <Link
                    href="/products/arctic-pro-visi-cooler"
                    className="rounded-lg bg-white text-[#080B10] p-2 hover:bg-[#F4F5F7] transition-colors"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EQUIPMENT CATEGORIES (CLEAN OFF-WHITE SURFACE) */}
      <section className="py-20 sm:py-28 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono-data uppercase tracking-widest text-[#0E7490] font-bold">
              PORTFOLIO ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080B10] mt-1 tracking-tight">
              Commercial Equipment Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#080B10] hover:text-[#27C7D9] transition-colors uppercase tracking-wider"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="luxury-card group rounded-xl p-7 bg-white flex flex-col justify-between"
            >
              <div>
                <span className="badge-ice-temp inline-block rounded px-2 py-0.5 text-[11px] font-mono-data font-bold">
                  {cat.operatingTempBadge}
                </span>
                <h3 className="text-base font-bold text-[#080B10] mt-4 group-hover:text-[#27C7D9] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F4F5F7] flex items-center justify-between text-xs font-bold text-[#080B10]">
                <span className="group-hover:text-[#27C7D9] transition-colors">View Models</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED UNITS SHOWCASE */}
      <section className="pb-20 sm:pb-28 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono-data uppercase tracking-widest text-[#0E7490] font-bold">
              HIGH DEMAND SYSTEMS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080B10] mt-1 tracking-tight">
              Featured Commercial Appliances
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#080B10] hover:text-[#27C7D9] transition-colors uppercase tracking-wider"
          >
            <span>All Units</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. INDUSTRY HUBS (CLEAN WHITE BLOCK) */}
      <section className="pb-20 sm:pb-28 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono-data uppercase tracking-widest text-[#0E7490] font-bold">
              INDUSTRY CONFIGURATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080B10] mt-1 tracking-tight">
              Specialized Industry Equipment Bundles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Engineered configurations adapted for footfall, duty cycles, and food safety standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind) => (
              <Link
                key={ind.id}
                href={`/industries/${ind.slug}`}
                className="rounded-xl border border-[#E5E7EB] bg-[#F4F5F7] p-6 hover:border-[#202832] hover:bg-white transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#E5E7EB] text-[#080B10] mb-4">
                    <Store className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#080B10] group-hover:text-[#27C7D9] transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    {ind.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-[#080B10]">
                  <span>Equipment Checklist</span>
                  <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MAJOR CTA SECTION (OBSIDIAN #080B10) */}
      <section className="pb-20 sm:pb-28 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#202832] bg-[#080B10] p-8 sm:p-14 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-[11px] font-mono-data uppercase tracking-widest text-[#27C7D9] font-bold">
              ENTERPRISE PROCUREMENT & AMC
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Size Your Commercial Facility?
            </h3>
            <p className="text-xs sm:text-sm text-[#A8B0BA] leading-relaxed">
              Our engineering team prepares itemized proforma quotations with volume tier pricing, site survey options, and preventive maintenance agreements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/quote"
              className="w-full sm:w-auto rounded-lg bg-[#27C7D9] px-7 py-3.5 text-xs uppercase tracking-wider font-bold text-[#080B10] hover:bg-[#8DD8E8] transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>REQUEST B2B QUOTATION</span>
            </Link>

            <a
              href={getWhatsAppGeneralUrl(selectedBranch.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-lg border border-[#202832] bg-[#11161D] px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-white hover:bg-[#202832] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WHATSAPP SPECIALIST</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
