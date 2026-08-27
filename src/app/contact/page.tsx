// src/app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, Clock } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { leadService } from '@/lib/store';
import { getWhatsAppGeneralUrl } from '@/lib/integrations/whatsapp';

export default function ContactPage() {
  const { selectedBranch } = useTenant();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<'general' | 'product' | 'service' | 'amc'>('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    leadService.create({
      customer: {
        name,
        businessName,
        phone,
        email,
        city: selectedBranch.city,
      },
      source: 'website',
      inquiryType,
      message: message || 'General showroom inquiry.',
      branchId: selectedBranch.id,
    });

    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-16 space-y-12 bg-[#F4F5F7]">
      <div className="border-b border-[#E5E7EB] pb-6 text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono-data text-[#0E7490] uppercase tracking-wider font-bold">
          Regional Showrooms & Technical Consultation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#080B10] mt-2 tracking-tight">
          Connect With Refrigeration Specialists
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Reach our senior commercial cooling engineers for equipment sizing, quotes, or showroom appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Form (7 cols) - Clean White Card */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#080B10] mb-4">
            Send Showroom Inquiry
          </h2>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-[#080B10] placeholder-slate-400 focus:border-[#27C7D9] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 77022 56073"
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-[#080B10] placeholder-slate-400 focus:border-[#27C7D9] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="purchasing@company.com"
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-[#080B10] placeholder-slate-400 focus:border-[#27C7D9] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Business / Outlet Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Grand Spice Cafe"
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-[#080B10] placeholder-slate-400 focus:border-[#27C7D9] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Inquiry Type</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value as any)}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-[#080B10] focus:border-[#27C7D9] focus:bg-white focus:outline-none"
                  >
                    <option value="general">General Commercial Equipment</option>
                    <option value="product">Product Availability & Sizing</option>
                    <option value="service">Turnkey Cold Room Installation</option>
                    <option value="amc">Annual Maintenance Contract (AMC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Requirements / Message</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your cooling requirements or required equipment..."
                  className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-[#080B10] placeholder-slate-400 focus:border-[#27C7D9] focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#27C7D9] py-3 text-xs uppercase tracking-wider font-bold text-[#080B10] hover:bg-[#8DD8E8] transition-colors shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          ) : (
            <div className="py-12 text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-bounce" />
              <h3 className="text-xl font-bold text-[#080B10]">Inquiry Received!</h3>
              <p className="text-xs text-slate-600 max-w-sm">
                Our senior sales desk at the {selectedBranch.city} showroom will call you shortly.
              </p>
            </div>
          )}
        </div>

        {/* Showroom Contact Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4 text-xs shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#080B10]">
              Selected Showroom Facility
            </h3>

            <div className="space-y-3 text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#0E7490] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#080B10] block">{selectedBranch.name}</span>
                  <span className="text-slate-600">{selectedBranch.address}, {selectedBranch.city} - {selectedBranch.pincode}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-[#0E7490] shrink-0" />
                <span className="text-slate-700">{selectedBranch.operatingHours}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#0E7490] shrink-0" />
                <a href={`tel:${selectedBranch.phone}`} className="font-mono-data font-bold text-[#080B10] hover:text-[#0E7490]">
                  {selectedBranch.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#0E7490] shrink-0" />
                <span>{selectedBranch.email}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <a
                href={getWhatsAppGeneralUrl(selectedBranch.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#22C55E] py-3 text-xs font-bold text-white hover:bg-[#16A34A] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp {selectedBranch.city} Desk</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
