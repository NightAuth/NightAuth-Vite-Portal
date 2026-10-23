// Customer dashboard: a vanilla port of NightAuth's built-in portal
// (src/app/(customer)/customer/[portalId]/dashboard and its tab components).
// Every value from the API is escaped before it reaches innerHTML.
import { PORTAL_ID } from "../config.js";
import { api, errorMessage } from "./api.js";
import { applyTranslations, getLang, t } from "./i18n.js";
import { icon } from "./icons.js";
import { setTitle } from "./portal.js";
import { applyAccent, copyText, escapeHtml as e, mountLangDropdown, safeUrl, setBusy, toast } from "./ui.js";
import { checkAccount } from "./validate.js";

const TABS = [
  { id: "overview", label: "tabOverview", icon: "layout-dashboard" },
  { id: "hwid", label: "tabHwid", icon: "monitor-smartphone", flag: "allowHwidReset" },
  { id: "downloads", label: "tabDownloads", icon: "download", flag: "allowDownload" },
  { id: "sessions", label: "tabSessions", icon: "monitor", flag: "allowViewSessions" },
  { id: "account", label: "tabAccountSettings", icon: "settings" },
];

let data = null;
let activeTab = "overview";
let hwidBusy = false;

const $ = (selector, root = document) => root.querySelector(selector);
const date = (value) => new Date(value).toLocaleDateString(getLang());
const dateTime = (value) => new Date(value).toLocaleString(getLang());
const span = (key) => `<span data-i18n="${key}">${e(t(key))}</span>`;
const visibleTabs = () => TABS.filter((tab) => !tab.flag || data.app[tab.flag]);
const isCooldown = () => !!data.user.cooldownUntil && new Date(data.user.cooldownUntil).getTime() > Date.now();

function sectionTitle(iconName, key, accent = false) {
  return `<div class="flex items-center gap-2">${icon(iconName, `size-4 ${accent ? "ac-text" : "text-zinc-400"}`)}
    <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">${span(key)}</span></div>`;
}

const STATUS_TONES = {
  expired: "bg-rose-500/[0.06] border-rose-500/[0.15] text-rose-500",
  expiring: "bg-amber-500/[0.06] border-amber-500/[0.15] text-amber-500",
  active: "bg-emerald-500/[0.06] border-emerald-500/[0.15] text-emerald-500",
};

function statCard(iconName, labelKey, value, sensitive = false) {
  const body = sensitive
    ? `<div class="relative group cursor-pointer w-fit">
         <p class="text-sm font-bold text-zinc-200 truncate blur-sm group-hover:blur-none transition-all duration-200 select-none group-hover:select-text">${e(value)}</p>
         <span class="absolute -top-6 left-0 text-[10px] bg-black/80 text-zinc-400 px-1.5 py-0.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">${span("hoverToReveal")}</span>
       </div>`
    : `<p class="text-sm font-bold text-zinc-200 truncate">${e(value)}</p>`;
  return `<div class="rounded-xl border ac-border-15 ac-bg-06 p-3 space-y-2 flex flex-col">
    <div class="flex items-center justify-between">
      <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">${span(labelKey)}</span>${icon(iconName, "size-3.5 text-zinc-600")}
    </div>${body}</div>`;
}

function renderOverview() {
  const subs = data.subscriptions
    .map((s) => {
      const days = Math.ceil((new Date(s.expiresAt).getTime() - Date.now()) / 86400000);
      const state = days <= 0 ? "expired" : days <= 7 ? "expiring" : "active";
      const badge = state === "expired" ? t("expiredStatus") : state === "expiring" ? `${days}${t("daysLeftSuffix")}` : t("activeStatus");
      return `<div class="flex items-center justify-between p-3 rounded-xl border ac-border-18 ac-bg-06">
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold ac-text">${e(s.name)}</span>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full border font-mono ac-bg-12 ac-border-25 ac-text">${e(t("lvlPrefix"))} ${e(s.level)}</span>
          </div>
          <div class="flex items-center gap-1">${icon("clock", "size-3 text-zinc-600")}
            <span class="text-[11px] text-zinc-500">${state === "expired" ? e(t("expiredStatus")) : `${e(t("expiresPrefix"))} ${e(date(s.expiresAt))}`}</span>
          </div>
        </div>
        <span class="text-[10px] font-bold px-2 py-1 rounded-lg border ${STATUS_TONES[state]}">${e(badge)}</span>
      </div>`;
    })
    .join("");
  const empty = `<div class="flex items-center gap-3 p-3 rounded-xl border border-rose-500/15 bg-rose-500/5">
      ${icon("circle-alert", "size-5 text-rose-400 flex-shrink-0")}
      <div><p class="text-sm font-bold text-rose-400">${span("noActiveSubscriptions")}</p>
      <p class="text-[11px] text-zinc-500">${span(data.app.allowRenewal ? "noSubscriptionsHelpRenewal" : "noSubscriptionsHelpContact")}</p></div>
    </div>`;
  const cooldown = isCooldown();
  return `
    <div class="px-5 py-4 border-b border-white/[0.06]">
      <div class="flex items-center justify-between mb-4">
        ${sectionTitle("zap", "activeSubscriptionsTitle", true)}
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ac-bg-15 ac-text">${data.subscriptions.length}</span>
          ${data.app.allowRenewal ? `<button type="button" data-open-renew class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ac-bg-12 ac-border-25 ac-text">${icon("plus", "size-3")}${span("renewSubscriptionButton")}</button>` : ""}
        </div>
      </div>
      ${data.subscriptions.length ? `<div class="space-y-2">${subs}</div>` : empty}
    </div>
    <div class="px-5 py-4 grid grid-cols-2 gap-3">
      ${statCard("globe", "statIpAddress", data.user.ip || "—", true)}
      ${statCard("calendar-days", "statMemberSince", date(data.user.createdAt))}
      ${statCard("activity", "statLastLogin", data.user.lastLoginAt ? date(data.user.lastLoginAt) : "—")}
      ${statCard("key", "statAppVersion", `v${data.app.version}`)}
    </div>
    <div class="px-5 pb-4">
      <div class="flex items-center gap-3 p-3 rounded-xl border ac-border-15 ac-bg-06">
        ${icon("hard-drive", "size-4 text-zinc-500 flex-shrink-0")}
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-0.5">${span("hwidStatusTitle")}</p>
          <p class="text-xs font-mono text-zinc-300 truncate">${data.user.hwid ? `${e(data.user.hwid.substring(0, 36))}…` : e(t("hwidNotRegistered"))}</p>
        </div>
        <span class="text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${cooldown ? "bg-amber-500/[0.06] text-amber-500" : "ac-bg-12 ac-text"}">${e(t(cooldown ? "cooldownStatus" : "readyStatus"))}</span>
      </div>
    </div>`;
}

function renderHwid() {
  const cooldown = isCooldown();
  return `<div class="p-5 space-y-5">
    ${sectionTitle("monitor-smartphone", "hwidManagementTitle")}
    <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">${span("currentBoundDevice")}</span>
        ${data.user.hwid ? `<button type="button" data-copy-hwid class="text-zinc-600 hover:text-zinc-300 transition cursor-pointer" aria-label="Copy">${icon("copy", "size-3.5")}</button>` : ""}
      </div>
      <p class="text-xs font-mono text-zinc-300 break-all leading-relaxed">${data.user.hwid ? e(data.user.hwid) : e(t("noDeviceBound"))}</p>
      ${cooldown ? `<div class="flex items-center gap-2 pt-1 border-t border-white/[0.06]">${icon("clock", "size-3.5 text-amber-400")}<p class="text-[11px] text-amber-400 font-bold">${e(t("resetCooldownUntil"))} ${e(dateTime(data.user.cooldownUntil))}</p></div>` : ""}
    </div>
    <div class="rounded-xl p-4 space-y-2 ac-bg-08 border ac-border-15">
      <div class="flex items-center gap-2 mb-1">${icon("shield-alert", "size-4 ac-text")}<p class="text-xs font-bold text-white">${span("hwidPolicyTitle")}</p></div>
      <ul class="text-xs text-zinc-400 space-y-1 list-disc list-inside leading-relaxed">
        <li>${span("hwidPolicyRule1")}</li><li>${span("hwidPolicyRule2")}</li><li>${span("hwidPolicyRule3")}</li>
      </ul>
    </div>
    <button type="button" data-reset-hwid ${hwidBusy || cooldown ? "disabled" : ""}
      class="w-full h-11 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${cooldown ? "bg-[#1c1c1e] border border-white/[0.06] text-zinc-600" : "ac-btn text-white"}">
      ${hwidBusy ? icon("loader-circle", "size-4 animate-spin") : `${icon("refresh-cw", "size-4")}${span(cooldown ? "cooldownActiveButton" : "resetHwidButton")}`}
    </button>
  </div>`;
}

function renderDownloads() {
  const url = safeUrl(data.app.autoUpdateDownloadUrl);
  const build = url
    ? `<div class="flex items-center gap-4 p-4 rounded-xl border ac-border-18 ac-bg-06">
        <div class="size-10 rounded-xl flex items-center justify-center flex-shrink-0 ac-bg-18">${icon("download", "size-5 ac-text")}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-white">${span("latestBuild")}</p>
          <p class="text-[11px] text-zinc-500">${e(t("versionPrefix"))} ${e(data.app.version)} · ${e(t("stableRelease"))}</p>
        </div>
        <a href="${e(url)}" target="_blank" rel="noopener noreferrer" class="ac-btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white">${icon("download", "size-3.5")}${span("downloadButton")}</a>
      </div>`
    : `<div class="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-500">${icon("circle-alert", "size-4")}<p class="text-xs">${span("noDownloadUrl")}</p></div>`;
  const buttons = (data.app.buttons ?? [])
    .map((b) => `<button type="button" data-resource="${e(b.id)}" class="py-3 px-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-xs font-bold text-zinc-200 transition flex items-center justify-center gap-2 cursor-pointer">${icon("external-link", "size-3.5 text-zinc-400")}<span>${e(b.text)}</span></button>`)
    .join("");
  return `<div class="p-5 space-y-5">
    ${sectionTitle("download", "downloadsTitle")}
    ${build}
    ${buttons ? `<div class="space-y-3"><p class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">${span("additionalResourcesTitle")}</p><div class="grid grid-cols-2 gap-2">${buttons}</div></div>` : ""}
  </div>`;
}

function renderSessions() {
  const sessions = data.sessions ?? [];
  const rows = sessions
    .map((s) => `<div class="p-4 rounded-xl border ac-border-18 ac-bg-06 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-start gap-3 min-w-0">
        <div class="size-10 rounded-xl flex items-center justify-center flex-shrink-0 ac-bg-15 border ac-border-25">${icon("laptop", "size-5 ac-text")}</div>
        <div class="space-y-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-mono text-xs font-bold text-white tracking-wider">${e(String(s.sessionKey).slice(0, 16))}...</span>
            ${s.isCurrent ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ac-bg-15 ac-border-30 ac-text">${span("currentDeviceBadge")}</span>` : ""}
            ${s.validated
              ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">${icon("shield-check", "size-3")}${span("validatedBadge")}</span>`
              : `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md">${icon("shield-alert", "size-3")}${span("pendingBadge")}</span>`}
          </div>
          <div class="flex items-center gap-3 flex-wrap text-[11px] text-zinc-500">
            ${s.ip ? `<span class="flex items-center gap-1">${icon("globe", "size-3 text-zinc-400")}<span class="font-mono">${e(s.ip)}</span></span>` : ""}
            <span class="flex items-center gap-1">${icon("clock", "size-3 text-zinc-400")}<span>${e(t("createdPrefix"))} ${e(date(s.createdAt))}</span></span>
          </div>
          ${s.hwid ? `<p class="text-[10px] text-zinc-600 font-mono truncate max-w-xs">HWID: ${e(s.hwid)}</p>` : ""}
        </div>
      </div>
      <div class="flex items-center justify-end flex-shrink-0">
        ${s.isCurrent
          ? `<span class="text-[11px] font-medium text-zinc-500 px-2 py-1">${span("activeNowBadge")}</span>`
          : `<button type="button" data-kill-session="${e(s.id)}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/[0.08] text-xs font-bold text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/30 transition cursor-pointer disabled:opacity-50">${icon("trash-2", "size-3.5")}${span("disconnectButton")}</button>`}
      </div>
    </div>`)
    .join("");
  return `<div class="p-5 space-y-5">
    <div class="flex items-center justify-between">
      ${sectionTitle("monitor", "activeSessionsTitle")}
      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ac-bg-12 ac-border-25 ac-text">${sessions.length} ${e(t(sessions.length === 1 ? "sessionCountSingular" : "sessionCountPlural"))}</span>
    </div>
    ${sessions.length ? `<div class="space-y-3">${rows}</div>` : `<div class="p-8 text-center border border-white/[0.06] rounded-xl bg-white/[0.02]"><p class="text-xs text-zinc-500">${span("noActiveSessionsFound")}</p></div>`}
  </div>`;
}

function renderAccount() {
  const twoFa = data.user.twoFactorEnabled
    ? `<button type="button" data-open-disable class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition group cursor-pointer shadow-sm">
        <span class="group-hover:hidden inline-flex items-center gap-1.5">${icon("shield-check", "size-3.5")}2FA <span data-i18n="activeStatus">${e(t("activeStatus"))}</span></span>
        <span class="hidden group-hover:inline-flex items-center gap-1.5">${icon("shield-off", "size-3.5")}${span("disable2faButton")}</span>
      </button>`
    : `<button type="button" data-open-setup class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer shadow-sm hover:brightness-110 ac-bg-15 ac-border-35 ac-text">${icon("shield-check", "size-3.5")}${span("enable2faButton")}</button>`;
  const field = (id, labelKey, attrs, iconName) => `
    <div class="space-y-1.5">
      <label for="${id}" class="${labelKey.startsWith("current") || labelKey.startsWith("new") ? "text-[11px] text-zinc-600" : "na-label"}">${span(labelKey)}</label>
      <div class="relative group"><input id="${id}" ${attrs} class="na-input ${iconName ? "" : "no-icon"}" />${iconName ? icon(iconName, "size-4 na-field-icon") : ""}</div>
    </div>`;
  return `<div class="p-5 space-y-4">
    <div class="flex items-center justify-between gap-3">${sectionTitle("user", "profileSettingsTitle")}<div>${twoFa}</div></div>
    <form id="account-form" class="space-y-4" novalidate>
      ${field("acc-username", "usernameFieldLabel", `type="text" value="${e(data.user.username)}" ${data.app.changeUsernameAllowed ? "" : "disabled"}`, "user")}
      ${data.app.changeUsernameAllowed ? "" : `<p class="text-[11px] text-zinc-600 -mt-2">${span("usernameFixedHelp")}</p>`}
      ${field("acc-avatar", "avatarUrlLabel", `type="url" value="${e(data.user.avatarUrl || "")}" data-i18n-placeholder="avatarPlaceholder" placeholder="${e(t("avatarPlaceholder"))}"`)}
      ${data.user.twoFactorEnabled ? `<div class="space-y-1.5"><label for="acc-totp" class="na-label">2FA</label><input id="acc-totp" inputmode="numeric" autocomplete="one-time-code" maxlength="6" class="na-input no-icon" /></div>` : ""}
      <div class="space-y-3 pt-1 border-t border-white/[0.06]">
        <div class="flex items-center gap-2 pt-3">${icon("lock", "size-3.5 text-zinc-500")}<p class="text-xs font-bold uppercase tracking-wider text-zinc-500">${span("changePasswordTitle")}</p></div>
        ${field("acc-current", "currentPasswordLabel", `type="password" autocomplete="current-password" placeholder="••••••••"`, "lock")}
        ${field("acc-new", "newPasswordFieldLabel", `type="password" autocomplete="new-password" placeholder="••••••••"`, "lock")}
        <p class="text-[11px] text-zinc-600">${span("leaveBlankPasswordNotice")}</p>
      </div>
      <button type="submit" class="ac-btn w-full h-11 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer">${span("saveChangesButton")}</button>
    </form>
  </div>`;
}

const RENDER = { overview: renderOverview, hwid: renderHwid, downloads: renderDownloads, sessions: renderSessions, account: renderAccount };

function renderTabs() {
  const tabs = visibleTabs();
  if (!tabs.some((tab) => tab.id === activeTab)) activeTab = "overview";
  const bar = $("#tabs");
  bar.style.gridTemplateColumns = `repeat(${tabs.length}, minmax(0, 1fr))`;
  bar.innerHTML = tabs
    .map((tab) => `<button type="button" role="tab" aria-selected="${tab.id === activeTab}" data-tab="${tab.id}" title="${e(t(tab.label))}"
      class="ac-tab flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer">
      ${icon(tab.icon, "size-3.5")}<span class="hidden sm:inline" data-i18n="${tab.label}">${e(t(tab.label))}</span></button>`)
    .join("");
  $("#tab-content").innerHTML = RENDER[activeTab]();
}

function renderChrome() {
  const { app, user } = data;
  applyAccent(app.theme);
  document.querySelectorAll("[data-app-name]").forEach((el) => (el.textContent = app.name));
  $("[data-app-version]").textContent = `v${app.version}`;
  const logo = safeUrl(app.logoUrl);
  if (logo) $("[data-app-logo]").innerHTML = `<img src="${e(logo)}" alt="" class="size-full object-contain rounded-lg" />`;
  const support = $("[data-support-link]");
  const supportUrl = safeUrl(app.supportUrl);
  support.hidden = !supportUrl;
  if (supportUrl) support.href = supportUrl;
  const avatar = safeUrl(user.avatarUrl);
  $("[data-user-avatar]").innerHTML = avatar
    ? `<img src="${e(avatar)}" alt="" class="size-full object-cover" />`
    : `<span class="text-2xl font-black ac-text">${e(user.username.charAt(0).toUpperCase())}</span>`;
  $("[data-user-name]").textContent = user.username;
  const status = { active: "activeStatus", banned: "bannedStatus", paused: "pausedStatus" }[user.status];
  $("[data-user-status]").textContent = status ? t(status) : user.status;
  $("[data-user-email]").textContent = user.email || t("noEmail");
  setTitle(app.name);
}

async function load() {
  const result = await api.data();
  if (result.status === 401) {
    window.location.replace("/signin");
    return false;
  }
  if (!result.ok) {
    toast(errorMessage(result, "loadFailed"), "error");
    return false;
  }
  data = result.data;
  renderChrome();
  renderTabs();
  $("#dash-loading").hidden = true;
  $("#dash").hidden = false;
  return true;
}

function selectTab(id) {
  activeTab = id;
  const url = new URL(window.location.href);
  url.searchParams.set("tab", id);
  window.history.replaceState({}, "", url);
  renderTabs();
}

// ── Modals ──
const open = (id) => ($(`#${id}`).hidden = false);
const close = (id) => ($(`#${id}`).hidden = true);

let setupStep = "qr";
let setupSecret = "";
let backupCodes = [];
function showSetupStep(step) {
  setupStep = step;
  document.querySelectorAll("[data-setup]").forEach((el) => (el.hidden = el.dataset.setup !== step));
  const index = { qr: 1, confirm: 2, backup: 3 }[step];
  const label = { qr: "scanQrStep", confirm: "enterCodeStep", backup: "saveBackupStep" }[step];
  $("[data-setup-step-label]").textContent = index ? `${t("stepLabel")} ${index} · ${t(label)}` : "";
  $("[data-setup-progress]").style.width = `${(index ?? 1) * 33.4}%`;
}

async function openSetup() {
  open("setup-modal");
  showSetupStep("loading");
  $("[data-setup-code]").value = "";
  const result = await api.setup2fa();
  if (!result.ok) {
    close("setup-modal");
    return toast(errorMessage(result), "error");
  }
  setupSecret = result.data.secret;
  const qr = String(result.data.qr || "");
  $("[data-setup-qr]").src = qr.startsWith("data:image/") ? qr : safeUrl(qr);
  $("[data-setup-secret]").textContent = setupSecret;
  showSetupStep("qr");
}

function wireStaticHandlers() {
  document.querySelectorAll("[data-close-modal]").forEach((button) =>
    button.addEventListener("click", () => button.closest("[id$='-modal']").setAttribute("hidden", "")),
  );

  $("#logout").addEventListener("click", async () => {
    await api.logout();
    toast(t("loggedOutToast"));
    window.location.assign("/signin");
  });

  $("#renew-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const key = $("#renew-key").value.trim();
    if (!key) return toast(t("enterValidLicenseToast"), "error");
    const submit = event.target.querySelector("button[type=submit]");
    setBusy(submit, true);
    const result = await api.renewLicense(key);
    setBusy(submit, false);
    if (!result.ok) return toast(errorMessage(result), "error");
    toast(result.data.message || t("licenseActivatedToast"));
    $("#renew-key").value = "";
    close("renew-modal");
    await load();
  });

  const codeInput = $("[data-setup-code]");
  codeInput.addEventListener("input", () => {
    codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 6);
    $("[data-setup-confirm]").disabled = codeInput.value.length < 6;
  });
  $("[data-copy-secret]").addEventListener("click", () => copyText(setupSecret, t("copiedToClipboardToast")));
  $("[data-setup-next]").addEventListener("click", () => {
    showSetupStep("confirm");
    codeInput.focus();
  });
  $("[data-setup-back]").addEventListener("click", () => showSetupStep("qr"));
  $("[data-setup-confirm]").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    setBusy(button, true);
    const result = await api.confirm2fa(codeInput.value);
    setBusy(button, false);
    if (!result.ok) return toast(errorMessage(result, "invalidCodeToast"), "error");
    backupCodes = result.data.backupCodes || [];
    $("[data-backup-codes]").innerHTML = backupCodes
      .map((c) => `<span class="font-mono text-[11px] text-zinc-200 text-center py-1 rounded-lg ac-bg-08">${e(c)}</span>`)
      .join("");
    showSetupStep("backup");
    toast(t("twoFaEnabledToast"));
  });
  $("[data-copy-codes]").addEventListener("click", () => copyText(backupCodes.join("\n"), t("copiedCodesToast")));
  $("[data-setup-done]").addEventListener("click", async () => {
    close("setup-modal");
    await load();
  });

  const disableForm = $("#disable-form");
  const disableSubmit = disableForm.querySelector("button[type=submit]");
  const disableCode = $("#disable-code");
  const refreshDisable = () => (disableSubmit.disabled = !$("#disable-password").value || disableCode.value.length !== 6);
  $("#disable-password").addEventListener("input", refreshDisable);
  disableCode.addEventListener("input", () => {
    disableCode.value = disableCode.value.replace(/\D/g, "").slice(0, 6);
    refreshDisable();
  });
  disableForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBusy(disableSubmit, true);
    const result = await api.disable2fa({ password: $("#disable-password").value, code: disableCode.value });
    setBusy(disableSubmit, false);
    if (!result.ok) return toast(errorMessage(result), "error");
    toast(t("twoFaDisabledToast"));
    close("disable-modal");
    disableForm.reset();
    refreshDisable();
    await load();
  });

  // Tab bar and tab content are re-rendered, so their handlers are delegated.
  $("#tabs").addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) selectTab(tab.dataset.tab);
  });
  $("#tab-content").addEventListener("click", async (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.matches("[data-open-renew]")) {
      open("renew-modal");
      $("#renew-key").focus();
    } else if (target.matches("[data-open-setup]")) {
      openSetup();
    } else if (target.matches("[data-open-disable]")) {
      open("disable-modal");
    } else if (target.matches("[data-copy-hwid]")) {
      copyText(data.user.hwid, t("hwidCopiedToast"));
    } else if (target.matches("[data-reset-hwid]")) {
      hwidBusy = true;
      renderTabs();
      const result = await api.resetHwid();
      hwidBusy = false;
      if (!result.ok) {
        renderTabs();
        return toast(result.data.error === "cooldown_active" ? t("hwidCooldownToast") : errorMessage(result), "error");
      }
      toast(t("hwidResetSuccessToast"));
      await load();
    } else if (target.matches("[data-kill-session]")) {
      setBusy(target, true);
      const result = await api.killSession(Number(target.dataset.killSession));
      if (!result.ok) {
        setBusy(target, false);
        return toast(errorMessage(result), "error");
      }
      toast(t("sessionTerminatedToast"));
      await load();
    } else if (target.matches("[data-resource]")) {
      const button = data.app.buttons.find((b) => String(b.id) === target.dataset.resource);
      const url = button && /^https?:/i.test(button.value) ? safeUrl(button.value) : "";
      if (url) window.open(url, "_blank", "noopener");
      else if (button) toast(button.text, "info");
    }
  });
  $("#tab-content").addEventListener("submit", async (event) => {
    if (event.target.id !== "account-form") return;
    event.preventDefault();
    const form = event.target;
    const username = $("#acc-username").value.trim();
    const avatarUrl = $("#acc-avatar").value.trim();
    const payload = {
      newUsername: username !== data.user.username ? username : undefined,
      currentPassword: $("#acc-current").value || undefined,
      newPassword: $("#acc-new").value || undefined,
      avatarUrl: avatarUrl !== (data.user.avatarUrl || "") ? avatarUrl : undefined,
      totpCode: $("#acc-totp")?.value || undefined,
    };
    const invalid = checkAccount(payload);
    if (invalid) return toast(t(invalid), "error");
    const submit = form.querySelector("button[type=submit]");
    setBusy(submit, true);
    const result = await api.updateAccount(payload);
    setBusy(submit, false);
    if (!result.ok) return toast(errorMessage(result), "error");
    toast(t("accountUpdatedToast"));
    await load();
  });
}

export async function mountDashboard() {
  if (!PORTAL_ID) return window.location.replace("/signin"); // Shows the configuration notice.
  const requested = new URLSearchParams(window.location.search).get("tab");
  if (TABS.some((tab) => tab.id === requested)) activeTab = requested;
  document.querySelectorAll("[data-lang-dropdown]").forEach(mountLangDropdown);
  wireStaticHandlers();
  window.addEventListener("na:lang", () => {
    if (!data) return;
    renderChrome();
    // The account form keeps what the user typed; only its labels change.
    if (activeTab === "account") applyTranslations($("#tab-content"));
    else renderTabs();
    if (setupStep && !$("#setup-modal").hidden) showSetupStep(setupStep);
  });
  if (await load()) selectTab(activeTab);
}
