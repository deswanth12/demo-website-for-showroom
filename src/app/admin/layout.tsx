// src/app/admin/layout.tsx
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#070A0F]">{children}</div>;
}
