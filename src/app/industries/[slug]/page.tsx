// src/app/industries/[slug]/page.tsx
'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Store,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { cmsService, productService } from '@/lib/store';
import ProductCard from '@/components/products/ProductCard';
import { useTenant } from '@/context/TenantContext';
import { getWhatsAppGeneralUrl } from '@/lib/integrations/whatsapp';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function IndustryDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const industries = cmsService.getIndustries();
  const industry = industries.find((i) => i.slug === resolvedParams.slug);

  if (!industry) {
    notFound();
  }

  const { selectedBranch } = useTenant();
  const allProducts = productService.getAll();
  const recommended = allProducts.filter((p) => industry.recommendedProducts.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 space-y-12 bg-[#F4F5F7]">
      {/* Industry Header (Obsidian #080B10) */}
      <div className="rounded-2xl border border-[#202832] bg-[#080B10] p-8 sm:p-12 relative overflow-hidden text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#27C7D9]/30 bg-[#27C7D9]/10 px-3.5 py-1 text-xs font-mono-data font-semibold text-[#27C7D9] mb-4">
            <Store className="h-3.5 w-3.5" />
            <span>INDUSTRY SPECIALIZATION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {industry.name}
          </h1>

          <p className="text-sm sm:text-base text-[#CBD5E1] mt-3 leading-relaxed">
            {industry.description}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="rounded-lg bg-[#27C7D9] px-6 py-3 text-xs uppercase tracking-wider font-bold text-[#080B10] hover:bg-[#8DD8E8] transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Request Custom Industry Sizing</span>
            </Link>

            <a
              href={getWhatsAppGeneralUrl(
                selectedBranch.whatsapp,
                `Hi, I run a ${industry.name} business and need advice on commercial cooling equipment.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#202832] bg-[#11161D] px-5 py-3 text-xs uppercase tracking-wider font-bold text-white hover:bg-[#202832] transition-colors flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Industry Specialist</span>
            </a>
          </div>
        </div>
      </div>

      {/* Case Study Card (Clean White) */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-sm">
        <div>
          <span className="text-xs font-mono-data uppercase tracking-wider text-[#0E7490] font-bold">Proven Execution</span>
          <h3 className="text-lg font-bold text-[#080B10] mt-1">{industry.caseStudy.client}</h3>
        </div>

        <div className="rounded-lg bg-[#F8FAFC] p-4 border border-[#E2E8F0]">
          <span className="text-xs text-slate-500 font-medium">Achieved Impact</span>
          <div className="text-base font-bold text-emerald-700 mt-0.5">{industry.caseStudy.metrics}</div>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed">
          {industry.caseStudy.summary}
        </div>
      </div>

      {/* Recommended Equipment Suite */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-mono-data uppercase tracking-wider text-[#0E7490] font-bold">
              Engineered Equipment Checklist
            </div>
            <h2 className="text-2xl font-extrabold text-[#080B10] mt-1">
              Recommended for {industry.name}
            </h2>
          </div>

          <Link href="/products" className="text-xs font-bold text-[#080B10] hover:text-[#0E7490] uppercase tracking-wider">
            Browse All Catalogue ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Other Industries Hub Links */}
      <div className="border-t border-[#E5E7EB] pt-10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#080B10] mb-4">
          Explore Other Industry Sectors
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {industries.map((ind) => (
            <Link
              key={ind.id}
              href={`/industries/${ind.slug}`}
              className={`rounded-lg p-3 text-xs border transition-colors ${
                ind.slug === resolvedParams.slug
                  ? 'border-[#080B10] bg-[#080B10] text-white font-bold'
                  : 'border-[#E5E7EB] bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              {ind.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
