// src/components/layout/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Snowflake,
  Search,
  Scale,
  FileText,
  Phone,
  Menu,
  X,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { useQuoteCart } from '@/context/QuoteCartContext';
import { useCompare } from '@/context/CompareContext';

export default function Navbar() {
  const pathname = usePathname();
  const { selectedBranch, setSelectedBranch, branches } = useTenant();
  const { totalItems, setIsDrawerOpen } = useQuoteCart();
  const { compareCount } = useCompare();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Equipment', href: '/products' },
    { label: 'Industries', href: '/industries/restaurants-cafes' },
    { label: 'Cold Rooms', href: '/services/cold-room-turnkey-installation' },
    { label: 'Installations', href: '/gallery' },
    { label: 'Showrooms', href: '/locations' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080B10] text-white border-b border-[#202832]">
      {/* Top Demo Notice & Location Bar */}
      <div className="border-b border-[#11161D] bg-[#05070A] px-4 py-1.5 text-xs text-[#A8B0BA]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded bg-white/10 text-slate-300 px-2 py-0.5 text-[10px] font-mono-data font-semibold">
              DEMO CONCEPT
            </span>
            <div className="relative">
              <button
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                className="flex items-center gap-1.5 font-medium text-slate-300 hover:text-white transition-colors text-xs"
              >
                <MapPin className="h-3 w-3 text-[#27C7D9]" />
                <span>Showroom: {selectedBranch.city}</span>
                <ChevronDown className="h-3 w-3 text-slate-500" />
              </button>

              {branchDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-lg border border-[#202832] bg-[#11161D] p-2 shadow-2xl z-50 text-white">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A8B0BA]">
                    Regional Experience Centers
                  </div>
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedBranch(b);
                        setBranchDropdownOpen(false);
                      }}
                      className={`w-full rounded-md px-2.5 py-2 text-left text-xs transition-colors flex flex-col ${
                        selectedBranch.id === b.id
                          ? 'bg-[#27C7D9]/15 text-[#27C7D9]'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="font-semibold">{b.city} Center</span>
                      <span className="text-[11px] text-[#A8B0BA]">{b.address}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="hidden sm:inline text-slate-800">|</span>
            <span className="hidden md:inline text-slate-400">Hours: {selectedBranch.operatingHours}</span>
          </div>

          <div>
            <a
              href={`tel:${selectedBranch.phone}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-mono-data text-xs"
            >
              <Phone className="h-3 w-3 text-[#27C7D9]" />
              <span>{selectedBranch.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#27C7D9]">
            <Snowflake className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold tracking-tight text-white">FROSTFLOW</span>
            <span className="text-[10px] font-mono-data uppercase tracking-widest text-[#A8B0BA]">ENGINEERING</span>
            <span className="hidden sm:inline rounded bg-white/10 text-[#8DD8E8] px-1.5 py-0.5 text-[9px] font-mono-data uppercase font-bold">
              Demo Concept
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-wider font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-white ${
                  isActive ? 'text-[#27C7D9]' : 'text-[#A8B0BA]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/products"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#202832] bg-[#11161D] text-slate-300 hover:border-white/30 hover:text-white transition-colors"
            title="Search Catalogue"
          >
            <Search className="h-3.5 w-3.5" />
          </Link>

          {compareCount > 0 && (
            <Link
              href="/compare"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-[#27C7D9]/40 bg-[#27C7D9]/10 px-2.5 text-xs font-semibold text-[#27C7D9]"
              title="Compare Models"
            >
              <Scale className="h-3.5 w-3.5" />
              <span>{compareCount}</span>
            </Link>
          )}

          {/* Primary Request Quote Action */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#27C7D9] text-[#080B10] px-3.5 text-xs font-bold hover:bg-[#8DD8E8] transition-colors shadow-sm"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Request Quote</span>
            {totalItems > 0 && (
              <span className="rounded-full bg-[#080B10] text-[#27C7D9] px-1.5 py-0.2 text-[10px] font-mono-data font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#202832] bg-[#11161D] text-slate-300 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#202832] bg-[#080B10] px-4 py-4 lg:hidden">
          <nav className="flex flex-col space-y-3 text-xs uppercase tracking-wider font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#A8B0BA] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#202832] flex items-center justify-between">
              <Link
                href="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Scale className="h-3.5 w-3.5" />
                <span>Compare Matrix ({compareCount})</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] font-mono-data text-[#8DD8E8]"
              >
                Admin Control ↗
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
