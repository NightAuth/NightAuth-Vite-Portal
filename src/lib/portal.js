import { APP_NAME, PORTAL_ID } from "../config.js";
import { api, setSealKey } from "./api.js";
import { t } from "./i18n.js";
import { applyAccent, mountLangDropdown, wirePasswordToggles } from "./ui.js";
import { mountCaptcha, setCaptchaRequired } from "./captcha.js";

function showState(name) {
  document.querySelectorAll("[data-portal-state]").forEach((el) => {
    el.hidden = el.dataset.portalState !== name;
  });
}

export function setTitle(appName) {
  const key = document.body.dataset.titleKey;
  document.title = key ? `${appName} · ${t(key)}` : appName;
}

/**
 * Loads the portal's public settings (name, colour, which screens are open)
 * and reveals the auth card, or the not-found / offline screen.
 */
export async function loadAuthPortal({ purpose } = {}) {
  if (!PORTAL_ID) {
    document.querySelectorAll("[data-portal-id]").forEach((el) => (el.textContent = t("configMissing")));
    showState("notfound");
    return null;
  }
  const result = await api.info(purpose);
  if (result.status === 404) {
    document.querySelectorAll("[data-portal-id]").forEach((el) => (el.textContent = `ID: ${PORTAL_ID}`));
    showState("notfound");
    return null;
  }
  if (result.status === 403) {
    showState("offline");
    return null;
  }
  const app = result.data?.app ?? {};
  applyAccent(app.theme);
  const name = app.name || APP_NAME;
  document.querySelectorAll("[data-app-name]").forEach((el) => (el.textContent = name));
  setTitle(name);
  window.addEventListener("na:lang", () => setTitle(name));
  if (app.logoUrl) {
    const link = document.querySelector("link[rel='icon']") ?? document.head.appendChild(document.createElement("link"));
    link.rel = "icon";
    link.href = app.logoUrl;
  }
  document.querySelectorAll("[data-lang-dropdown]").forEach(mountLangDropdown);
  wirePasswordToggles();
  setCaptchaRequired(app.captchaRequired);
  setSealKey(app.sealedBoxPublicKey);
  mountCaptcha();
  showState("ready");
  return { canRegister: app.canRegister ?? true, canForgotPassword: app.canForgotPassword ?? true, ...app };
}
