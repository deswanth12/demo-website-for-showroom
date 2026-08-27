// src/lib/integrations/whatsapp.ts
import { Product, ProductVariant, Branch, QuoteRequest, Quote } from '@/types';

export function cleanPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Generates direct WhatsApp click-to-chat URL for an individual product inquiry
 */
export function getWhatsAppProductInquiryUrl(
  phone: string,
  product: Product,
  variant?: ProductVariant,
  branch?: Branch
): string {
  const targetPhone = cleanPhone(phone || '917702256073');
  const activeVariant = variant || product.variants.find((v) => v.isDefault) || product.variants[0];

  const lines = [
    `🧊 *Commercial Refrigeration Inquiry*`,
    `--------------------------------`,
    `*Product:* ${product.name}`,
    `*Model SKU:* ${activeVariant.sku}`,
    `*Capacity:* ${activeVariant.capacity}`,
    `*Temp Range:* ${activeVariant.temperatureRange}`,
    `*Price Est:* ₹${(activeVariant.offerPrice || activeVariant.basePrice).toLocaleString('en-IN')}`,
    branch ? `*Preferred Branch:* ${branch.name} (${branch.city})` : '',
    ``,
    `Hi FrostFlow Team, I'd like to check commercial availability, bulk discount, and delivery timeline for this unit.`,
  ].filter(Boolean);

  const encodedMessage = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${targetPhone}?text=${encodedMessage}`;
}

/**
 * Generates direct WhatsApp link for an inbound Quote Request
 */
export function getWhatsAppQuoteRequestUrl(
  phone: string,
  quoteRequest: QuoteRequest,
  customerName: string,
  itemsList: Array<{ name: string; variantName: string; quantity: number }>
): string {
  const targetPhone = cleanPhone(phone || '917702256073');

  const lines = [
    `📋 *New B2B Quotation Request* [${quoteRequest.id}]`,
    `--------------------------------`,
    `*Customer:* ${customerName}`,
    `*Delivery City:* ${quoteRequest.deliveryCity}`,
    `*Installation Required:* ${quoteRequest.installationRequired ? 'Yes' : 'No'}`,
    `*AMC Coverage:* ${quoteRequest.amcRequired ? 'Yes' : 'No'}`,
    ``,
    `*Requested Units:*`,
    ...itemsList.map((item, idx) => `${idx + 1}. ${item.name} (${item.variantName}) × ${item.quantity} units`),
    quoteRequest.notes ? `\n*Site Constraints / Notes:* ${quoteRequest.notes}` : '',
    ``,
    `Hi Sales Team, please share the official proforma quotation for this request.`,
  ].filter(Boolean);

  const encodedMessage = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${targetPhone}?text=${encodedMessage}`;
}

/**
 * Generates direct WhatsApp URL for a formal generated quotation
 */
export function getWhatsAppFormalQuoteUrl(
  phone: string,
  quote: Quote,
  customerName: string
): string {
  const targetPhone = cleanPhone(phone || '917702256073');

  const lines = [
    `💼 *Official Quotation Follow-up* [${quote.id}]`,
    `--------------------------------`,
    `*Customer:* ${customerName}`,
    `*Grand Total:* ₹${quote.grandTotal.toLocaleString('en-IN')} (Incl. Taxes)`,
    `*Valid Until:* ${quote.validUntil}`,
    `*Status:* ${quote.status.toUpperCase()}`,
    ``,
    `Hi, regarding Quote ${quote.id}, let me know if you would like to finalize commercial terms or schedule delivery.`,
  ];

  const encodedMessage = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${targetPhone}?text=${encodedMessage}`;
}

/**
 * General direct WhatsApp specialist chat URL
 */
export function getWhatsAppGeneralUrl(phone: string, customMessage?: string): string {
  const targetPhone = cleanPhone(phone || '917702256073');
  const defaultMsg = `Hi FrostFlow Commercial Refrigeration, I need assistance choosing refrigeration equipment for my business.`;
  const encoded = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${targetPhone}?text=${encoded}`;
}
