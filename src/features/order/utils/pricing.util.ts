import { TaxType } from "@shared/enums/tax-type.enum";
import { InvoiceType } from "@shared/enums/invoice-type.enum";
import { OrderItemPopulated } from "../interface/order-item.interface";
import { TaxDetail } from "../interface/tax-detail.interface";
import { BillingDetails } from "../interface/billing-details.interface";

export interface ComputedLine {
  productId: string;
  gross: number; // sellPrice * qty
  discount: number; // per-line discount in absolute ₹
  taxableValue: number; // gross - discount (after order-discount allocation)
  effectiveRate: number; // % applied to taxable value
  taxes: TaxDetail[];
  taxAmount: number;
  totalPrice: number; // taxableValue + taxAmount
}

export interface ComputedOrder {
  lines: ComputedLine[];
  /** Bill-ready order items (populated form) with recomputed fields. */
  items: OrderItemPopulated[];
  /** Billing summary suitable for backend submission. */
  billing: Required<
    Pick<
      BillingDetails,
      "subTotal" | "discounts" | "grandTotal" | "roundOff" | "finalAmount"
    >
  > & {
    taxes: TaxDetail[];
    /** Sum of all item-level discounts (excludes order-level discount). */
    itemDiscountTotal: number;
    /** Order-level discount that was applied. */
    orderDiscount: number;
    /** Sum of taxable amounts across lines (post discount). */
    taxableAmount: number;
    /** Whether this was treated as inter-state (IGST) or intra-state (CGST+SGST). */
    interState: boolean;
    /** True if tax computation was skipped (Bill of Supply / Retail). */
    taxExempt: boolean;
  };
}

export interface PricingInputs {
  items: OrderItemPopulated[];
  /** Order-level discount in absolute ₹ (allocated proportionally across lines). */
  orderDiscount?: number;
  /** State of the shop placing the invoice. */
  shopState?: string;
  /** State of the customer being invoiced. */
  customerState?: string;
  /** Type of invoice — Bill of Supply and Retail Invoice skip GST. */
  invoiceType?: InvoiceType;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Computes per-line taxes/totals and the order-level billing summary.
 * Pure: no side effects, deterministic for the same inputs.
 */
export function computeOrderTotals(input: PricingInputs): ComputedOrder {
  const {
    items,
    orderDiscount = 0,
    shopState,
    customerState,
    invoiceType,
  } = input;

  const taxExempt =
    invoiceType === InvoiceType.BILL_OF_SUPPLY ||
    invoiceType === InvoiceType.RETAIL_INVOICE;

  // Inter-state only if both states are known and differ. Default to intra-state
  // (CGST+SGST) when we don't have a customer state yet — safer for previews.
  const interState =
    !!shopState &&
    !!customerState &&
    normalize(shopState) !== normalize(customerState);

  const grossPerLine = items.map((it) =>
    round2((it.product.sellPrice || 0) * (it.quantity || 0)),
  );
  const itemDiscountPerLine = items.map((it) => round2(it.discount || 0));
  const grossTotal = grossPerLine.reduce((a, b) => a + b, 0);
  const itemDiscountTotal = itemDiscountPerLine.reduce((a, b) => a + b, 0);

  // Allocate order-level discount proportionally across lines based on their
  // post-item-discount value, so each line's GST is reduced fairly.
  const allocBase = grossPerLine.map((g, i) => g - itemDiscountPerLine[i]);
  const allocBaseTotal = allocBase.reduce((a, b) => a + b, 0);
  const orderDiscountClamped = Math.max(
    0,
    Math.min(orderDiscount, allocBaseTotal),
  );

  const lines: ComputedLine[] = items.map((it, i) => {
    const gross = grossPerLine[i];
    const itemDisc = itemDiscountPerLine[i];
    const share =
      allocBaseTotal > 0
        ? (allocBase[i] / allocBaseTotal) * orderDiscountClamped
        : 0;
    const taxableValue = round2(Math.max(0, gross - itemDisc - share));

    let taxes: TaxDetail[] = [];
    let effectiveRate = 0;
    let taxAmount = 0;

    if (!taxExempt) {
      if (interState) {
        effectiveRate = it.product.igstRate || 0;
        const amount = round2((taxableValue * effectiveRate) / 100);
        taxes = [{ type: TaxType.IGST, rate: effectiveRate, amount }];
        taxAmount = amount;
      } else {
        const cgst = it.product.cgstRate || 0;
        const sgst = it.product.sgstRate || 0;
        effectiveRate = cgst + sgst;
        const cgstAmt = round2((taxableValue * cgst) / 100);
        const sgstAmt = round2((taxableValue * sgst) / 100);
        taxes = [
          { type: TaxType.CGST, rate: cgst, amount: cgstAmt },
          { type: TaxType.SGST, rate: sgst, amount: sgstAmt },
        ];
        taxAmount = round2(cgstAmt + sgstAmt);
      }
    }

    const totalPrice = round2(taxableValue + taxAmount);

    return {
      productId: it.product._id,
      gross,
      discount: round2(itemDisc + share),
      taxableValue,
      effectiveRate,
      taxes,
      taxAmount,
      totalPrice,
    };
  });

  const taxableAmount = round2(lines.reduce((a, l) => a + l.taxableValue, 0));
  const taxTotal = round2(lines.reduce((a, l) => a + l.taxAmount, 0));

  // Aggregate taxes by (type, rate) for the order-level breakup.
  const taxBucket = new Map<string, TaxDetail>();
  for (const l of lines) {
    for (const t of l.taxes) {
      const key = `${t.type}@${t.rate}`;
      const prev = taxBucket.get(key);
      if (prev) prev.amount = round2(prev.amount + t.amount);
      else taxBucket.set(key, { ...t });
    }
  }

  const grandTotal = round2(taxableAmount + taxTotal);
  const finalAmount = Math.round(grandTotal);
  const roundOff = round2(finalAmount - grandTotal);

  // Recompose the items array with computed billing fields for backend submit.
  const enrichedItems: OrderItemPopulated[] = items.map((it, i) => ({
    ...it,
    discount: lines[i].discount,
    taxableValue: lines[i].taxableValue,
    taxes: lines[i].taxes,
    totalPrice: lines[i].totalPrice,
  }));

  return {
    lines,
    items: enrichedItems,
    billing: {
      subTotal: round2(grossTotal),
      discounts: round2(itemDiscountTotal + orderDiscountClamped),
      taxes: Array.from(taxBucket.values()),
      grandTotal,
      roundOff,
      finalAmount,
      itemDiscountTotal: round2(itemDiscountTotal),
      orderDiscount: round2(orderDiscountClamped),
      taxableAmount,
      interState,
      taxExempt,
    },
  };
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Converts a positive integer rupee amount to Indian-English words.
 * Returns "Zero Rupees Only" for 0 and an empty string for invalid input.
 */
export function amountInWords(value: number): string {
  if (!isFinite(value)) return "";
  const rupees = Math.floor(Math.abs(value));
  const paise = Math.round((Math.abs(value) - rupees) * 100);

  const words = numberToIndianWords(rupees);
  let out = words ? `${words} Rupees` : "Zero Rupees";
  if (paise > 0) out += ` and ${numberToIndianWords(paise)} Paise`;
  return `${out} Only`;
}

function numberToIndianWords(n: number): string {
  if (n === 0) return "";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const two = (num: number): string => {
    if (num < 20) return ones[num];
    const t = Math.floor(num / 10);
    const o = num % 10;
    return o === 0 ? tens[t] : `${tens[t]} ${ones[o]}`;
  };
  const three = (num: number): string => {
    const h = Math.floor(num / 100);
    const rest = num % 100;
    const parts: string[] = [];
    if (h) parts.push(`${ones[h]} Hundred`);
    if (rest) parts.push(two(rest));
    return parts.join(" ");
  };

  const parts: string[] = [];
  const crore = Math.floor(n / 10_000_000);
  n %= 10_000_000;
  const lakh = Math.floor(n / 100_000);
  n %= 100_000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const rest = n;

  if (crore) parts.push(`${three(crore)} Crore`);
  if (lakh) parts.push(`${three(lakh)} Lakh`);
  if (thousand) parts.push(`${three(thousand)} Thousand`);
  if (rest) parts.push(three(rest));
  return parts.join(" ").trim();
}
