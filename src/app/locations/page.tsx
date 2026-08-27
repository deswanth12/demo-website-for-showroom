// src/app/locations/page.tsx
'use client';

import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { getWhatsAppGeneralUrl } from '@/lib/integrations/whatsapp';

export default function LocationsPage() {
  const { branches, selectedBranch, setSelectedBranch } = useTenant();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 space-y-12 bg-[#F4F5F7]">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-6">
        <div className="text-xs font-mono-data uppercase tracking-wider text-[#0E7490] font-bold">
          Multi-Showroom Network (Demo Concept)
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#080B10] mt-1 tracking-tight">
          Showroom & Experience Center Locations
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Interactive demonstration showing how multiple dealer branches, contact desks, and equipment centers route customer inquiries.
        </p>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((branch) => {
          const isSelected = selectedBranch.id === branch.id;
          return (
            <div
              key={branch.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between gap-6 transition-all ${
                isSelected
                  ? 'border-[#080B10] bg-white shadow-xl ring-2 ring-[#080B10]/10'
                  : 'border-[#E5E7EB] bg-white hover:border-slate-400 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded bg-[#F0F9FB] border border-[#D4F0F6] px-2 py-0.5 text-[10px] font-mono-data font-bold text-[#0E7490]">
                      {branch.code}
                    </span>
                    <h3 className="text-lg font-bold text-[#080B10] mt-1.5">{branch.name}</h3>
                  </div>
                  {branch.isMainBranch && (
                    <span className="rounded bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                      HQ & Center
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-[#0E7490] shrink-0 mt-0.5" />
                    <span>{branch.address}, {branch.city} - {branch.pincode}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-[#0E7490] shrink-0" />
                    <span>{branch.operatingHours}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-[#0E7490] shrink-0" />
                    <a href={`tel:${branch.phone}`} className="font-mono-data font-bold text-[#080B10] hover:text-[#0E7490]">
                      {branch.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-[#0E7490] shrink-0" />
                    <span>{branch.email}</span>
                  </div>
                </div>

                {/* Services List */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Facility Capabilities:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {branch.servicesOffered.map((srv, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => setSelectedBranch(branch)}
                  className={`w-full rounded-lg py-2.5 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#080B10] text-white shadow-md'
                      : 'border border-[#CBD5E1] bg-[#F8FAFC] text-[#080B10] hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? '✓ Selected as Preferred Showroom' : 'Set as Preferred Showroom'}
                </button>

                <a
                  href={getWhatsAppGeneralUrl(branch.whatsapp, `Hi, I would like to schedule a visit to the ${branch.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#22C55E]/40 bg-[#F0FDF4] py-2 text-xs font-bold text-[#15803D] hover:bg-[#22C55E] hover:text-white transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp Branch Desk</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
