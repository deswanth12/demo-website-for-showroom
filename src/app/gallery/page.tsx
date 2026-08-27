// src/app/gallery/page.tsx
'use client';

import React, { useState } from 'react';
import { cmsService } from '@/lib/store';
import { GalleryItem } from '@/types';
import { X, ZoomIn } from 'lucide-react';

export default function GalleryPage() {
  const gallery = cmsService.getGallery();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);

  const categories = ['all', 'Showroom', 'Supermarket', 'Cold Room', 'Bakery & Cafe'];

  const filtered = selectedCategory === 'all'
    ? gallery
    : gallery.filter((g) => g.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 space-y-8 bg-[#F4F5F7]">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-6">
        <div className="text-xs font-mono-data uppercase tracking-wider text-[#0E7490] font-bold">
          Real-World Installations
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#080B10] mt-1 tracking-tight">
          Showroom & Commercial Projects Gallery
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Visual portfolio of live showroom displays, supermarket line installations, and turnkey walk-in cold rooms.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition-all ${
              selectedCategory === cat
                ? 'bg-[#080B10] text-white font-bold shadow-md'
                : 'border border-[#CBD5E1] bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            {cat === 'all' ? 'All Installations' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveLightbox(item)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E5E7EB] bg-white cursor-pointer shadow-sm"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-5 flex flex-col justify-end">
              <span className="text-[10px] font-mono-data text-[#8DD8E8] font-bold uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="text-sm font-bold text-white mt-1">{item.title}</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.description}</p>
            </div>
            <div className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full rounded-2xl border border-white/15 bg-[#080B10] overflow-hidden">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-video w-full bg-black">
              <img
                src={activeLightbox.imageUrl}
                alt={activeLightbox.title}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="p-6 text-white">
              <span className="text-xs font-mono-data text-[#8DD8E8] uppercase tracking-wider font-bold">
                {activeLightbox.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{activeLightbox.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{activeLightbox.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
