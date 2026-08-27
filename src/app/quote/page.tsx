// src/app/quote/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Send,
  Building,
  MapPin,
} from 'lucide-react';
import { useQuoteCart } from '@/context/QuoteCartContext';
import { useTenant } from '@/context/TenantContext';
import { calculateCommercialPricing } from '@/services/pricingService';
import { quoteService } from '@/lib/store';
import { getWhatsAppQuoteRequestUrl } from '@/lib/integrations/whatsapp';

export default function QuotePage() {
  const { items, updateQuantity, removeItem, clearCart } = useQuoteCart();
  const { selectedBranch, branches, setSelectedBranch } = useTenant();

  // Form State
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(selectedBranch.city);
  const [installationRequired, setInstallationRequired] = useState(true);
  const [amcRequired, setAmcRequired] = useState(false);
  const [notes, setNotes] = useState('');

  // Submission State
  const [submittedQuote, setSubmittedQuote] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricing = calculateCommercialPricing(items, {
    installationRequired,
    amcRequired,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !name || !phone) return;

    setIsSubmitting(true);

    try {
      const quoteRequest = quoteService.createRequest({
        customer: {
          name,
          businessName,
          phone,
          whatsapp: whatsapp || phone,
          email,
          city,
        },
        items: items.map((i) => ({
          productId: i.product.id,
          variantId: i.variant.id,
          quantity: i.quantity,
        })),
        installationRequired,
        amcRequired,
        deliveryCity: city,
        notes,
        branchId: selectedBranch.id,
      });

      setSubmittedQuote(quoteRequest);
      clearCart();
    } catch (err) {
      console.error('Failed to submit quote request', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 bg-[#F8FAFC]">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-6 mb-8">
        <div className="text-xs font-mono-data uppercase tracking-wider text-[#0E7490] font-bold">
          B2B Commercial Procurement
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-1">
          Request Commercial Proforma Quotation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Select equipment units, specify delivery requirements, and receive official quotation with tiered volume discounts.
        </p>
      </div>

      {submittedQuote ? (
        /* Confirmation Screen */
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="h-8 w-8 animate-bounce" />
          </div>

          <span className="rounded bg-[#E0F2FE] px-3 py-1 font-mono-data text-xs font-bold text-[#0284C7]">
            REFERENCE: {submittedQuote.id}
          </span>

          <h2 className="text-2xl font-extrabold text-[#0F172A] mt-3">
            Quotation Request Received!
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Your inquiry has been routed to our commercial sales engineers at the <strong>{selectedBranch.name}</strong>. A formal proforma proposal with tax breakdown will be prepared.
          </p>

          {/* Direct WhatsApp Follow-up CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={getWhatsAppQuoteRequestUrl(
                selectedBranch.whatsapp,
                submittedQuote,
                name,
                submittedQuote.items.map((i: any) => ({
                  name: 'Equipment Model',
                  variantName: i.variantId,
                  quantity: i.quantity,
                }))
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-lg bg-[#22C55E] px-6 py-3 text-xs font-bold text-white hover:bg-[#16A34A] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Connect on WhatsApp with Sales Desk</span>
            </a>

            <Link
              href="/products"
              className="w-full sm:w-auto rounded-lg border border-[#CBD5E1] bg-white px-6 py-3 text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-all"
            >
              Back to Catalogue
            </Link>
          </div>
        </div>
      ) : (
        /* Main Quote Request Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Customer & Delivery Details Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                  1. Commercial Buyer & Outlet Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provide your business details to receive a customized GST quotation.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Full Name & Business Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] placeholder-slate-400 focus:border-[#22D3EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Company / Outlet Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Hypermarket / Cloud Kitchen"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] placeholder-slate-400 focus:border-[#22D3EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Phone Number (Calling) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 77022 56073"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] placeholder-slate-400 focus:border-[#22D3EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="For instant proforma PDF dispatch"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] placeholder-slate-400 focus:border-[#22D3EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Official Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] placeholder-slate-400 focus:border-[#22D3EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Delivery Destination City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, Navi Mumbai, Pune"
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] placeholder-slate-400 focus:border-[#22D3EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Commercial Add-ons */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <span className="font-bold text-slate-700 block">Commercial Turnkey Addons:</span>

                  <label className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={installationRequired}
                      onChange={(e) => setInstallationRequired(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#0284C7]"
                    />
                    <div>
                      <span className="font-bold text-[#0F172A]">Site Unloading & Professional Installation</span>
                      <p className="text-[11px] text-slate-500">
                        Technician positioning, electrical testing, and temperature pull-down calibration.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={amcRequired}
                      onChange={(e) => setAmcRequired(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#0284C7]"
                    />
                    <div>
                      <span className="font-bold text-[#0F172A]">1-Year Annual Maintenance Contract (AMC)</span>
                      <p className="text-[11px] text-slate-500">
                        Quarterly gas checks, condenser coil chemical wash, and 24/7 priority emergency breakdown support.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Site Notes */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Special Site Constraints / Doorway Dimensions / Delivery Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Basement access only via freight elevator (8ft height limit)..."
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[#0F172A] placeholder-slate-400 focus:border-[#22D3EE] focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={items.length === 0 || isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#27C7D9] py-4 text-xs uppercase tracking-wider font-extrabold text-[#080B10] hover:bg-[#8DD8E8] disabled:opacity-50 transition-all shadow-md mt-4"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {isSubmitting ? 'Generating Proposal...' : 'Submit Commercial Quote Request'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Selected Equipment Line Items (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                  2. Selected Line Items ({items.length})
                </h3>
                <button
                  onClick={clearCart}
                  className="text-[11px] text-slate-400 hover:text-red-500 font-medium"
                >
                  Clear All
                </button>
              </div>

              {items.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No equipment selected. Please browse the catalogue to add units.
                </div>
              ) : (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {items.map(({ product, variant, quantity }) => (
                    <div
                      key={variant.id}
                      className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 flex flex-col gap-2 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono-data text-[10px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded">
                            {variant.sku}
                          </span>
                          <h4 className="text-xs font-bold text-[#0F172A] mt-1">{product.name}</h4>
                          <span className="text-[11px] text-slate-500">{variant.name} ({variant.capacity})</span>
                        </div>
                        <button
                          onClick={() => removeItem(variant.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                        <div className="flex items-center border border-[#CBD5E1] rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(variant.id, quantity - 1)}
                            className="px-2 py-0.5 text-slate-500 hover:text-black"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 font-mono-data font-bold text-xs">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(variant.id, quantity + 1)}
                            className="px-2 py-0.5 text-slate-500 hover:text-black"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="font-mono-data font-bold text-[#0F172A]">
                          ₹{((variant.offerPrice || variant.basePrice) * quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Live Commercial Pricing Breakdown */}
              {items.length > 0 && (
                <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Equipment Total:</span>
                    <span className="font-mono-data font-semibold">₹{pricing.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {pricing.totalDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Volume Discount Applied:</span>
                      <span className="font-mono-data font-bold">- ₹{pricing.totalDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {installationRequired && (
                    <div className="flex justify-between text-slate-600">
                      <span>Site Unloading & Installation:</span>
                      <span className="font-mono-data font-semibold">₹{pricing.installationFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {amcRequired && (
                    <div className="flex justify-between text-slate-600">
                      <span>1-Year Maintenance Package (AMC):</span>
                      <span className="font-mono-data font-semibold">₹{pricing.amcFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Estimated GST (18%):</span>
                    <span className="font-mono-data font-semibold">₹{pricing.taxAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#0F172A]">Estimated Grand Total:</span>
                    <span className="text-lg font-mono-data font-extrabold text-[#0F172A]">
                      ₹{pricing.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
