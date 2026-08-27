// src/components/layout/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Snowflake, ShieldCheck, Zap, Award, Phone } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';

export default function Footer() {
  const { branches } = useTenant();

  return (
    <footer className="border-t border-[#202832] bg-[#080B10] text-[#A8B0BA] text-xs">
      {/* 4 Pillars Header */}
      <div className="border-b border-[#11161D] py-8 px-4 bg-[#05070A]">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#27C7D9] shrink-0" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider block">Commercial Duty</span>
              <span className="text-[11px] text-slate-400">1-Yr Complete + 4-Yr Compressor</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-[#27C7D9] shrink-0" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider block">Fast Quotation</span>
              <span className="text-[11px] text-slate-400">Instant PDF Proforma Dispatch</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-[#27C7D9] shrink-0" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider block">Volume Tiers</span>
              <span className="text-[11px] text-slate-400">Automated B2B Bulk Discounts</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-[#27C7D9] shrink-0" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider block">Direct Technical Desk</span>
              <span className="text-[11px] text-slate-400">Senior Cooling Engineers</span>
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
              Specialist supplier of commercial refrigeration systems, tropicalized deep freezers, visi coolers, and modular walk-in cold rooms.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono-data text-slate-500">
              <span>GSTIN: 27AABCF1234F1Z9</span>
              <span>•</span>
              <span>ISO 9001:2015</span>
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Showrooms</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              {branches.map((b) => (
                <div key={b.id}>
                  <p className="font-semibold text-slate-200">{b.city} Center</p>
                  <p className="font-mono-data text-[11px] text-[#27C7D9]">{b.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-[#11161D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} FrostFlow Engineering Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/locations" className="hover:text-slate-300 transition-colors">Locations</Link>
            <Link href="/gallery" className="hover:text-slate-300 transition-colors">Installations</Link>
            <Link href="/quote" className="hover:text-white transition-colors">Quote Cart</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
