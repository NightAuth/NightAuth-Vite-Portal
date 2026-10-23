import { LANGS, LANG_STORAGE_KEY, PORTAL_TRANSLATIONS } from "../i18n/portal-translations.js";
import { EXTRA_TRANSLATIONS } from "../i18n/extra-translations.js";
import { ERROR_TRANSLATIONS } from "../i18n/error-translations.js";

export { LANGS };

const CODES = LANGS.map((l) => l.code);

/** Same storage key as the built-in portal, so the choice carries over. */
export function getLang() {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (CODES.includes(stored)) return stored;
  } catch {
    /* Storage blocked (private mode): fall through to the browser language. */
  }
  const browser = (navigator.language || "en").slice(0, 2).toLowerCase();
  return CODES.includes(browser) ? browser : "en";
}

export function setLang(code) {
  if (!CODES.includes(code)) return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, code);
  } catch {
    /* Keep the in-page selection only. */
  }
  applyTranslations();
  window.dispatchEvent(new CustomEvent("na:lang", { detail: code }));
}

export function t(key, params) {
  const lang = getLang();
  const value =
    PORTAL_TRANSLATIONS[lang]?.[key] ??
    EXTRA_TRANSLATIONS[lang]?.[key] ??
    ERROR_TRANSLATIONS[lang]?.[key] ??
    PORTAL_TRANSLATIONS.en[key] ??
    EXTRA_TRANSLATIONS.en[key] ??
    ERROR_TRANSLATIONS.en[key] ??
    key;
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
}

/** Fills every [data-i18n*] attribute under `root` with the current language. */
export function applyTranslations(root = document) {
  document.documentElement.lang = getLang();
  root.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder)));
  root.querySelectorAll("[data-i18n-title]").forEach((el) => (el.title = t(el.dataset.i18nTitle)));
}
