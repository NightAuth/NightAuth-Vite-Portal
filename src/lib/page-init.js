import { applyTranslations, t } from "./i18n.js";
import { mountGrid } from "./grid.js";
import { icon } from "./icons.js";

export function initPage() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.dataset.icon;
    const cls = el.className || "size-4";
    el.outerHTML = icon(name, cls);
  });

  applyTranslations();
  const grid = document.getElementById("grid");
  if (grid) mountGrid(grid);

  // Bind password toggles if any
  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.innerHTML = icon("eye", "size-4");
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.togglePassword;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      btn.innerHTML = icon(isPass ? "eye-off" : "eye", "size-4");
    });
  });
}
