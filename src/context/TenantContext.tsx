// src/context/TenantContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, Branch } from '@/types';
import { mockTenant } from '@/lib/mockData';
import { branchService } from '@/lib/store';

interface TenantContextType {
  tenant: Tenant;
  selectedBranch: Branch;
  setSelectedBranch: (branch: Branch) => void;
  branches: Branch[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant>(mockTenant);
  const [branches, setBranches] = useState<Branch[]>(mockTenant.branches);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(mockTenant.branches[0]);

  useEffect(() => {
    const loadedBranches = branchService.getAll();
    if (loadedBranches.length > 0) {
      setBranches(loadedBranches);
      setSelectedBranch(loadedBranches[0]);
    }
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, selectedBranch, setSelectedBranch, branches }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
