import { icon } from "./icons.js";
import { LANGS, getLang, setLang } from "./i18n.js";

const PRESET_COLORS = {
  blue: "#3b82f6",
  emerald: "#10b981",
  purple: "#a855f7",
  amber: "#f59e0b",
  rose: "#f43f5e",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  orange: "#f97316",
};

/** Same rules as NightAuth's resolveAccentHex (src/lib/customer/accent.ts). */
export function resolveAccentHex(theme) {
  if (!theme) return PRESET_COLORS.blue;
  const lower = String(theme).toLowerCase().trim();
  if (PRESET_COLORS[lower]) return PRESET_COLORS[lower];
  const clean = lower.startsWith("#") ? lower : `#${lower}`;
  return /^#[0-9a-f]{6}$/.test(clean) ? clean : PRESET_COLORS.blue;
}

export function applyAccent(theme) {
  document.documentElement.style.setProperty("--accent", resolveAccentHex(theme));
}

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/** Only http(s) links from the API are rendered as hrefs or image sources. */
export function safeUrl(value) {
  if (!value || typeof value !== "string") return "";
  try {
    const url = new URL(value, window.location.origin);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

export function toast(message, type = "success") {
  let host = document.getElementById("toasts");
  if (!host) {
    host = document.createElement("div");
    host.id = "toasts";
    host.className = "fixed bottom-4 right-4 left-4 sm:left-auto z-[100] flex flex-col items-end gap-2 pointer-events-none";
    document.body.appendChild(host);
  }
  const tone = {
    success: ["circle-check", "text-emerald-400"],
    error: ["circle-alert", "text-rose-400"],
    info: ["circle-alert", "text-zinc-400"],
  }[type];
  const el = document.createElement("div");
  el.setAttribute("role", type === "error" ? "alert" : "status");
  el.className =
    "toast pointer-events-auto flex w-full sm:w-80 items-start gap-2.5 rounded-xl border border-white/10 bg-zinc-950/95 px-4 py-3 text-xs font-medium text-zinc-200 shadow-2xl backdrop-blur-xl";
  el.innerHTML = `${icon(tone[0], `size-4 shrink-0 ${tone[1]}`)}<span class="flex-1 leading-relaxed"></span>`;
  el.querySelector("span").textContent = message;
  host.appendChild(el);
  setTimeout(() => {
    el.classList.add("toast-out");
    setTimeout(() => el.remove(), 250);
  }, type === "error" ? 6000 : 3500);
}

/** Disables a submit button and swaps its content for a spinner. */
export function setBusy(button, busy) {
  if (!button) return;
  if (busy) {
    button.dataset.idleHtml = button.innerHTML;
    button.disabled = true;
    button.innerHTML = icon("loader-circle", "size-4 animate-spin");
  } else {
    button.disabled = false;
    if (button.dataset.idleHtml) button.innerHTML = button.dataset.idleHtml;
  }
}

export async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch {
    /* Clipboard blocked (insecure context). */
  }
}

/** Language picker identical to the built-in portal's (flag + label + list). */
export function mountLangDropdown(container) {
  if (!container) return;
  const render = () => {
    const lang = getLang();
    const active = LANGS.find((l) => l.code === lang) ?? LANGS[0];
    container.innerHTML = `
      <div class="relative">
        <button type="button" data-lang-toggle aria-haspopup="listbox" aria-expanded="false"
          class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition text-xs font-bold text-zinc-300 cursor-pointer">
          <img src="${active.flagImg}" alt="" width="16" height="16" class="size-4 shrink-0 rounded-[3px] object-cover border border-white/15" />
          <span class="hidden sm:inline">${escapeHtml(active.label)}</span>
          ${icon("chevron-down", "size-3 text-zinc-500 transition-transform")}
        </button>
        <div data-lang-menu role="listbox" class="hidden absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden py-1">
          ${LANGS.map(
            (l) => `
            <button type="button" role="option" aria-selected="${l.code === lang}" data-lang="${l.code}"
              class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition cursor-pointer text-left ${l.code === lang ? "ac-text ac-bg-12" : "text-zinc-400 hover:bg-white/[0.04]"}">
              <img src="${l.flagImg}" alt="" width="16" height="16" class="size-4 shrink-0 rounded-[3px] object-cover border border-white/15" />
              <span>${escapeHtml(l.label)}</span>
              ${l.code === lang ? '<span class="ml-auto size-1.5 rounded-full ac-dot"></span>' : ""}
            </button>`,
          ).join("")}
        </div>
      </div>`;
    const toggle = container.querySelector("[data-lang-toggle]");
    const menu = container.querySelector("[data-lang-menu]");
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = menu.classList.toggle("hidden") === false;
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("[data-lang]").forEach((button) =>
      button.addEventListener("click", () => setLang(button.dataset.lang)),
    );
  };
  render();
  document.addEventListener("click", (event) => {
    if (!container.contains(event.target)) container.querySelector("[data-lang-menu]")?.classList.add("hidden");
  });
  window.addEventListener("na:lang", render);
}

/** Password field eye toggle: buttons with [data-toggle-password="<input id>"]. */
export function wirePasswordToggles(root = document) {
  root.querySelectorAll("[data-toggle-password]").forEach((button) => {
    const input = document.getElementById(button.dataset.togglePassword);
    button.innerHTML = icon("eye", "size-4");
    button.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.innerHTML = icon(show ? "eye-off" : "eye", "size-4");
    });
  });
}
