import { api, errorMessage } from "../lib/api.js";
import { t } from "../lib/i18n.js";
import { loadAuthPortal } from "../lib/portal.js";
import { setBusy, toast } from "../lib/ui.js";
import { captchaToken, enableCaptchaFrom, mountCaptcha } from "../lib/captcha.js";
import { checkSignUp } from "../lib/validate.js";
import { initPage } from "../lib/page-init.js";

initPage();

const form = document.getElementById("signup-form");
const submit = form?.querySelector("button[type=submit]");

loadAuthPortal().then((app) => {
  if (app && !app.canRegister) window.location.assign("/signin/");
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = (name) => form.elements.namedItem(name)?.value || "";
  const input = {
    licenseKey: value("licenseKey"),
    username: value("username"),
    email: value("email"),
    password: value("password"),
  };
  const invalid = checkSignUp(input);
  if (invalid) return toast(t(invalid), "error");
  setBusy(submit, true);
  const result = await api.signUp({
    licenseKey: input.licenseKey.trim(),
    username: input.username.trim(),
    email: input.email.trim() || undefined,
    password: input.password,
    captchaToken: captchaToken(form),
  });
  if (!result.ok) {
    setBusy(submit, false);
    enableCaptchaFrom(result);
    mountCaptcha(form);
    return toast(errorMessage(result, "requestFailed"), "error");
  }
  toast(t("accountCreatedToast"));
  window.location.assign("/");
});
