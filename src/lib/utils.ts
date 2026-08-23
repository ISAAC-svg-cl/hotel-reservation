import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string | { toString(): string }, currency: string = "USD"): string {
  const num = typeof amount === "number" ? amount : parseFloat(amount.toString());
  if (isNaN(num)) return `0 ${currency}`;
  
  if (currency === "CDF") {
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: "CDF",
      maximumFractionDigits: 0,
    }).format(num);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function generateReservationNumber(): string {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `HTL-${year}-${randomStr}`;
}
