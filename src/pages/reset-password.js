import { api, errorMessage } from "../lib/api.js";
import { t } from "../lib/i18n.js";
import { loadAuthPortal } from "../lib/portal.js";
import { setBusy, toast } from "../lib/ui.js";
import { initPage } from "../lib/page-init.js";

initPage();

const form = document.getElementById("reset-form");
const submit = form?.querySelector("button[type=submit]");
const token = new URLSearchParams(window.location.search).get("token") || "";

loadAuthPortal();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const newPassword = (form.elements.namedItem("newPassword")?.value || "").trim();
  if (newPassword.length < 6) return toast(t("passwordTooShort"), "error");
  if (!token) return toast(t("invalidResetToken"), "error");
  setBusy(submit, true);
  const result = await api.resetPassword({ token, newPassword });
  setBusy(submit, false);
  if (!result.ok) {
    return toast(errorMessage(result, "requestFailed"), "error");
  }
  toast(t("passwordUpdatedToast"));
  window.location.assign("/signin/");
});
