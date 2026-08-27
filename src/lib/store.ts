// src/lib/store.ts
import {
  Tenant,
  Branch,
  Category,
  Brand,
  Product,
  ProductVariant,
  Customer,
  Lead,
  LeadActivity,
  QuoteRequest,
  Quote,
  FAQItem,
  Testimonial,
  GalleryItem,
  OfferItem,
  IndustryItem,
  ServiceItem,
  AnalyticsEvent,
  AnalyticsEventType,
  AuditLog,
} from '@/types';
import {
  mockTenant,
  mockCategories,
  mockBrands,
  mockProducts,
  mockCustomers,
  mockLeads,
  mockQuoteRequests,
  mockQuotes,
  mockFAQs,
  mockTestimonials,
  mockGallery,
  mockOffers,
  mockIndustries,
  mockServices,
  mockAuditLogs,
} from './mockData';

const STORAGE_KEY = 'frostflow_showroom_db_v5';

interface DBState {
  tenant: Tenant;
  branches: Branch[];
  categories: Category[];
  brands: Brand[];
  products: Product[];
  customers: Customer[];
  leads: Lead[];
  quoteRequests: QuoteRequest[];
  quotes: Quote[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  offers: OfferItem[];
  industries: IndustryItem[];
  services: ServiceItem[];
  analyticsEvents: AnalyticsEvent[];
  auditLogs: AuditLog[];
}

function getInitialDB(): DBState {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local showroom DB, re-initializing mock data', e);
      }
    }
  }
  return {
    tenant: mockTenant,
    branches: mockTenant.branches,
    categories: mockCategories,
    brands: mockBrands,
    products: mockProducts,
    customers: mockCustomers,
    leads: mockLeads,
    quoteRequests: mockQuoteRequests,
    quotes: mockQuotes,
    faqs: mockFAQs,
    testimonials: mockTestimonials,
    gallery: mockGallery,
    offers: mockOffers,
    industries: mockIndustries,
    services: mockServices,
    analyticsEvents: [],
    auditLogs: mockAuditLogs,
  };
}

let db: DBState = getInitialDB();

function persist() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      window.dispatchEvent(new Event('frostflow_db_updated'));
    } catch (e) {
      console.error('Failed to save showroom DB', e);
    }
  }
}

// -------------------------------------------------------------
// PRODUCT SERVICES
// -------------------------------------------------------------

export interface ProductFilterOptions {
  categoryId?: string;
  brandId?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  capacityFilter?: string; // e.g. "under_400L", "400_700L", "above_700L"
  temperatureZone?: 'all' | 'freezer' | 'chiller' | 'dual';
  inStockOnly?: boolean;
  sortBy?: 'featured' | 'price_low_high' | 'price_high_low' | 'name_asc';
}

export const productService = {
  getAll: (options?: ProductFilterOptions): Product[] => {
    let result = db.products.filter((p) => p.deletedAt === null);

    if (!options) return result;

    if (options.categoryId && options.categoryId !== 'all') {
      result = result.filter((p) => p.categoryId === options.categoryId);
    }

    if (options.brandId && options.brandId !== 'all') {
      result = result.filter((p) => p.brandId === options.brandId);
    }

    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q);
        const matchesVariants = p.variants.some(
          (v) =>
            v.sku.toLowerCase().includes(q) ||
            v.name.toLowerCase().includes(q) ||
            v.capacity.toLowerCase().includes(q) ||
            v.temperatureRange.toLowerCase().includes(q)
        );
        const matchesSpecs = Object.entries(p.specifications).some(
          ([k, val]) => k.toLowerCase().includes(q) || val.toLowerCase().includes(q)
        );
        return matchesName || matchesDesc || matchesVariants || matchesSpecs;
      });
    }

    if (options.minPrice !== undefined) {
      result = result.filter((p) => p.variants.some((v) => (v.offerPrice || v.basePrice) >= (options.minPrice || 0)));
    }

    if (options.maxPrice !== undefined) {
      result = result.filter((p) => p.variants.some((v) => (v.offerPrice || v.basePrice) <= (options.maxPrice || Infinity)));
    }

    if (options.temperatureZone && options.temperatureZone !== 'all') {
      if (options.temperatureZone === 'freezer') {
        result = result.filter((p) => p.variants.some((v) => v.temperatureRange.includes('-')));
      } else if (options.temperatureZone === 'chiller') {
        result = result.filter((p) => p.variants.some((v) => v.temperatureRange.includes('+')));
      }
    }

    if (options.inStockOnly) {
      result = result.filter((p) => p.variants.some((v) => v.stockStatus === 'in_stock'));
    }

    if (options.sortBy) {
      if (options.sortBy === 'price_low_high') {
        result.sort((a, b) => {
          const aPrice = Math.min(...a.variants.map((v) => v.offerPrice || v.basePrice));
          const bPrice = Math.min(...b.variants.map((v) => v.offerPrice || v.basePrice));
          return aPrice - bPrice;
        });
      } else if (options.sortBy === 'price_high_low') {
        result.sort((a, b) => {
          const aPrice = Math.max(...a.variants.map((v) => v.offerPrice || v.basePrice));
          const bPrice = Math.max(...b.variants.map((v) => v.offerPrice || v.basePrice));
          return bPrice - aPrice;
        });
      } else if (options.sortBy === 'name_asc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return result;
  },

  getBySlug: (slug: string): Product | undefined => {
    return db.products.find((p) => p.slug === slug && p.deletedAt === null);
  },

  getById: (id: string): Product | undefined => {
    return db.products.find((p) => p.id === id && p.deletedAt === null);
  },

  save: (product: Product): Product => {
    const idx = db.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      db.products[idx] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      db.products.push({
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    persist();
    return product;
  },

  softDelete: (id: string, actor: string = 'Admin'): boolean => {
    const prod = db.products.find((p) => p.id === id);
    if (prod) {
      prod.deletedAt = new Date().toISOString();
      auditService.log({
        tenantId: prod.tenantId,
        userId: 'admin',
        userName: actor,
        action: 'delete',
        entity: 'product',
        entityId: prod.id,
        before: { name: prod.name },
      });
      persist();
      return true;
    }
    return false;
  },
};

// -------------------------------------------------------------
// CUSTOMER SERVICES
// -------------------------------------------------------------

export const customerService = {
  getAll: (): Customer[] => {
    return db.customers.filter((c) => c.deletedAt === null);
  },

  getById: (id: string): Customer | undefined => {
    return db.customers.find((c) => c.id === id && c.deletedAt === null);
  },

  upsert: (customerData: Partial<Customer> & { phone: string; name: string }): Customer => {
    let customer = db.customers.find(
      (c) => c.phone.replace(/\D/g, '') === customerData.phone.replace(/\D/g, '') && c.deletedAt === null
    );

    if (customer) {
      Object.assign(customer, {
        name: customerData.name || customer.name,
        businessName: customerData.businessName || customer.businessName,
        email: customerData.email || customer.email,
        city: customerData.city || customer.city,
        address: customerData.address || customer.address,
        updatedAt: new Date().toISOString(),
      });
    } else {
      customer = {
        id: `cust-${Date.now()}`,
        tenantId: db.tenant.id,
        name: customerData.name,
        businessName: customerData.businessName || '',
        customerType: customerData.customerType || 'retail',
        phone: customerData.phone,
        whatsapp: customerData.whatsapp || customerData.phone.replace(/\D/g, ''),
        email: customerData.email || '',
        city: customerData.city || 'Mumbai',
        address: customerData.address || '',
        gstNumber: customerData.gstNumber || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      db.customers.push(customer);
    }
    persist();
    return customer;
  },
};

// -------------------------------------------------------------
// LEAD & ACTIVITY SERVICES
// -------------------------------------------------------------

export const leadService = {
  getAll: (): Lead[] => {
    return db.leads.filter((l) => l.deletedAt === null).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById: (id: string): Lead | undefined => {
    return db.leads.find((l) => l.id === id && l.deletedAt === null);
  },

  create: (params: {
    customer: { name: string; phone: string; whatsapp?: string; businessName?: string; city?: string; email?: string };
    source: Lead['source'];
    inquiryType: Lead['inquiryType'];
    productId?: string;
    variantId?: string;
    message: string;
    branchId?: string;
  }): Lead => {
    const customer = customerService.upsert(params.customer);
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      tenantId: db.tenant.id,
      customerId: customer.id,
      branchId: params.branchId || db.branches[0].id,
      source: params.source,
      inquiryType: params.inquiryType,
      productId: params.productId,
      variantId: params.variantId,
      message: params.message,
      status: 'new',
      assignedStaff: 'Sales Desk',
      activities: [
        {
          id: `act-${Date.now()}`,
          tenantId: db.tenant.id,
          leadId: `lead-${Date.now()}`,
          type: 'lead_created',
          description: `Lead created via ${params.source} for ${params.inquiryType} inquiry.`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    db.leads.unshift(newLead);

    analyticsService.log({
      eventName: 'quote_started',
      entityType: 'lead',
      entityId: newLead.id,
      metadata: { source: params.source },
    });

    persist();
    return newLead;
  },

  addActivity: (leadId: string, activity: Omit<LeadActivity, 'id' | 'tenantId' | 'leadId' | 'timestamp'>): LeadActivity | undefined => {
    const lead = db.leads.find((l) => l.id === leadId);
    if (!lead) return undefined;

    const newAct: LeadActivity = {
      id: `act-${Date.now()}`,
      tenantId: db.tenant.id,
      leadId: lead.id,
      timestamp: new Date().toISOString(),
      ...activity,
    };
    lead.activities.unshift(newAct);
    lead.updatedAt = new Date().toISOString();
    persist();
    return newAct;
  },

  updateStatus: (leadId: string, status: Lead['status'], actor: string = 'Staff'): boolean => {
    const lead = db.leads.find((l) => l.id === leadId);
    if (!lead) return false;

    const oldStatus = lead.status;
    lead.status = status;
    lead.updatedAt = new Date().toISOString();
    lead.activities.unshift({
      id: `act-${Date.now()}`,
      tenantId: db.tenant.id,
      leadId: lead.id,
      type: 'status_changed',
      description: `Status changed from ${oldStatus} to ${status} by ${actor}.`,
      performedBy: actor,
      timestamp: new Date().toISOString(),
    });
    persist();
    return true;
  },
};

// -------------------------------------------------------------
// QUOTE REQUEST & QUOTE SERVICES
// -------------------------------------------------------------

export const quoteService = {
  getRequests: (): QuoteRequest[] => {
    return db.quoteRequests
      .filter((q) => q.deletedAt === null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getRequestById: (id: string): QuoteRequest | undefined => {
    return db.quoteRequests.find((q) => q.id === id && q.deletedAt === null);
  },

  createRequest: (params: {
    customer: { name: string; phone: string; whatsapp?: string; businessName?: string; city?: string; email?: string };
    items: Array<{ productId: string; variantId: string; quantity: number }>;
    installationRequired: boolean;
    amcRequired: boolean;
    deliveryCity: string;
    siteConstraints?: string;
    notes?: string;
    branchId?: string;
  }): QuoteRequest => {
    const customer = customerService.upsert(params.customer);
    const nextNum = String(db.quoteRequests.length + 382).padStart(5, '0');
    const quoteReqId = `QR-2026-${nextNum}`;

    const newReq: QuoteRequest = {
      id: quoteReqId,
      tenantId: db.tenant.id,
      customerId: customer.id,
      branchId: params.branchId || db.branches[0].id,
      items: params.items,
      installationRequired: params.installationRequired,
      amcRequired: params.amcRequired,
      deliveryCity: params.deliveryCity,
      siteConstraints: params.siteConstraints,
      notes: params.notes,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    db.quoteRequests.unshift(newReq);

    // Also auto-create a lead for the sales desk
    leadService.create({
      customer: params.customer,
      source: 'website',
      inquiryType: 'product',
      message: `Inbound Quote Request ${quoteReqId} for ${params.items.length} product lines. Delivery to ${params.deliveryCity}.`,
    });

    analyticsService.log({
      eventName: 'quote_submitted',
      entityType: 'quote',
      entityId: quoteReqId,
      metadata: { itemsCount: params.items.length, city: params.deliveryCity },
    });

    persist();
    return newReq;
  },

  getFormalQuotes: (): Quote[] => {
    return db.quotes
      .filter((q) => q.deletedAt === null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getFormalQuoteById: (id: string): Quote | undefined => {
    return db.quotes.find((q) => q.id === id && q.deletedAt === null);
  },

  createFormalQuote: (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Quote => {
    const nextNum = String(db.quotes.length + 483).padStart(5, '0');
    const newQuote: Quote = {
      id: `QT-2026-${nextNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      ...quoteData,
    };
    db.quotes.unshift(newQuote);

    auditService.log({
      tenantId: newQuote.tenantId,
      userId: 'admin',
      userName: quoteData.assignedStaff || 'Sales Desk',
      action: 'create',
      entity: 'quote',
      entityId: newQuote.id,
      after: { grandTotal: newQuote.grandTotal, customerId: newQuote.customerId },
    });

    persist();
    return newQuote;
  },

  updateFormalQuoteStatus: (quoteId: string, status: Quote['status'], actor: string = 'Staff'): boolean => {
    const q = db.quotes.find((item) => item.id === quoteId);
    if (!q) return false;

    const oldStatus = q.status;
    q.status = status;
    q.updatedAt = new Date().toISOString();

    auditService.log({
      tenantId: q.tenantId,
      userId: 'admin',
      userName: actor,
      action: 'status_change',
      entity: 'quote',
      entityId: q.id,
      before: { status: oldStatus },
      after: { status },
    });

    persist();
    return true;
  },
};

// -------------------------------------------------------------
// BRANCH, CATEGORY, BRAND & CMS
// -------------------------------------------------------------

export const branchService = {
  getAll: (): Branch[] => db.branches.filter((b) => b.deletedAt === null),
  getById: (id: string): Branch | undefined => db.branches.find((b) => b.id === id && b.deletedAt === null),
};

export const categoryService = {
  getAll: (): Category[] => db.categories.filter((c) => c.deletedAt === null).sort((a, b) => a.sortOrder - b.sortOrder),
  getBySlug: (slug: string): Category | undefined => db.categories.find((c) => c.slug === slug && c.deletedAt === null),
};

export const brandService = {
  getAll: (): Brand[] => db.brands.filter((b) => b.deletedAt === null),
  getBySlug: (slug: string): Brand | undefined => db.brands.find((b) => b.slug === slug && b.deletedAt === null),
};

export const cmsService = {
  getTenant: (): Tenant => db.tenant,
  getFAQs: (): FAQItem[] => db.faqs,
  getTestimonials: (): Testimonial[] => db.testimonials,
  getGallery: (): GalleryItem[] => db.gallery,
  getOffers: (): OfferItem[] => db.offers,
  getIndustries: (): IndustryItem[] => db.industries,
  getServices: (): ServiceItem[] => db.services,
};

// -------------------------------------------------------------
// ANALYTICS & AUDIT LOGS
// -------------------------------------------------------------

export const analyticsService = {
  log: (event: {
    eventName: AnalyticsEventType;
    entityType?: AnalyticsEvent['entityType'];
    entityId?: string;
    metadata?: Record<string, any>;
  }) => {
    const newEvent: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tenantId: db.tenant.id,
      sessionId: typeof window !== 'undefined' ? (sessionStorage.getItem('ff_sid') || 'sess-anon') : 'sess-ssr',
      eventName: event.eventName,
      entityType: event.entityType,
      entityId: event.entityId,
      metadata: event.metadata,
      timestamp: new Date().toISOString(),
    };
    db.analyticsEvents.push(newEvent);
    if (db.analyticsEvents.length > 500) {
      db.analyticsEvents = db.analyticsEvents.slice(-500);
    }
    persist();
  },

  getFunnelMetrics: () => {
    const totalProducts = db.products.filter((p) => p.deletedAt === null).length;
    const totalLeads = db.leads.filter((l) => l.deletedAt === null).length;
    const totalQuotes = db.quotes.filter((q) => q.deletedAt === null).length;
    const totalQuoteRequests = db.quoteRequests.filter((q) => q.deletedAt === null).length;
    const pipelineValue = db.quotes
      .filter((q) => q.deletedAt === null && (q.status === 'sent' || q.status === 'negotiating' || q.status === 'accepted'))
      .reduce((acc, q) => acc + q.grandTotal, 0);

    const wonCount = db.quotes.filter((q) => q.status === 'accepted').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 18;

    return {
      visitorsEstimate: 1420,
      productViews: 680,
      whatsappClicks: 94,
      totalLeads,
      totalQuoteRequests,
      totalQuotes,
      pipelineValue,
      conversionRate,
      activeProductsCount: totalProducts,
    };
  },
};

export const auditService = {
  log: (logEntry: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...logEntry,
    };
    db.auditLogs.unshift(newLog);
    if (db.auditLogs.length > 100) {
      db.auditLogs = db.auditLogs.slice(0, 100);
    }
    persist();
  },

  getAll: (): AuditLog[] => db.auditLogs,
};
