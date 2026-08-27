// src/services/pricingService.ts
import { ProductVariant, Customer, QuoteLineItem } from '@/types';

export interface PricingOptions {
  customer?: Partial<Customer>;
  installationRequired?: boolean;
  amcRequired?: boolean;
  deliveryCity?: string;
  customDiscountPercent?: number;
}

export interface CalculatedQuoteProposal {
  lineItems: QuoteLineItem[];
  subtotal: number;
  totalDiscount: number;
  installationFee: number;
  deliveryFee: number;
  amcFee: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
}

/**
 * Commercial Pricing Rule Engine
 * Calculates Tiered Bulk Discounts, Addon Fees, and Taxes
 */
export function calculateCommercialPricing(
  items: Array<{ product: { id: string; name: string }; variant: ProductVariant; quantity: number }>,
  options: PricingOptions = {}
): CalculatedQuoteProposal {
  const lineItems: QuoteLineItem[] = items.map(({ product, variant, quantity }) => {
    const unitPrice = variant.offerPrice || variant.basePrice;

    // Quantity Tier Discount Matrix
    let discountPercentage = 0;
    if (quantity >= 10) {
      discountPercentage = 12; // 12% for 10+ commercial units
    } else if (quantity >= 6) {
      discountPercentage = 8;  // 8% for 6-9 units
    } else if (quantity >= 3) {
      discountPercentage = 5;  // 5% for 3-5 units
    }

    // Customer Type Tier Adjustment
    if (options.customer?.customerType === 'enterprise') {
      discountPercentage = Math.max(discountPercentage, 10);
    } else if (options.customer?.customerType === 'contractor') {
      discountPercentage = Math.max(discountPercentage, 8);
    }

    if (options.customDiscountPercent !== undefined) {
      discountPercentage = options.customDiscountPercent;
    }

    const discountAmountPerUnit = (unitPrice * discountPercentage) / 100;
    const discountedUnitPrice = Math.round(unitPrice - discountAmountPerUnit);
    const totalPrice = discountedUnitPrice * quantity;

    return {
      productId: product.id,
      variantId: variant.id,
      sku: variant.sku,
      productName: product.name,
      variantName: variant.name,
      unitPrice,
      discountPercentage,
      discountedUnitPrice,
      quantity,
      totalPrice,
    };
  });

  const rawSubtotal = lineItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountedSubtotal = lineItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalDiscount = rawSubtotal - discountedSubtotal;

  const totalQuantity = lineItems.reduce((acc, item) => acc + item.quantity, 0);

  // Optional Addons
  const installationFee = options.installationRequired ? Math.max(2500, totalQuantity * 1500) : 0;
  const deliveryFee = totalQuantity > 0 ? Math.max(1500, totalQuantity * 800) : 0;
  const amcFee = options.amcRequired ? Math.round(discountedSubtotal * 0.06) : 0; // 6% annual maintenance plan

  const taxableAmount = discountedSubtotal + installationFee + deliveryFee + amcFee;
  const taxRate = 0.18; // 18% Commercial GST Standard
  const taxAmount = Math.round(taxableAmount * taxRate);
  const grandTotal = taxableAmount + taxAmount;

  return {
    lineItems,
    subtotal: rawSubtotal,
    totalDiscount,
    installationFee,
    deliveryFee,
    amcFee,
    taxRate,
    taxAmount,
    grandTotal,
  };
}
