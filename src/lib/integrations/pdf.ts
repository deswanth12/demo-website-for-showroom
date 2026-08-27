// src/lib/integrations/pdf.ts
import { jsPDF } from 'jspdf';
import { Product, ProductVariant, Quote, Customer, Branch } from '@/types';

/**
 * Generates and triggers download of a technical product specification sheet
 */
export function generateProductSpecSheetPDF(
  product: Product,
  variant: ProductVariant,
  branch?: Branch
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner (Obsidian & Cyan)
  doc.setFillColor(16, 20, 23); // #101417
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Accent Line
  doc.setFillColor(0, 240, 255); // #00F0FF
  doc.rect(0, 38, pageWidth, 2, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('FROSTFLOW COMMERCIAL REFRIGERATION', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(0, 240, 255);
  doc.text('TECHNICAL SPECIFICATION & DATASHEET', 14, 30);

  // Product Name & SKU
  doc.setTextColor(20, 25, 30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(product.name, 14, 52);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 110, 120);
  doc.text(`Variant: ${variant.name}  |  SKU: ${variant.sku}`, 14, 60);

  // Divider
  doc.setDrawColor(220, 225, 230);
  doc.line(14, 66, pageWidth - 14, 66);

  // Key Parameters Grid
  let y = 78;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 20, 23);
  doc.text('PRIMARY ENGINEERING SPECIFICATIONS', 14, y);

  y += 10;
  const specs = [
    ['Capacity / Volume', variant.capacity],
    ['Operating Temperature', variant.temperatureRange],
    ['Dimensions (W × D × H)', variant.dimensions],
    ['Power Consumption', variant.powerConsumption],
    ['Stock Availability', variant.stockStatus.replace(/_/g, ' ').toUpperCase()],
    ['Estimated Base Price', `₹${variant.basePrice.toLocaleString('en-IN')}`],
    ...Object.entries(product.specifications),
  ];

  doc.setFontSize(10);
  specs.forEach(([label, value], index) => {
    // Alternating background for rows
    if (index % 2 === 0) {
      doc.setFillColor(245, 248, 250);
      doc.rect(14, y - 5, pageWidth - 28, 8, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 60, 70);
    doc.text(label, 18, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 25, 30);
    doc.text(String(value), 105, y);

    y += 9;
  });

  // Features
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(16, 20, 23);
  doc.text('COMMERCIAL GRADE FEATURES', 14, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 70, 80);
  product.features.forEach((feat) => {
    doc.text(`•  ${feat}`, 18, y);
    y += 7;
  });

  // Footer / Dealer Contact
  const footerY = 270;
  doc.setDrawColor(220, 225, 230);
  doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

  doc.setFontSize(9);
  doc.setTextColor(100, 110, 120);
  doc.text(
    `FrostFlow Commercial Systems | Showroom Support: ${branch?.phone || '+91 77022 56073'} | WhatsApp: ${branch?.whatsapp || '917702256073'}`,
    14,
    footerY
  );
  doc.text(
    `Specifications are subject to manufacturer updates. Generated on: ${new Date().toLocaleDateString('en-IN')}`,
    14,
    footerY + 6
  );

  doc.save(`${variant.sku}-Specification-Sheet.pdf`);
}

/**
 * Generates an official B2B Commercial Quotation PDF
 */
export function generateFormalQuotePDF(
  quote: Quote,
  customer: Customer,
  branch?: Branch
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(16, 20, 23);
  doc.rect(0, 0, pageWidth, 45, 'F');
  doc.setFillColor(0, 240, 255);
  doc.rect(0, 43, pageWidth, 2, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('FROSTFLOW COMMERCIAL REFRIGERATION', 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(0, 240, 255);
  doc.text(`COMMERCIAL PROFORMA QUOTATION #${quote.id}`, 14, 28);
  doc.setTextColor(180, 190, 200);
  doc.text(`Date: ${new Date(quote.createdAt).toLocaleDateString('en-IN')} | Valid Until: ${quote.validUntil}`, 14, 37);

  // Customer & Showroom Info Blocks
  let y = 58;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 20, 23);
  doc.text('BILL TO / BUYER:', 14, y);
  doc.text('SUPPLIER / SHOWROOM:', 110, y);

  y += 7;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 60, 70);

  doc.text(`Name: ${customer.name}`, 14, y);
  doc.text(`Showroom: ${branch?.name || 'FrostFlow HQ Showroom'}`, 110, y);
  y += 6;

  doc.text(`Business: ${customer.businessName || 'Commercial Client'}`, 14, y);
  doc.text(`Phone: ${branch?.phone || '+91 77022 56073'}`, 110, y);
  y += 6;

  doc.text(`Phone: ${customer.phone}`, 14, y);
  doc.text(`Email: ${branch?.email || 'sales@frostflow.com'}`, 110, y);
  y += 6;

  doc.text(`City: ${customer.city}`, 14, y);
  doc.text(`Doc Type: Proforma Quote (Demo Concept)`, 110, y);
  y += 12;

  // Table Header
  doc.setFillColor(235, 240, 245);
  doc.rect(14, y - 5, pageWidth - 28, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 30, 40);

  doc.text('SKU / Item Description', 16, y);
  doc.text('Qty', 115, y);
  doc.text('Unit Price', 130, y);
  doc.text('Disc %', 158, y);
  doc.text('Total (₹)', 175, y);

  y += 9;
  doc.setFont('helvetica', 'normal');

  quote.lineItems.forEach((item) => {
    doc.text(`${item.sku} - ${item.productName} (${item.variantName})`, 16, y);
    doc.text(String(item.quantity), 117, y);
    doc.text(`₹${item.unitPrice.toLocaleString('en-IN')}`, 130, y);
    doc.text(`${item.discountPercentage}%`, 160, y);
    doc.text(`₹${item.totalPrice.toLocaleString('en-IN')}`, 175, y);
    y += 8;
  });

  // Divider
  doc.setDrawColor(200, 205, 210);
  doc.line(14, y + 2, pageWidth - 14, y + 2);
  y += 10;

  // Summary Totals
  const rightX = 130;
  const valX = 175;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('Item Subtotal:', rightX, y);
  doc.text(`₹${quote.subtotal.toLocaleString('en-IN')}`, valX, y);
  y += 6;

  if (quote.totalDiscount > 0) {
    doc.setTextColor(0, 150, 100);
    doc.text('Tier Volume Discount:', rightX, y);
    doc.text(`- ₹${quote.totalDiscount.toLocaleString('en-IN')}`, valX, y);
    doc.setTextColor(50, 60, 70);
    y += 6;
  }

  if (quote.installationFee > 0) {
    doc.text('Installation & Commissioning:', rightX, y);
    doc.text(`₹${quote.installationFee.toLocaleString('en-IN')}`, valX, y);
    y += 6;
  }

  if (quote.deliveryFee > 0) {
    doc.text('Commercial Freight / Delivery:', rightX, y);
    doc.text(`₹${quote.deliveryFee.toLocaleString('en-IN')}`, valX, y);
    y += 6;
  }

  if (quote.amcFee > 0) {
    doc.text('1-Year Comprehensive AMC:', rightX, y);
    doc.text(`₹${quote.amcFee.toLocaleString('en-IN')}`, valX, y);
    y += 6;
  }

  doc.text(`GST (${(quote.taxRate * 100).toFixed(0)}%):`, rightX, y);
  doc.text(`₹${quote.taxAmount.toLocaleString('en-IN')}`, valX, y);
  y += 8;

  // Grand Total Box
  doc.setFillColor(16, 20, 23);
  doc.rect(rightX - 5, y - 5, pageWidth - rightX - 9, 10, 'F');
  doc.setTextColor(0, 240, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('GRAND TOTAL:', rightX, y + 2);
  doc.text(`₹${quote.grandTotal.toLocaleString('en-IN')}`, valX - 2, y + 2);

  // Terms & Conditions
  y += 20;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 20, 23);
  doc.text('TERMS & CONDITIONS:', 14, y);

  y += 6;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 90, 100);
  (quote.termsAndConditions || [
    'Payment: 50% advance along with confirmed order, 50% prior to dispatch.',
    'Delivery: Standard delivery within 3-5 business days upon receipt of advance.',
    'Warranty: Standard 1-Year Comprehensive + 4-Year Compressor manufacturer warranty.',
    'Electrical: 230V 50Hz single phase / 415V 3-phase stabilized supply to be provided by client.',
  ]).forEach((term) => {
    doc.text(`•  ${term}`, 16, y);
    y += 5;
  });

  doc.save(`${quote.id}-Commercial-Quotation.pdf`);
}
