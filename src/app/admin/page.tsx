// src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Snowflake,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  MessageCircle,
  Search,
  Filter,
  Eye,
  Activity,
  DollarSign,
  Phone,
  Store,
  RefreshCw,
} from 'lucide-react';
import {
  productService,
  leadService,
  quoteService,
  customerService,
  analyticsService,
  auditService,
  categoryService,
  brandService,
} from '@/lib/store';
import { Product, ProductVariant, Customer, Lead, QuoteRequest, Quote, LeadActivity } from '@/types';
import { generateFormalQuotePDF } from '@/lib/integrations/pdf';
import { getWhatsAppFormalQuoteUrl } from '@/lib/integrations/whatsapp';

type AdminTab = 'dashboard' | 'products' | 'quote_requests' | 'formal_quotes' | 'leads' | 'customers' | 'audit_logs';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState<'Super Admin' | 'Showroom Manager' | 'Sales Executive' | 'Content Manager' | 'Viewer'>('Showroom Manager');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('admin@frostflow.com');
  const [authPassword, setAuthPassword] = useState('admin123');
  const [authError, setAuthError] = useState('');

  // Reactive DB States
  const [products, setProducts] = useState<Product[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Modals & Active Viewers
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newActivityText, setNewActivityText] = useState('');
  const [newActivityType, setNewActivityType] = useState<LeadActivity['type']>('note');

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Product Edit / Add Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  const refreshData = () => {
    setProducts(productService.getAll());
    setLeads(leadService.getAll());
    setQuoteRequests(quoteService.getRequests());
    setQuotes(quoteService.getFormalQuotes());
    setCustomers(customerService.getAll());
    setAuditLogs(auditService.getAll());
  };

  useEffect(() => {
    setMounted(true);
    const savedAuth = localStorage.getItem('frostflow_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    refreshData();
    window.addEventListener('frostflow_db_updated', refreshData);
    return () => window.removeEventListener('frostflow_db_updated', refreshData);
  }, []);

  const handleLogin = (role?: 'Super Admin' | 'Showroom Manager' | 'Sales Executive') => {
    if (role) {
      setCurrentUserRole(role);
      setIsAuthenticated(true);
      localStorage.setItem('frostflow_admin_auth', 'true');
      localStorage.setItem('frostflow_admin_role', role);
      return;
    }

    if (authEmail && authPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('frostflow_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Please enter your administrator credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('frostflow_admin_auth');
  };

  const metrics = analyticsService.getFunnelMetrics();

  // Handlers
  const handleLeadStatusChange = (leadId: string, status: Lead['status']) => {
    leadService.updateStatus(leadId, status, `Admin (${currentUserRole})`);
    refreshData();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(leadService.getById(leadId) || null);
    }
  };

  const handleAddLeadActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newActivityText.trim()) return;

    leadService.addActivity(selectedLead.id, {
      type: newActivityType,
      description: newActivityText.trim(),
      performedBy: currentUserRole,
    });
    setNewActivityText('');
    refreshData();
    setSelectedLead(leadService.getById(selectedLead.id) || null);
  };

  const handleConvertToFormalQuote = (request: QuoteRequest) => {
    const customer = customerService.getById(request.customerId);
    const lineItems = request.items.map((item) => {
      const prod = productService.getById(item.productId);
      const variant = prod?.variants.find((v) => v.id === item.variantId) || prod?.variants[0];
      const unitPrice = variant?.offerPrice || variant?.basePrice || 40000;
      const discountPercentage = item.quantity >= 6 ? 8 : item.quantity >= 3 ? 5 : 0;
      const discountedUnitPrice = Math.round(unitPrice * (1 - discountPercentage / 100));

      return {
        productId: item.productId,
        variantId: item.variantId,
        sku: variant?.sku || 'SKU-STD',
        productName: prod?.name || 'Commercial Refrigeration Unit',
        variantName: variant?.name || 'Standard Model',
        unitPrice,
        discountPercentage,
        discountedUnitPrice,
        quantity: item.quantity,
        totalPrice: discountedUnitPrice * item.quantity,
      };
    });

    const subtotal = lineItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
    const totalDiscount = lineItems.reduce((acc, i) => acc + (i.unitPrice - i.discountedUnitPrice) * i.quantity, 0);
    const installationFee = request.installationRequired ? 5000 : 0;
    const deliveryFee = 3500;
    const amcFee = request.amcRequired ? Math.round(subtotal * 0.06) : 0;
    const taxable = subtotal - totalDiscount + installationFee + deliveryFee + amcFee;
    const taxRate = 0.18;
    const taxAmount = Math.round(taxable * taxRate);
    const grandTotal = taxable + taxAmount;

    const newQuote = quoteService.createFormalQuote({
      quoteRequestId: request.id,
      tenantId: request.tenantId,
      customerId: request.customerId,
      branchId: request.branchId,
      version: 1,
      lineItems,
      subtotal,
      totalDiscount,
      installationFee,
      deliveryFee,
      amcFee,
      taxRate,
      taxAmount,
      grandTotal,
      validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      termsAndConditions: [
        '50% Advance along with confirmed Purchase Order, balance prior to dispatch.',
        'Standard delivery within 3-5 business days.',
        '1-Year Comprehensive Warranty + 4-Year Compressor Warranty.',
        'Standard 230V 1-phase electrical input to be supplied at site by client.',
      ],
      status: 'sent',
      assignedStaff: `${currentUserRole} Desk`,
    });

    refreshData();
    setActiveTab('formal_quotes');
    setSelectedQuote(newQuote);
  };

  const handleFormalQuoteStatusChange = (quoteId: string, status: Quote['status']) => {
    quoteService.updateFormalQuoteStatus(quoteId, status, currentUserRole);
    refreshData();
    if (selectedQuote && selectedQuote.id === quoteId) {
      setSelectedQuote(quoteService.getFormalQuoteById(quoteId) || null);
    }
  };

  const handleSoftDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to soft-delete this commercial equipment model?')) {
      productService.softDelete(productId, currentUserRole);
      refreshData();
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#080B10] flex items-center justify-center text-xs text-slate-500 font-mono-data">
        Initializing FrostFlow Admin...
      </div>
    );
  }

  // -------------------------------------------------------------
  // EXECUTIVE LOGIN GATE
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080B10] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-[#202832] text-[#27C7D9] mx-auto mb-4 shadow-xl">
            <Snowflake className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            FrostFlow™ Admin Portal
          </h2>
          <p className="mt-1 text-xs text-[#A8B0BA]">
            Commercial Showroom CRM & Catalogue Management
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#11161D] border border-[#202832] py-8 px-6 shadow-2xl rounded-2xl sm:px-10 space-y-6">
            {/* Quick Demo 1-Click Role Login */}
            <div>
              <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#27C7D9] font-bold block mb-2 text-center">
                Quick Role-Based Demo Login:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleLogin('Super Admin')}
                  className="rounded-lg border border-[#202832] bg-[#080B10] p-2 text-center text-xs font-semibold text-white hover:border-[#27C7D9] hover:bg-[#202832] transition-all"
                >
                  Super Admin
                </button>
                <button
                  onClick={() => handleLogin('Showroom Manager')}
                  className="rounded-lg border border-[#202832] bg-[#080B10] p-2 text-center text-xs font-semibold text-white hover:border-[#27C7D9] hover:bg-[#202832] transition-all"
                >
                  Manager
                </button>
                <button
                  onClick={() => handleLogin('Sales Executive')}
                  className="rounded-lg border border-[#202832] bg-[#080B10] p-2 text-center text-xs font-semibold text-white hover:border-[#27C7D9] hover:bg-[#202832] transition-all"
                >
                  Sales Rep
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#202832]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#11161D] px-2 text-slate-500 font-mono-data text-[10px]">
                  Or Login with Email
                </span>
              </div>
            </div>

            {/* Email / Password Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4 text-xs"
            >
              {authError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-400 text-center">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-medium mb-1">Staff Email</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#202832] bg-[#080B10] p-3 text-white placeholder-slate-600 focus:border-[#27C7D9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#202832] bg-[#080B10] p-3 text-white placeholder-slate-600 focus:border-[#27C7D9] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#27C7D9] py-3 text-xs uppercase tracking-wider font-bold text-[#080B10] hover:bg-[#8DD8E8] transition-colors shadow-md"
              >
                Sign In to Admin Console
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="text-xs text-[#A8B0BA] hover:text-white transition-colors"
              >
                ← Return to Public Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-200">
      {/* Top Admin Header */}
      <header className="border-b border-white/10 bg-[#0C1017] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                <Snowflake className="h-4 w-4" />
              </div>
              <span className="font-bold text-white tracking-tight">FROSTFLOW</span>
              <span className="rounded bg-[#00F0FF]/20 px-1.5 py-0.5 text-[10px] font-mono-data font-bold text-[#00F0FF]">
                ADMIN CONTROL
              </span>
            </Link>
            <span className="text-slate-600">|</span>
            <span className="hidden sm:inline text-xs text-slate-400">Showroom CRM & Catalogue Operating System</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">Active Staff Role:</span>
              <select
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value as any)}
                className="rounded-md border border-white/10 bg-[#161C24] px-2.5 py-1 text-xs text-[#00F0FF] font-semibold focus:outline-none"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Showroom Manager">Showroom Manager</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Content Manager">Content Manager</option>
                <option value="Viewer">Viewer (Read-Only)</option>
              </select>
            </div>

            <Link
              href="/"
              className="rounded-md border border-white/10 bg-[#161C24] px-3 py-1 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Storefront ↗
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3 mb-8 text-xs">
          {[
            { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products & Variants (${products.length})`, icon: Package },
            { id: 'quote_requests', label: `Quote Requests (${quoteRequests.length})`, icon: FileText },
            { id: 'formal_quotes', label: `Formal Quotations (${quotes.length})`, icon: DollarSign },
            { id: 'leads', label: `Leads CRM (${leads.length})`, icon: MessageSquare },
            { id: 'customers', label: `Customer Directory (${customers.length})`, icon: Users },
            { id: 'audit_logs', label: `Audit Trail (${auditLogs.length})`, icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#00F0FF] text-black font-bold shadow-md shadow-[#00F0FF]/20'
                    : 'bg-[#10141A] border border-white/5 text-slate-300 hover:border-white/15'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. DASHBOARD OVERVIEW TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="rounded-xl border border-white/10 bg-[#10141A] p-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Active Quote Pipeline</span>
                  <DollarSign className="h-4 w-4 text-[#00F0FF]" />
                </div>
                <div className="mt-2 text-2xl font-mono-data font-extrabold text-white">
                  ₹{metrics.pipelineValue.toLocaleString('en-IN')}
                </div>
                <div className="mt-1 text-[11px] text-emerald-400">
                  {quotes.length} Formal Commercial Proposals
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#10141A] p-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Inbound Leads</span>
                  <MessageSquare className="h-4 w-4 text-[#00F0FF]" />
                </div>
                <div className="mt-2 text-2xl font-mono-data font-extrabold text-white">
                  {metrics.totalLeads}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  {quoteRequests.length} wishlists pending review
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#10141A] p-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>WhatsApp Inquiries</span>
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                </div>
                <div className="mt-2 text-2xl font-mono-data font-extrabold text-white">
                  {metrics.whatsappClicks}
                </div>
                <div className="mt-1 text-[11px] text-[#25D366]">
                  High-intent mobile conversations
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#10141A] p-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Lead-to-Quote Conversion</span>
                  <TrendingUp className="h-4 w-4 text-[#00F0FF]" />
                </div>
                <div className="mt-2 text-2xl font-mono-data font-extrabold text-white">
                  {metrics.conversionRate}%
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  From inquiry to confirmed quotation
                </div>
              </div>
            </div>

            {/* Visual Commercial Sales Funnel */}
            <div className="rounded-2xl border border-white/10 bg-[#10141A] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Commercial Acquisition & Deal Flow Funnel
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    End-to-end customer acquisition pipeline across digital and showroom channels
                  </p>
                </div>
                <span className="text-xs font-mono-data text-[#00F0FF]">Live Funnel Telemetry</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="rounded-xl bg-[#161C24] p-4 border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">1. Showroom Visitors</span>
                  <div className="mt-2 text-xl font-mono-data font-bold text-white">{metrics.visitorsEstimate}</div>
                  <span className="text-[10px] text-slate-500">Total Storefront Hits</span>
                </div>

                <div className="rounded-xl bg-[#161C24] p-4 border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">2. Spec Views</span>
                  <div className="mt-2 text-xl font-mono-data font-bold text-white">{metrics.productViews}</div>
                  <span className="text-[10px] text-slate-500">48% Exploration Rate</span>
                </div>

                <div className="rounded-xl bg-[#161C24] p-4 border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">3. Inbound Inquiries</span>
                  <div className="mt-2 text-xl font-mono-data font-bold text-[#00F0FF]">{metrics.totalLeads}</div>
                  <span className="text-[10px] text-slate-500">WhatsApp & Web</span>
                </div>

                <div className="rounded-xl bg-[#161C24] p-4 border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">4. Proposals Issued</span>
                  <div className="mt-2 text-xl font-mono-data font-bold text-white">{metrics.totalQuotes}</div>
                  <span className="text-[10px] text-slate-500">Proforma Quotations</span>
                </div>

                <div className="rounded-xl bg-[#161C24] p-4 border border-emerald-500/30 bg-emerald-500/5">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400">5. Closed Deals</span>
                  <div className="mt-2 text-xl font-mono-data font-bold text-emerald-400">
                    {quotes.filter((q) => q.status === 'accepted').length}
                  </div>
                  <span className="text-[10px] text-emerald-500 font-medium">Won Commercial Orders</span>
                </div>
              </div>
            </div>

            {/* Recent Leads & Quotes Dual Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Leads */}
              <div className="rounded-xl border border-white/10 bg-[#10141A] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Recent Customer Inquiries</h4>
                  <button onClick={() => setActiveTab('leads')} className="text-xs font-bold text-[#00F0FF] hover:underline">
                    View CRM ↗
                  </button>
                </div>
                <div className="space-y-3">
                  {leads.slice(0, 4).map((l) => (
                    <div key={l.id} className="rounded-lg bg-[#161C24] p-3 border border-white/5 flex justify-between items-start text-xs">
                      <div>
                        <span className="font-bold text-white">{customerService.getById(l.customerId)?.name || 'Client'}</span>
                        <p className="text-slate-400 line-clamp-1 mt-0.5">{l.message}</p>
                        <span className="text-[10px] font-mono-data text-slate-500">{new Date(l.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <span className="rounded bg-[#00F0FF]/15 px-2 py-0.5 text-[10px] font-bold text-[#00F0FF] capitalize">
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Quotations */}
              <div className="rounded-xl border border-white/10 bg-[#10141A] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Active Formal Proposals</h4>
                  <button onClick={() => setActiveTab('formal_quotes')} className="text-xs font-bold text-[#00F0FF] hover:underline">
                    All Quotes ↗
                  </button>
                </div>
                <div className="space-y-3">
                  {quotes.slice(0, 4).map((q) => (
                    <div key={q.id} className="rounded-lg bg-[#161C24] p-3 border border-white/5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono-data font-bold text-[#00F0FF]">{q.id}</span>
                        <div className="text-slate-300 font-medium">
                          {customerService.getById(q.customerId)?.businessName || customerService.getById(q.customerId)?.name}
                        </div>
                        <span className="text-[10px] text-slate-500">Valid: {q.validUntil}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono-data font-bold text-white">₹{q.grandTotal.toLocaleString('en-IN')}</div>
                        <span className="text-[10px] font-bold uppercase text-emerald-400">{q.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS & VARIANTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Catalogue & Variant Management</h2>
                <p className="text-xs text-slate-400">Add, edit, or adjust pricing across all commercial cooling appliances.</p>
              </div>
              <button
                onClick={() => {
                  alert('Product creation builder ready. In this demo, you can inspect and soft-delete existing models or modify their pricing.');
                }}
                className="flex items-center gap-2 rounded-lg bg-[#00F0FF] px-4 py-2 text-xs font-bold text-black hover:bg-[#38F4FF]"
              >
                <Plus className="h-4 w-4" />
                <span>Add Commercial Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-xl border border-white/10 bg-[#10141A] overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0B0F15] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Product Name & Category</th>
                    <th className="p-4">Variants / SKUs</th>
                    <th className="p-4">Temperature Zone</th>
                    <th className="p-4">Price Range (₹)</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => {
                    const minPrice = Math.min(...p.variants.map((v) => v.offerPrice || v.basePrice));
                    const maxPrice = Math.max(...p.variants.map((v) => v.offerPrice || v.basePrice));
                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white">{p.name}</div>
                          <span className="text-[11px] text-slate-400">
                            {categoryService.getAll().find((c) => c.id === p.categoryId)?.name}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {p.variants.map((v) => (
                              <span key={v.id} className="rounded bg-[#161C24] border border-white/10 px-1.5 py-0.5 font-mono-data text-[10px] text-[#00F0FF]">
                                {v.capacity} ({v.sku})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono-data text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded">
                            {p.variants[0]?.temperatureRange}
                          </span>
                        </td>
                        <td className="p-4 font-mono-data font-bold text-white">
                          ₹{minPrice.toLocaleString('en-IN')} {minPrice !== maxPrice && `- ₹${maxPrice.toLocaleString('en-IN')}`}
                        </td>
                        <td className="p-4">
                          <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                            In Stock
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/products/${p.slug}`}
                              className="rounded p-1.5 text-slate-400 hover:text-white bg-[#161C24]"
                              title="View on Storefront"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                            <button
                              onClick={() => handleSoftDeleteProduct(p.id)}
                              className="rounded p-1.5 text-red-400 hover:text-red-300 bg-[#161C24]"
                              title="Soft Delete Product"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. QUOTE REQUESTS TAB */}
        {activeTab === 'quote_requests' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Inbound Customer Quote Requests</h2>
              <p className="text-xs text-slate-400">Review wishlist items submitted by business buyers and convert them to formal proposals.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#10141A] overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0B0F15] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Request Ref</th>
                    <th className="p-4">Buyer & Business</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Requested Lines</th>
                    <th className="p-4">Installation / AMC</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {quoteRequests.map((req) => {
                    const cust = customerService.getById(req.customerId);
                    return (
                      <tr key={req.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono-data font-bold text-[#00F0FF]">{req.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{cust?.name}</div>
                          <div className="text-[11px] text-slate-400">{cust?.businessName || cust?.phone}</div>
                        </td>
                        <td className="p-4 text-slate-300">{req.deliveryCity}</td>
                        <td className="p-4 font-mono-data text-white">{req.items.length} Product Line(s)</td>
                        <td className="p-4">
                          <span className="text-[11px] text-slate-300">
                            {req.installationRequired ? '✓ Install' : ''} {req.amcRequired ? '+ AMC' : ''}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono-data">{new Date(req.createdAt).toLocaleDateString('en-IN')}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleConvertToFormalQuote(req)}
                            className="rounded bg-[#00F0FF] px-3 py-1.5 text-xs font-bold text-black hover:bg-[#38F4FF]"
                          >
                            Generate Proposal ↗
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. FORMAL QUOTATIONS TAB */}
        {activeTab === 'formal_quotes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Commercial Proforma Quotations</h2>
              <p className="text-xs text-slate-400">Formal sales documents with tiered volume discounts, tax calculations, and PDF generation.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#10141A] overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0B0F15] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Quote #</th>
                    <th className="p-4">Client / Business</th>
                    <th className="p-4">Grand Total (Incl. Tax)</th>
                    <th className="p-4">Discount Applied</th>
                    <th className="p-4">Validity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {quotes.map((q) => {
                    const cust = customerService.getById(q.customerId);
                    return (
                      <tr key={q.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono-data font-bold text-[#00F0FF]">{q.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{cust?.businessName || cust?.name}</div>
                          <div className="text-[11px] text-slate-400">{cust?.phone}</div>
                        </td>
                        <td className="p-4 font-mono-data font-bold text-white text-sm">
                          ₹{q.grandTotal.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 font-mono-data text-emerald-400">
                          {q.totalDiscount > 0 ? `- ₹${q.totalDiscount.toLocaleString('en-IN')}` : 'Standard Rate'}
                        </td>
                        <td className="p-4 font-mono-data text-slate-400">{q.validUntil}</td>
                        <td className="p-4">
                          <select
                            value={q.status}
                            onChange={(e) => handleFormalQuoteStatusChange(q.id, e.target.value as any)}
                            className="rounded bg-[#161C24] border border-white/10 px-2 py-1 text-[11px] font-bold uppercase text-[#00F0FF] focus:outline-none"
                          >
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="negotiating">Negotiating</option>
                            <option value="accepted">Accepted (Won)</option>
                            <option value="declined">Declined (Lost)</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => cust && generateFormalQuotePDF(q, cust)}
                              className="rounded bg-[#161C24] border border-white/10 p-1.5 text-slate-200 hover:text-[#00F0FF]"
                              title="Download Quotation PDF"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <a
                              href={getWhatsAppFormalQuoteUrl(cust?.whatsapp || '917702256073', q, cust?.name || 'Customer')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded bg-[#25D366]/20 border border-[#25D366]/40 p-1.5 text-[#25D366] hover:bg-[#25D366] hover:text-black"
                              title="WhatsApp Proforma Proposal"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. LEADS CRM & ACTIVITY TIMELINE TAB */}
        {activeTab === 'leads' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Leads Table (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Inbound Lead Pipeline</h2>
                <span className="text-xs text-slate-400">{leads.length} Total Registered Leads</span>
              </div>

              <div className="space-y-3">
                {leads.map((l) => {
                  const cust = customerService.getById(l.customerId);
                  const isSelected = selectedLead?.id === l.id;
                  return (
                    <div
                      key={l.id}
                      onClick={() => setSelectedLead(l)}
                      className={`rounded-xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#00F0FF] bg-[#141B26]'
                          : 'border-white/10 bg-[#10141A] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{cust?.name}</span>
                            <span className="text-[10px] font-mono-data text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                              Source: {l.source.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{cust?.businessName || cust?.city}</p>
                          <p className="text-xs text-slate-200 mt-2 leading-relaxed">&ldquo;{l.message}&rdquo;</p>
                        </div>

                        <select
                          value={l.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleLeadStatusChange(l.id, e.target.value as any)}
                          className="rounded bg-[#161C24] border border-white/10 px-2 py-1 text-[10px] font-bold uppercase text-[#00F0FF] focus:outline-none"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Staff: {l.assignedStaff || 'Unassigned'}</span>
                        <span className="font-mono-data">{new Date(l.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Lead Activity Stream (5 cols) */}
            <div className="lg:col-span-5">
              {selectedLead ? (
                <div className="rounded-xl border border-white/10 bg-[#10141A] p-6 space-y-6 sticky top-24">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-[10px] font-mono-data text-[#00F0FF] uppercase tracking-wider">
                      Lead Timeline & Audit
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {customerService.getById(selectedLead.customerId)?.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {customerService.getById(selectedLead.customerId)?.phone} | {selectedLead.inquiryType}
                    </p>
                  </div>

                  {/* Add New Activity Form */}
                  <form onSubmit={handleAddLeadActivity} className="space-y-2.5">
                    <div className="flex gap-2">
                      <select
                        value={newActivityType}
                        onChange={(e) => setNewActivityType(e.target.value as any)}
                        className="rounded-md border border-white/10 bg-[#161C24] px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="note">Internal Note</option>
                        <option value="call">Phone Call</option>
                        <option value="whatsapp">WhatsApp Message</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                    <textarea
                      value={newActivityText}
                      onChange={(e) => setNewActivityText(e.target.value)}
                      placeholder="Log call summary, customer constraint, or next follow-up date..."
                      rows={2}
                      className="w-full rounded-md border border-white/10 bg-[#161C24] p-2.5 text-xs text-white placeholder-slate-500 focus:border-[#00F0FF] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-md bg-[#00F0FF] py-2 text-xs font-bold text-black hover:bg-[#38F4FF]"
                    >
                      Log Timeline Activity
                    </button>
                  </form>

                  {/* Activities List */}
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Timestamped Activity Stream
                    </h4>

                    {selectedLead.activities.map((act) => (
                      <div key={act.id} className="rounded-lg bg-[#161C24] p-3 border border-white/5 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-[#00F0FF] uppercase">{act.type.replace(/_/g, ' ')}</span>
                          <span className="font-mono-data">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-200 mt-1 text-xs">{act.description}</p>
                        {act.performedBy && (
                          <div className="text-[10px] text-slate-500 mt-1">Logged by: {act.performedBy}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-[#10141A] p-12 text-center text-xs text-slate-500">
                  Select a lead from the list to view its complete communication history and log new actions.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. CUSTOMER DIRECTORY TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Commercial Customer Directory</h2>
              <p className="text-xs text-slate-400">Unified customer profiles linking multiple inquiry leads and formal proforma quotations.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#10141A] overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0B0F15] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Contact Name & Business</th>
                    <th className="p-4">Customer Tier</th>
                    <th className="p-4">Phone / WhatsApp</th>
                    <th className="p-4">City</th>
                    <th className="p-4">GST Number</th>
                    <th className="p-4">Linked Proposals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {customers.map((c) => {
                    const custQuotes = quotes.filter((q) => q.customerId === c.id);
                    return (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white">{c.name}</div>
                          <div className="text-[11px] text-slate-400">{c.businessName || 'Independent Buyer'}</div>
                        </td>
                        <td className="p-4">
                          <span className="rounded bg-[#00F0FF]/15 px-2 py-0.5 text-[10px] font-bold text-[#00F0FF] uppercase">
                            {c.customerType}
                          </span>
                        </td>
                        <td className="p-4 font-mono-data text-slate-300">{c.phone}</td>
                        <td className="p-4 text-slate-300">{c.city}</td>
                        <td className="p-4 font-mono-data text-slate-400">{c.gstNumber || 'Unregistered'}</td>
                        <td className="p-4 font-mono-data font-bold text-white">{custQuotes.length} Quote(s)</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. AUDIT LOGS TAB */}
        {activeTab === 'audit_logs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">System Audit & Activity Logs</h2>
              <p className="text-xs text-slate-400">Real-time audit records of all administrative actions and price adjustments.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#10141A] divide-y divide-white/5">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data font-bold text-[#00F0FF] uppercase">{log.action}</span>
                      <span className="text-slate-400">on entity</span>
                      <span className="font-bold text-white uppercase">{log.entity}</span>
                      <span className="font-mono-data text-slate-500">({log.entityId})</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px]">
                      By <strong className="text-slate-200">{log.userName}</strong>
                    </p>
                  </div>
                  <span className="text-[11px] font-mono-data text-slate-500">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
