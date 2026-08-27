// src/types/index.ts

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'contact_for_availability';

export type MediaType = 'image' | 'video' | 'brochure' | 'spec_sheet' | 'installation_photo';

export interface ProductMedia {
  id: string;
  tenantId: string;
  productId: string;
  url: string;
  type: MediaType;
  title: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  tenantId: string;
  productId: string;
  sku: string;
  name: string; // e.g. "300 Litre Single Door", "500 Litre Double Door"
  capacity: string; // "300L", "500L"
  dimensions: string; // "595 x 640 x 1850 mm"
  powerConsumption: string; // "2.4 kWh/24h"
  temperatureRange: string; // "+2°C to +8°C" or "-18°C to -22°C"
  basePrice: number;
  offerPrice?: number;
  stockStatus: StockStatus;
  isDefault: boolean;
  specOverrides?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Product {
  id: string;
  tenantId: string;
  slug: string;
  name: string;
  brandId: string;
  categoryId: string;
  subcategoryId?: string;
  shortDescription: string;
  description: string;
  features: string[];
  applications: string[];
  specifications: Record<string, string>; // Category-level baseline specs (Refrigerant, Defrost, Voltage, Controller, etc.)
  media: ProductMedia[];
  variants: ProductVariant[];
  isFeatured?: boolean;
  isNew?: boolean;
  isOffer?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Category {
  id: string;
  tenantId: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  parentId?: string; // Hierarchical categories
  operatingTempBadge: string; // e.g. "-18°C to -22°C" or "+2°C to +8°C"
  sortOrder: number;
  deletedAt: string | null;
}

export interface Brand {
  id: string;
  tenantId: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  countryOfOrigin: string;
  warrantyPolicy: string;
  isPopular?: boolean;
  deletedAt: string | null;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  businessName?: string;
  customerType: 'retail' | 'contractor' | 'hotel_restaurant' | 'enterprise';
  phone: string;
  whatsapp?: string;
  email?: string;
  city: string;
  address?: string;
  gstNumber?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type LeadSource = 'website' | 'whatsapp' | 'google' | 'instagram' | 'qr' | 'direct';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type ActivityType = 'lead_created' | 'call' | 'whatsapp' | 'email' | 'note' | 'quote_created' | 'status_changed';

export interface LeadActivity {
  id: string;
  tenantId: string;
  leadId: string;
  type: ActivityType;
  description: string;
  performedBy?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface Lead {
  id: string;
  tenantId: string;
  customerId: string;
  branchId?: string;
  source: LeadSource;
  inquiryType: 'general' | 'product' | 'service' | 'amc';
  productId?: string;
  variantId?: string;
  message: string;
  status: LeadStatus;
  assignedStaff?: string;
  activities: LeadActivity[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface QuoteRequestItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface QuoteRequest {
  id: string; // "QR-2026-XXXX"
  tenantId: string;
  customerId: string;
  branchId?: string;
  items: QuoteRequestItem[];
  installationRequired: boolean;
  amcRequired: boolean;
  deliveryCity: string;
  siteConstraints?: string;
  notes?: string;
  status: 'submitted' | 'reviewed' | 'converted_to_quote' | 'archived';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface QuoteLineItem {
  productId: string;
  variantId: string;
  sku: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  discountPercentage: number;
  discountedUnitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'negotiating' | 'accepted' | 'declined' | 'expired';

export interface Quote {
  id: string; // "QT-2026-XXXX"
  quoteRequestId?: string;
  tenantId: string;
  customerId: string;
  branchId?: string;
  version: number;
  lineItems: QuoteLineItem[];
  subtotal: number;
  totalDiscount: number;
  installationFee: number;
  deliveryFee: number;
  amcFee: number;
  taxRate: number; // e.g. 0.18 for 18%
  taxAmount: number;
  grandTotal: number;
  validUntil: string;
  termsAndConditions: string[];
  status: QuoteStatus;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  coordinates: { lat: number; lng: number };
  operatingHours: string;
  isMainBranch: boolean;
  servicesOffered: string[];
  createdAt: string;
  deletedAt: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  customDomain?: string;
  logo: string;
  currency: string;
  currencySymbol: string;
  defaultTaxRate: number;
  branches: Branch[];
  createdAt: string;
  deletedAt: string | null;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  businessName: string;
  city: string;
  rating: number;
  content: string;
  avatarUrl?: string;
  productReferenced?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Showroom' | 'Installation' | 'Cold Room' | 'Bakery & Cafe' | 'Supermarket';
  imageUrl: string;
  description: string;
}

export interface OfferItem {
  id: string;
  title: string;
  code: string;
  discountLabel: string;
  description: string;
  expiryDate: string;
  applicableCategory?: string;
}

export interface IndustryItem {
  id: string;
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  recommendedProducts: string[];
  caseStudy: {
    client: string;
    metrics: string;
    summary: string;
  };
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  pricingGuideline: string;
  sla: string;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'product_view'
  | 'search'
  | 'filter_used'
  | 'compare_added'
  | 'quote_started'
  | 'quote_submitted'
  | 'whatsapp_clicked'
  | 'phone_clicked'
  | 'pdf_downloaded';

export interface AnalyticsEvent {
  id: string;
  tenantId: string;
  sessionId: string;
  eventName: AnalyticsEventType;
  entityType?: 'product' | 'category' | 'quote' | 'lead' | 'branch';
  entityId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'status_change';
  entity: 'product' | 'category' | 'quote' | 'lead' | 'customer' | 'branch' | 'cms';
  entityId: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  timestamp: string;
}
