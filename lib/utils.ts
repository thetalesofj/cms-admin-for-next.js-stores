import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat("en-UK", {
  maximumFractionDigits: 2,
  style: 'currency',
  currency: 'GBP'
})

export const formatPrice = (price: number, currencyCode: string, location: string) : string => {
  const formatter = new Intl.NumberFormat(location, {
    maximumFractionDigits: 2,
    style: 'currency',
    currency: currencyCode
  })
  return formatter.format(price)
}