import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// HTML 유틸리티 함수 re-export
export { stripHtmlTags, decodeHtmlEntities, htmlToPlainText } from './htmlUtils';
