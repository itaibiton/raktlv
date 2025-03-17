import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type PropertyType = 'rental' | 'for sale' | 'sublet'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPrice(amount: number, propertyType: PropertyType): string {
  const result = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(amount);

  if (propertyType === 'rental') {
    return `${result} / חודש`;
  }

  return result;
}

