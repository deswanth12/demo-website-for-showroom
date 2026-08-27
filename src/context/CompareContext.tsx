// src/context/CompareContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/types';

export interface CompareItem {
  product: Product;
  variant: ProductVariant;
}

interface CompareContextType {
  compareItems: CompareItem[];
  addToCompare: (product: Product, variant?: ProductVariant) => boolean;
  removeFromCompare: (variantId: string) => void;
  isInCompare: (variantId: string) => boolean;
  clearCompare: () => void;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const COMPARE_STORAGE_KEY = 'frostflow_compare_tray';

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (saved) {
        setCompareItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load compare tray', e);
    }
  }, []);

  const saveCompare = (items: CompareItem[]) => {
    setCompareItems(items);
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save compare items', e);
    }
  };

  const addToCompare = (product: Product, variant?: ProductVariant): boolean => {
    const activeVariant = variant || product.variants.find((v) => v.isDefault) || product.variants[0];
    if (compareItems.some((i) => i.variant.id === activeVariant.id)) {
      removeFromCompare(activeVariant.id);
      return false;
    }
    if (compareItems.length >= 4) {
      alert('You can compare a maximum of 4 commercial refrigeration units at once.');
      return false;
    }
    const updated = [...compareItems, { product, variant: activeVariant }];
    saveCompare(updated);
    return true;
  };

  const removeFromCompare = (variantId: string) => {
    const updated = compareItems.filter((i) => i.variant.id !== variantId);
    saveCompare(updated);
  };

  const isInCompare = (variantId: string) => {
    return compareItems.some((i) => i.variant.id === variantId);
  };

  const clearCompare = () => {
    saveCompare([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        compareCount: compareItems.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
