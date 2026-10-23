import { api, errorMessage } from "../lib/api.js";
import { t } from "../lib/i18n.js";
import { loadAuthPortal } from "../lib/portal.js";
import { setBusy, toast } from "../lib/ui.js";
import { captchaToken, enableCaptchaFrom, mountCaptcha } from "../lib/captcha.js";
import { checkSignIn } from "../lib/validate.js";
import { initPage } from "../lib/page-init.js";

initPage();

const form = document.getElementById("signin-form");
const submit = form?.querySelector("button[type=submit]");
const label = form?.querySelector("[data-submit-label]");
let loginType = "credentials";

document.querySelectorAll("[data-login-type]").forEach((tab) =>
  tab.addEventListener("click", () => {
    loginType = tab.dataset.loginType;
    document.querySelectorAll("[data-login-type]").forEach((other) =>
      other.setAttribute("aria-selected", String(other === tab)),
    );
    document.querySelectorAll("[data-section]").forEach((section) => {
      section.hidden = section.dataset.section !== loginType;
    });
    if (label) {
      label.dataset.i18n = loginType === "license" ? "authenticateKeyButton" : "signInButton";
      label.textContent = t(label.dataset.i18n);
    }
  }),
);

loadAuthPortal().then((app) => {
  if (!app) return;
  if (!app.canRegister) document.querySelector("[data-register-footer]")?.remove();
  if (!app.canForgotPassword) document.querySelector("[data-forgot-link]")?.remove();
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = (name) => form.elements.namedItem(name)?.value || "";
  const input = { loginType, username: value("username"), password: value("password"), license: value("license") };
  const invalid = checkSignIn(input);
  if (invalid) return toast(t(invalid), "error");
  setBusy(submit, true);
  const result = await api.signIn({
    loginType,
    ...(loginType === "credentials"
      ? { username: input.username.trim(), password: input.password }
      : { license: input.license.trim() }),
    captchaToken: captchaToken(form),
  });
  if (!result.ok) {
    setBusy(submit, false);
    enableCaptchaFrom(result);
    mountCaptcha(form);
    return toast(errorMessage(result, "requestFailed"), "error");
  }
  if (result.data?.requires2fa) return window.location.assign("/2fa-required/");
  toast(t("welcomeBackToast"));
  window.location.assign("/");
});
