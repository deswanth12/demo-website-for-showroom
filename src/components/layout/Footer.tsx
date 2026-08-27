// src/components/layout/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Snowflake, FileText, Zap, Layers, Phone } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';

export default function Footer() {
  const { branches } = useTenant();

  return (
    <footer className="border-t border-[#202832] bg-[#080B10] text-[#A8B0BA] text-xs">
      {/* 4 Verifiable B2B Pillars */}
      <div className="border-b border-[#11161D] py-8 px-4 bg-[#05070A]">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#27C7D9] shrink-0" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider block">Engineering Datasheets</span>
              <span className="text-[11px] text-slate-400">Instant PDF Specs & Dimensions</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-[#27C7D9] shrink-0" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider block">Fast Quotation Engine</span>
              <span className="text-[11px] text-slate-400">Itemized Proforma Proposals</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-[#27C7D9] shrink-0" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider block">Tiered Volume Pricing</span>
              <span className="text-[11px] text-slate-400">5%, 8%, 12% Bulk Discounts</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-[#27C7D9] shrink-0" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider block">Technical Support</span>
              <span className="text-[11px] text-slate-400">Installation & Service Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-white/5 border border-white/10 text-[#27C7D9]">
                <Snowflake className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-white uppercase">FrostFlow Engineering</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Interactive platform concept engineered for commercial refrigeration dealers, multi-branch showrooms, and commercial kitchen contractors.
            </p>
            <div className="pt-2 rounded-lg bg-[#11161D] border border-[#202832] p-3 text-[11px] text-slate-400 max-w-sm">
              <span className="font-bold text-white block mb-0.5">Demo Concept Notice</span>
              This website is an interactive demonstration concept showcasing modern B2B equipment procurement workflows.
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Equipment</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/products?category=display-refrigerators" className="hover:text-white transition-colors">Visi Coolers</Link></li>
              <li><Link href="/products?category=deep-freezers" className="hover:text-white transition-colors">Deep Freezers</Link></li>
              <li><Link href="/products?category=ice-machines" className="hover:text-white transition-colors">Ice Machines</Link></li>
              <li><Link href="/products?category=cold-storage" className="hover:text-white transition-colors">Cold Rooms</Link></li>
              <li><Link href="/products?category=bakery-equipment" className="hover:text-white transition-colors">Bakery Showcases</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Solutions</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/industries/restaurants-cafes" className="hover:text-white transition-colors">Restaurants</Link></li>
              <li><Link href="/industries/supermarkets-retail" className="hover:text-white transition-colors">Supermarkets</Link></li>
              <li><Link href="/industries/bakeries-confectionery" className="hover:text-white transition-colors">Bakeries</Link></li>
              <li><Link href="/services/cold-room-turnkey-installation" className="hover:text-white transition-colors">Cold Room Turnkey</Link></li>
              <li><Link href="/services/annual-maintenance-contract" className="hover:text-white transition-colors">AMC Contracts</Link></li>
            </ul>
          </div>

          {/* Showrooms */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Showroom</h4>
            <div className="space-y-1 text-slate-400 text-xs">
              <p className="font-semibold text-slate-200">Demo Showroom</p>
              <p className="text-slate-400">India</p>
              <p className="font-mono-data text-[11px] text-[#27C7D9]">+91 XXX XXX XXXX</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#11161D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 FrostFlow Engineering • Commercial Refrigeration Platform Concept</p>
          <div className="flex items-center gap-6">
            <Link href="/locations" className="hover:text-slate-300 transition-colors">Locations</Link>
            <Link href="/gallery" className="hover:text-slate-300 transition-colors">Installations</Link>
            <Link href="/quote" className="hover:text-white transition-colors">Quote Cart</Link>
            <Link href="/admin" className="text-[#8DD8E8] hover:underline font-mono-data">Admin Portal ↗</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
