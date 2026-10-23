import { api, errorMessage } from "../lib/api.js";
import { t } from "../lib/i18n.js";
import { loadAuthPortal } from "../lib/portal.js";
import { setBusy, toast } from "../lib/ui.js";
import { captchaToken, enableCaptchaFrom, mountCaptcha } from "../lib/captcha.js";
import { initPage } from "../lib/page-init.js";

initPage();

const form = document.getElementById("forgot-form");
const submit = form?.querySelector("button[type=submit]");

loadAuthPortal().then((app) => {
  if (app && !app.canForgotPassword) window.location.assign("/signin/");
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = (form.elements.namedItem("email")?.value || "").trim();
  if (!email) return toast(t("emailRequired"), "error");
  setBusy(submit, true);
  const result = await api.forgotPassword({
    email,
    captchaToken: captchaToken(form),
  });
  setBusy(submit, false);
  if (!result.ok) {
    enableCaptchaFrom(result);
    mountCaptcha(form);
    return toast(errorMessage(result, "requestFailed"), "error");
  }
  toast(t("resetEmailSentToast"));
});
