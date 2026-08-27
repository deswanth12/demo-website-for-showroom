# 🧊 FrostFlow™ Commercial Refrigeration Showroom & B2B Platform

> **Engineered for Business** — High-end commercial refrigeration showroom platform, dynamic equipment catalogue, B2B proforma quotation engine, and administrative CRM for commercial kitchen dealers and multi-branch cooling equipment showrooms.

---

## 🌟 Executive Overview

FrostFlow™ is a commercial-grade operating platform built with **Next.js 16 (Turbopack)**, **React 19**, **TypeScript**, and **Tailwind CSS**. It combines a **luxury industrial / high-end B2B machinery aesthetic** with an enterprise-ready architecture:

- **Storefront**: High-contrast product catalogue, interactive variant switcher (updating capacity, SKUs, thermal ratings, daily power draw, and price in real time), and side-by-side engineering comparison matrix.
- **B2B Quotation Engine**: Automatic tiered volume discounts (5%, 8%, 12%), optional turnkey installation & AMC maintenance packages, 18% GST calculation, and instant downloadable PDF proposals.
- **Contextual WhatsApp Integration**: Deep-linked routing directly to technical desks (`+91 77022 56073`) pre-populated with exact model SKUs and operating temperatures.
- **Admin Control Center (`/admin`)**: Commercial deal pipeline telemetry, inbound wishlist triage, 1-click conversion to formal proforma quotations, and timestamped Lead CRM communication history.
- **Multi-Branch Multi-Tenant Architecture**: Out-of-the-box routing across regional showrooms in **Mumbai HQ**, **Bengaluru**, and **Delhi NCR**.

---

## 🎨 Luxury Industrial Design System

Built on the **Obsidian Chill** design language inspired by luxury industrial presentation:

| Palette Role | Color Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary** | Obsidian | `#080B10` | Dark Hero, Navbar, Major CTAs, Machinery Studio backdrop |
| **Secondary** | Graphite | `#11161D` | Surface cards, elevated containers, admin headers |
| **Tertiary** | Steel | `#202832` | Structural borders and subtle dividers |
| **Background** | Off-White | `#F4F5F7` | 70% light, airy surfaces with generous whitespace |
| **Muted Text** | Silver / Slate | `#A8B0BA` / `#475569` | Monospace telemetry, brand eyebrows, sub-labels |
| **Highlight** | Ice Blue | `#8DD8E8` | Secondary thermal indicators and typography accents |
| **Functional Accent** | Accent Cyan | `#27C7D9` | Sparingly used for primary quote actions & active tags |

---

## 🚀 Key Platform Features

### 1. Interactive Equipment Catalogue & Variant Selector
- **Dynamic Variant Switching**: Toggle between 350L, 500L, 1000L, or custom sizes to watch SKU, physical dimensions ($W \times D \times H$), daily power consumption, and price recalculate on the fly.
- **Datasheet Generator**: Download official client-side technical spec sheets in PDF format powered by `jspdf`.
- **Multi-Faceted Filtering**: Search by keyword, category, temperature zone (Freezer: $-18^\circ\text{C}$ to $-25^\circ\text{C}$ vs Chiller: $+1^\circ\text{C}$ to $+8^\circ\text{C}$), brand, and stock status.

### 2. Side-by-Side Engineering Comparison Matrix (`/compare`)
- Compare up to 4 models concurrently.
- Toggle **"Highlight Differences"** to quickly identify discrepancies in refrigerant gases (e.g. eco-friendly R290), power draw, or controller types.

### 3. Rule-Based B2B Pricing Engine (`src/services/pricingService.ts`)
- **Tier 1 (3–5 Units)**: 5% volume discount
- **Tier 2 (6–9 Units)**: 8% volume discount
- **Tier 3 (10+ Units)**: 12% bulk discount
- Automatic calculation of turnkey site unloading, 1-year AMC maintenance, delivery fees, and 18% standard GST.

### 4. Admin Management & CRM Suite (`/admin`)
- **Conversion Funnel Telemetry**: Real-time tracking from *Storefront Visitors $\rightarrow$ Spec Views $\rightarrow$ WhatsApp Inquiries $\rightarrow$ Quote Requests $\rightarrow$ Deals Won*.
- **Quote Requests to Formal Proposals**: 1-click conversion from inbound customer wishlists (`QR-2026-XXXX`) into official commercial proforma quotes (`QT-2026-XXXX`).
- **Lead CRM & Activity Timeline**: Timestamped logging of phone calls, WhatsApp messages, site surveys, and internal notes.
- **Catalog Management & Soft Deletion**: Non-destructive product deletion (`deletedAt`) with immutable audit logging.

---

## 🗺️ Key Routes & Architecture

| Route | Purpose & Description |
| :--- | :--- |
| **`/`** | Dark industrial hero, category matrix, featured equipment, industry hubs, and showroom map. |
| **`/products`** | Comprehensive equipment catalogue with sidebar facet filters, sorting, and search. |
| **`/products/[slug]`** | High-res media gallery, variant switcher, spec matrix table, and downloadable PDF datasheets. |
| **`/compare`** | Side-by-side technical comparison table with difference highlighting. |
| **`/quote`** | Multi-item B2B quote request checkout with instant reference ID generation. |
| **`/admin`** | Executive dashboard, lead CRM, quote manager, customer directory, and audit logs. |
| **`/industries/[slug]`** | Dedicated hubs for Restaurants, Supermarkets, Bakeries, and Cold Storage Logistics. |
| **`/services/[slug]`** | Turnkey Cold Room Installation, Annual Maintenance Contracts (AMC), and Emergency Repairs. |
| **`/locations`** | Multi-branch showroom directory with operating hours and direct contact links. |
| **`/gallery`** | Real-world showroom and commercial installation photo showcase with full-screen lightbox. |
| **`/offers`** | Seasonal commercial discounts and promotional coupon codes. |
| **`/contact`** | Direct consultation booking and general showroom inquiries. |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.2.12 (App Router & Turbopack)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **PDF Generation**: `jspdf`
- **Typography**: Inter (UI / Marketing) & JetBrains Mono (Technical Telemetry)
- **Language**: TypeScript 5 (Strict Mode)

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18.17+ or 20+
- npm / pnpm / yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/deswanth12/demo-website-for-showroom.git
cd demo-website-for-showroom

# 2. Install dependencies
npm install

# 3. Run development server with Turbopack
npm run dev

# 4. Production build verification
npm run build
npm run start
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📞 Support & Dealer Inquiries

For technical consultations or commercial showroom equipment sizing:
- **Phone / WhatsApp**: [+91 77022 56073](https://wa.me/917702256073)
- **Email**: `sales@frostflow.com`
- **Regional Showrooms**: Mumbai (Andheri East HQ), Bengaluru (Koramangala), New Delhi (Okhla Industrial Area)

---

© 2026 FrostFlow Commercial Refrigeration Systems. All rights reserved.
