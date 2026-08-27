// src/app/products/page.tsx
'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Snowflake,
  X,
  RefreshCw,
} from 'lucide-react';
import { productService, categoryService, brandService } from '@/lib/store';
import ProductCard from '@/components/products/ProductCard';
import { ProductFilterOptions } from '@/lib/store';

function ProductsCatalogueContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [categoryId, setCategoryId] = useState<string>(initialCategory);
  const [brandId, setBrandId] = useState<string>(initialBrand);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [temperatureZone, setTemperatureZone] = useState<'all' | 'freezer' | 'chiller'>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low_high' | 'price_high_low' | 'name_asc'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = categoryService.getAll();
  const brands = brandService.getAll();

  useEffect(() => {
    if (searchParams.get('category')) setCategoryId(searchParams.get('category') || 'all');
    if (searchParams.get('brand')) setBrandId(searchParams.get('brand') || 'all');
    if (searchParams.get('search')) setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const selectedCategoryObj = categories.find((c) => c.slug === categoryId);

  const products = useMemo(() => {
    const filterOptions: ProductFilterOptions = {
      categoryId: selectedCategoryObj ? selectedCategoryObj.id : undefined,
      brandId: brandId !== 'all' ? brandId : undefined,
      searchQuery,
      temperatureZone,
      inStockOnly,
      sortBy,
    };
    return productService.getAll(filterOptions);
  }, [selectedCategoryObj, brandId, searchQuery, temperatureZone, inStockOnly, sortBy]);

  const resetFilters = () => {
    setCategoryId('all');
    setBrandId('all');
    setSearchQuery('');
    setTemperatureZone('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    categoryId !== 'all' ||
    brandId !== 'all' ||
    searchQuery.trim() !== '' ||
    temperatureZone !== 'all' ||
    inStockOnly;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 bg-[#F8FAFC]">
      {/* Header & Title */}
      <div className="border-b border-[#E2E8F0] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono-data uppercase tracking-wider text-[#0284C7] font-bold">
            Commercial Cooling Inventory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-1">
            Equipment Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Display visi coolers, deep freezers, ice makers, and walk-in cold rooms with instant B2B quotation.
          </p>
        </div>

        {/* Results Counter & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <span className="font-mono-data text-xs font-semibold text-slate-700 bg-white border border-[#CBD5E1] px-3.5 py-2 rounded-lg shadow-sm">
            Showing <strong className="text-[#0F172A]">{products.length}</strong> equipment model(s)
          </span>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 rounded-lg bg-[#0B1220] px-4 py-2 text-xs font-bold text-white shadow-sm"
          >
            <Filter className="h-3.5 w-3.5 text-[#22D3EE]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR FILTERS (Clean White Surfaces) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block fixed inset-0 z-50 bg-[#F8FAFC] p-6 overflow-y-auto' : 'hidden'
          }`}
        >
          {mobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8F0] lg:hidden">
              <h3 className="font-bold text-[#0F172A] text-base">Filter Equipment</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="space-y-5">
            {/* Search Input */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Keyword / SKU Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. 500L, VC-500, R290..."
                  className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 focus:border-[#22D3EE] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                Product Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setCategoryId('all')}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-colors ${
                    categoryId === 'all'
                      ? 'bg-[#0B1220] text-white font-bold'
                      : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategoryId(c.slug)}
                    className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                      categoryId === c.slug
                        ? 'bg-[#0B1220] text-white font-bold'
                        : 'text-slate-600 hover:text-black hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Zone Filter */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                Operating Temperature Zone
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'All', val: 'all' },
                  { label: 'Freezer', val: 'freezer' },
                  { label: 'Chiller', val: 'chiller' },
                ].map((tz) => (
                  <button
                    key={tz.val}
                    onClick={() => setTemperatureZone(tz.val as any)}
                    className={`rounded-lg py-2 text-center text-xs font-medium transition-all ${
                      temperatureZone === tz.val
                        ? 'bg-[#0B1220] text-white font-bold'
                        : 'bg-[#F8FAFC] border border-[#E2E8F0] text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {tz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                Brand
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setBrandId('all')}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-colors ${
                    brandId === 'all'
                      ? 'bg-[#0B1220] text-white font-bold'
                      : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBrandId(b.id)}
                    className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-colors ${
                      brandId === b.id
                        ? 'bg-[#0B1220] text-white font-bold'
                        : 'text-slate-600 hover:text-black hover:bg-slate-50'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability Toggle */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold text-slate-700">In-Stock Units Only</span>
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`h-6 w-11 rounded-full transition-colors relative ${
                  inStockOnly ? 'bg-[#16A34A]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    inStockOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-all shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}

            {/* Mobile Apply Button */}
            {mobileFilterOpen && (
              <div className="sticky bottom-0 pt-4 pb-2 bg-[#F8FAFC] border-t border-[#E2E8F0] lg:hidden">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full rounded-lg bg-[#27C7D9] py-3 text-xs uppercase tracking-wider font-extrabold text-[#080B10] shadow-md"
                >
                  Apply Filters ({products.length} Units)
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN PRODUCT CATALOGUE GRID */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips & Sort Selector */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            {/* Active Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {categoryId !== 'all' && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E0F2FE] border border-[#BAE6FD] px-2.5 py-1 text-xs font-medium text-[#0284C7]">
                  <span>Category: {selectedCategoryObj?.name}</span>
                  <button onClick={() => setCategoryId('all')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {temperatureZone !== 'all' && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E0F2FE] border border-[#BAE6FD] px-2.5 py-1 text-xs font-medium text-[#0284C7]">
                  <span>Zone: {temperatureZone}</span>
                  <button onClick={() => setTemperatureZone('all')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E0F2FE] border border-[#BAE6FD] px-2.5 py-1 text-xs font-medium text-[#0284C7]">
                  <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                  <button onClick={() => setSearchQuery('')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {!hasActiveFilters && (
                <span className="text-xs text-slate-500 font-medium">All commercial units shown</span>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 shrink-0 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-1.5 text-xs text-[#0F172A] font-semibold focus:border-[#22D3EE] focus:bg-white focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="name_asc">Model Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center flex flex-col items-center shadow-sm">
              <Snowflake className="h-12 w-12 text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-[#0F172A]">No commercial equipment matched your criteria</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Try widening your search terms or resetting filters to browse all standard units.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 rounded-lg bg-[#22D3EE] px-5 py-2.5 text-xs font-bold text-[#0B1220] hover:bg-[#06B6D4]"
              >
                Clear Search & Show All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Equipment Catalogue...</div>}>
      <ProductsCatalogueContent />
    </Suspense>
  );
}
