// src/context/QuoteCartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/types';

export interface QuoteCartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface QuoteCartContextType {
  items: QuoteCartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const QuoteCartContext = createContext<QuoteCartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'frostflow_quote_cart';

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteCartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load quote cart', e);
    }
  }, []);

  const saveCart = (newItems: QuoteCartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error('Failed to save quote cart', e);
    }
  };

  const addItem = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    const existingIndex = items.findIndex((i) => i.variant.id === variant.id);
    let updated: QuoteCartItem[];
    if (existingIndex >= 0) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...items, { product, variant, quantity }];
    }
    saveCart(updated);
    setIsDrawerOpen(true);
  };

  const removeItem = (variantId: string) => {
    const updated = items.filter((i) => i.variant.id !== variantId);
    saveCart(updated);
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    const updated = items.map((i) => (i.variant.id === variantId ? { ...i, quantity } : i));
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <QuoteCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);
  if (!context) {
    throw new Error('useQuoteCart must be used within a QuoteCartProvider');
  }
  return context;
}
