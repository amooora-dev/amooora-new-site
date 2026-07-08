export const COOKIE_CONSENT_KEY = 'amooora-cookie-consent';
export const COOKIE_CONSENT_EVENT = 'amooora:cookie-consent';

export type ConsentChoice = 'accepted' | 'rejected';

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

export function setStoredConsent(choice: ConsentChoice) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: choice }));
}

export function hasAnalyticsConsent(): boolean {
  return getStoredConsent() === 'accepted';
}
