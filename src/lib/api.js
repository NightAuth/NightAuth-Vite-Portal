import { API_BASE, PORTAL_ID } from "../config.js";
import { t } from "./i18n.js";
import { ERROR_KEYS } from "../i18n/error-translations.js";

/**
 * Thin client for NightAuth's customer API (/api/customer/*). The session is
 * an HTTP-only cookie set by NightAuth, so every call is same-origin: in
 * development through the Vite proxy (astro.config.mjs), in production by
 * serving this site on the portal's own domain behind the same origin.
 */
async function request(path, { method = "GET", body, sealed = false } = {}) {
  let res;
  try {
    const payload = body ? { portalId: PORTAL_ID, ...body } : undefined;
    res = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: payload ? JSON.stringify(sealed ? await sealPayload(payload) : payload) : undefined,
    });
  } catch {
    return { ok: false, status: 0, data: { error: "network_error" }, headers: new Headers() };
  }
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data, headers: res.headers };
}

// ── Sealed bodies ──
// Requests carrying secrets (passwords, license keys, 2FA codes, email) are
// sealed to NightAuth's public key, published by /api/customer/info, so they
// are unreadable to anything between this page and NightAuth (CDN, your own
// reverse proxy, request logs). Only the NightAuth server holds the private
// key. A server that does not publish a key gets plain JSON, as before.
let sealKey; // undefined = not fetched yet, null = server does not seal
let sodiumReady;

export function setSealKey(key) {
  sealKey = typeof key === "string" && key ? key : null;
}

async function sealPayload(payload) {
  if (sealKey === undefined) {
    const info = await request(`/api/customer/info?portalId=${encodeURIComponent(PORTAL_ID)}`);
    setSealKey(info.data?.app?.sealedBoxPublicKey);
  }
  if (!sealKey) return payload;
  sodiumReady ??= import("libsodium-wrappers").then(async (m) => {
    const sodium = m.default ?? m;
    await sodium.ready;
    return sodium;
  });
  const sodium = await sodiumReady;
  const key = sodium.from_base64(sealKey, sodium.base64_variants.ORIGINAL);
  const sealed = sodium.crypto_box_seal(sodium.from_string(JSON.stringify(payload)), key);
  // portalId stays outside too, so routing and rate limits keep working.
  return { portalId: payload.portalId, payload: sodium.to_base64(sealed, sodium.base64_variants.ORIGINAL) };
}

/** Localized message for a failed call, like the built-in portal shows. */
export function errorMessage(result, fallbackKey = "requestFailed") {
  const { status, data, headers } = result;
  if (status === 0) return t("networkError");
  if (data.error === "captcha_required") return t("captchaRequired");
  if (data.error === "captcha_unavailable") return t("captchaUnavailable");
  if (status === 429 || data.error === "rate_limited") {
    const seconds = Number(data.retry_after ?? headers.get("Retry-After")) || 60;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return t("tooManyAttempts", { time: mins > 0 ? `${mins}m ${secs}s` : `${secs}s` });
  }
  // Known codes are translated; the server's own messages are English only.
  if (ERROR_KEYS[data.error]) return t(ERROR_KEYS[data.error]);
  return data.message || t(fallbackKey);
}

const portalQuery = () => `portalId=${encodeURIComponent(PORTAL_ID)}`;

export const api = {
  info: (purpose) => request(`/api/customer/info?${portalQuery()}${purpose ? `&purpose=${purpose}` : ""}`),
  data: () => request(`/api/customer/data?${portalQuery()}`),
  signIn: (body) => request("/api/customer/auth/signin", { method: "POST", body, sealed: true }),
  signUp: (body) => request("/api/customer/auth/signup", { method: "POST", body, sealed: true }),
  verify2fa: (body) => request("/api/customer/auth/2fa-verify", { method: "POST", body, sealed: true }),
  forgotPassword: (body) => request("/api/customer/auth/forgot-password", { method: "POST", body, sealed: true }),
  resetPassword: (body) => request("/api/customer/auth/reset-password", { method: "POST", body, sealed: true }),
  logout: () => request("/api/customer/auth/logout", { method: "POST", body: {} }),
  resetHwid: () => request("/api/customer/actions/hwid-reset", { method: "POST", body: {} }),
  renewLicense: (licenseKey) => request("/api/customer/actions/renew-license", { method: "POST", body: { licenseKey }, sealed: true }),
  killSession: (sessionId) => request("/api/customer/actions/kill-session", { method: "POST", body: { sessionId } }),
  updateAccount: (body) => request("/api/customer/account", { method: "PATCH", body, sealed: true }),
  setup2fa: () => request("/api/customer/account/2fa/setup", { method: "POST", body: {} }),
  confirm2fa: (code) => request("/api/customer/account/2fa/confirm", { method: "POST", body: { code }, sealed: true }),
  disable2fa: (body) => request("/api/customer/account/2fa/disable", { method: "POST", body, sealed: true }),
};
