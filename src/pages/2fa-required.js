import { api, errorMessage } from "../lib/api.js";
import { t } from "../lib/i18n.js";
import { loadAuthPortal } from "../lib/portal.js";
import { setBusy, toast } from "../lib/ui.js";
import { initPage } from "../lib/page-init.js";

initPage();

const form = document.getElementById("twofactor-form");
const submit = form?.querySelector("button[type=submit]");

loadAuthPortal();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const code = (form.elements.namedItem("code")?.value || "").trim();
  if (!code) return toast(t("codeRequired"), "error");
  setBusy(submit, true);
  const result = await api.verify2FA({ code });
  if (!result.ok) {
    setBusy(submit, false);
    return toast(errorMessage(result, "requestFailed"), "error");
  }
  toast(t("welcomeBackToast"));
  window.location.assign("/");
});
