// Cap proof-of-work widget, mounted only when /api/customer/info reports
// `captchaRequired` (NightAuth then rejects sign-in, sign-up and
// forgot-password without a token). The widget talks to NightAuth's own Cap
// proxy at "/api/cap/" on this site's origin — the same path the dev proxy and
// the production reverse proxy forward — so the Cap server needs no CORS entry
// for this domain. PUBLIC_CAP_API_ENDPOINT overrides it only for setups that
// call a public Cap instance directly.
const ENDPOINT = import.meta.env.PUBLIC_CAP_API_ENDPOINT?.trim() || "/api/cap/";
// Same widget build NightAuth serves (public/cap, synced from the monorepo):
// no "Cap" credits link, and its WASM is loaded from this site too.
const ASSETS = "/cap";
export const CAPTCHA_FIELD = "cap-token";

let required = false;

const THEME = [
  "--cap-widget-width:100%", "--cap-widget-height:44px", "--cap-border-radius:12px",
  "--cap-background:#111113", "--cap-border-color:rgba(255,255,255,0.1)", "--cap-color:#d4d4d8",
  "--cap-font:inherit", "--cap-checkbox-background:#18181b", "--cap-spinner-color:var(--accent)",
  "--cap-spinner-background-color:#27272a", "--cap-focus-ring:var(--accent)",
].join(";");

export function setCaptchaRequired(value) {
  required = Boolean(value);
}

/**
 * A server that predates `captchaRequired` in /api/customer/info still
 * answers `captcha_required`: switch the widget on from that answer so the
 * next attempt can succeed. Returns true when it did.
 */
export function enableCaptchaFrom(result) {
  if (result?.data?.error !== "captcha_required") return false;
  required = true;
  return true;
}

/** Renders (or re-renders after each attempt: tokens are single-use) the widget into [data-captcha] slots. */
export function mountCaptcha(root = document) {
  if (!required) return;
  if (!document.querySelector("script[data-cap-widget]")) {
    window.CAP_CUSTOM_WASM_URL = new URL(`${ASSETS}/cap_wasm_bg.wasm`, window.location.origin).href;
    window.CAP_CUSTOM_HASHWX_URL = new URL(`${ASSETS}/hashwx.wasm`, window.location.origin).href;
    const script = document.createElement("script");
    script.src = `${ASSETS}/widget.js`;
    script.async = true;
    script.dataset.capWidget = "";
    document.head.appendChild(script);
  }
  root.querySelectorAll("[data-captcha]").forEach((slot) => {
    slot.innerHTML = "";
    const widget = document.createElement("cap-widget");
    widget.setAttribute("data-cap-api-endpoint", ENDPOINT);
    widget.setAttribute("data-cap-hidden-field-name", CAPTCHA_FIELD);
    widget.setAttribute("style", THEME);
    widget.className = "block w-full";
    slot.appendChild(widget);
  });
}

export function captchaToken(form) {
  const value = new FormData(form).get(CAPTCHA_FIELD);
  return typeof value === "string" && value ? value : undefined;
}
