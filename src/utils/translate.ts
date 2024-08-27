// src/utils/translate.ts
import translations from './translations';

export function translate(key: string): string {
  return translations[key] || key;
}
