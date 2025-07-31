// /lib/formatting.ts

export type SupportedCurrency = 'ZAR' | 'USD' | 'EUR' | 'GBP';

export function formatCurrency(value: number, currency: SupportedCurrency = 'ZAR'): string {
  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
}

export function getCurrencySymbol(currency: SupportedCurrency = 'ZAR'): string {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'ZAR':
    default: return 'R';
  }
}

export function calculateVatInclusive(amount: number, vatRate: number = 15): {
  subtotal: number;
  vat: number;
  total: number;
} {
  const subtotal = amount / (1 + vatRate / 100);
  const vat = amount - subtotal;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    total: Math.round(amount * 100) / 100,
  };
}

export function calculateVatExclusive(amount: number, vatRate: number = 15): {
  subtotal: number;
  vat: number;
  total: number;
} {
  const vat = amount * (vatRate / 100);
  const total = amount + vat;
  return {
    subtotal: Math.round(amount * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function calculateVat(amount: number, vatRate: number = 15, inclusive: boolean = true): {
  subtotal: number;
  vat: number;
  total: number;
} {
  return inclusive
    ? calculateVatInclusive(amount, vatRate)
    : calculateVatExclusive(amount, vatRate);
}
