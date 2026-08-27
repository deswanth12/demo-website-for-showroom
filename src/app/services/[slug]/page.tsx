// src/app/services/[slug]/page.tsx
'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Wrench,
  Check,
  Clock,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { cmsService } from '@/lib/store';
import { useTenant } from '@/context/TenantContext';
import { getWhatsAppGeneralUrl } from '@/lib/integrations/whatsapp';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const services = cmsService.getServices();
  const service = services.find((s) => s.slug === resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const { selectedBranch } = useTenant();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 space-y-12 bg-[#F4F5F7]">
      {/* Service Header (Obsidian #080B10) */}
      <div className="rounded-2xl border border-[#202832] bg-[#080B10] p-8 sm:p-12 relative overflow-hidden text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#27C7D9]/30 bg-[#27C7D9]/10 px-3.5 py-1 text-xs font-mono-data font-semibold text-[#27C7D9] mb-4">
            <Wrench className="h-3.5 w-3.5" />
            <span>COMMERCIAL REFRIGERATION SERVICES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {service.name}
          </h1>

          <p className="text-sm sm:text-base text-[#CBD5E1] mt-3 leading-relaxed">
            {service.fullDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="rounded-lg bg-[#27C7D9] px-6 py-3 text-xs uppercase tracking-wider font-bold text-[#080B10] hover:bg-[#8DD8E8] transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Book Site Survey / Estimate</span>
            </Link>

            <a
              href={getWhatsAppGeneralUrl(
                selectedBranch.whatsapp,
                `Hi, I would like to inquire about ${service.name}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#202832] bg-[#11161D] px-5 py-3 text-xs uppercase tracking-wider font-bold text-white hover:bg-[#202832] transition-colors flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Service Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scope of Work & SLA Cards (Clean White) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="text-xs font-mono-data uppercase tracking-wider text-[#0E7490] font-bold">
            Scope of Service & Execution
          </div>
          <h2 className="text-lg font-bold text-[#080B10]">Service Protocol</h2>
          <ul className="space-y-3 text-xs text-slate-700">
            {service.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-[#0E7490] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#0E7490] font-mono-data uppercase tracking-wider font-bold block mb-2">
              Commercial Terms
            </span>
            <h3 className="text-base font-bold text-[#080B10]">Pricing & SLA Guidelines</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {service.pricingGuideline}
            </p>
          </div>

          <div className="rounded-lg bg-[#F8FAFC] p-4 border border-[#E2E8F0] flex items-center gap-3.5">
            <Clock className="h-5 w-5 text-[#0E7490] shrink-0" />
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Response & Completion SLA</span>
              <p className="text-xs font-bold text-[#080B10] mt-0.5">{service.sla}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Other Services Links */}
      <div className="border-t border-[#E5E7EB] pt-10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#080B10] mb-4">
          Other Specialized Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/services/${s.slug}`}
              className={`rounded-xl p-5 border transition-all ${
                s.slug === resolvedParams.slug
                  ? 'border-[#080B10] bg-[#080B10] text-white'
                  : 'border-[#E5E7EB] bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <h4 className="font-bold text-sm text-[#080B10]">{s.name}</h4>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{s.shortDescription}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
