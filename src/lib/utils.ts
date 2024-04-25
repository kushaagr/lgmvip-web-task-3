import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isEmptyOrNull<T>(array: T[] | null | undefined): boolean {
  return !array || array.length === 0;
}
