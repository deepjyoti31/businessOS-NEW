import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 * @param value The number to format
 * @param currency The currency code (default: USD)
 * @param minimumFractionDigits Minimum number of fraction digits (default: 0)
 * @param maximumFractionDigits Maximum number of fraction digits (default: 0)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string,
  currency: string = 'USD',
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 0
): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '$0';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numValue);
}
