# NightAuth Custom Customer Portal (Vite) — Gib uns einen Stern auf GitHub ⭐

Offizielle selbst gehostete Kundenportal-Vorlage für [NightAuth](https://nightauth.org). Entwickelt mit **Vite** und **TailwindCSS**, repliziert diese Vorlage das integrierte NightAuth-Kundenportal (gleiches visuelles Design, vollständige Authentifizierungs- und Lizenzierungsabläufe sowie native Internationalisierung in 10 Sprachen) über die API `/api/customer/*`.

Offizielles Portal: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!TIP]
> ### 🔒 Empfohlener Paketmanager: pnpm
> Wir empfehlen dringend die Verwendung von **pnpm** (`pnpm install -g pnpm` oder `corepack enable`) anstelle von npm. **pnpm** bietet erstklassige Sicherheit der Lieferkette, inhaltsadressierten Speicher und strikte `node_modules`-Isolation.

---

> [!NOTE]
> ### 📺 Video-Tutorials & Einrichtungsanleitungen
> Offizielle Video-Tutorials und Anleitungen zur Konfiguration von Anwendungen, Lizenzen und Kundenportalen im NightAuth-Dashboard werden in Kürze auf unserem Portal und YouTube-Kanal veröffentlicht.

---

## Enthaltene Seiten & Workflows

| Seite | Beschreibung | Genutzte Endpunkte |
| :--- | :--- | :--- |
| `/signin` | Anmeldung mit Benutzerdaten oder Lizenzschlüssel | `auth/signin` |
| `/signup` | Lizenzschlüssel aktivieren und Benutzerkonto erstellen | `auth/signup` |
| `/2fa-required` | Zwei-Faktor-Authentifizierung (TOTP oder Wiederherstellungscodes) | `auth/2fa-verify` |
| `/forgot-password` · `/reset-password?token=` | Vollständiger Passwort-Wiederherstellungsablauf | `auth/forgot-password`, `auth/reset-password` |
| `/` | Kunden-Dashboard: Übersicht, HWID-Reset, Downloads, Sitzungen und 2FA | `data`, `actions/*`, `account`, `account/2fa/*` |

---

## Funktionen

- 🎨 **Original NightAuth Design-System**: Dunkler Hintergrund `#060608` mit interaktivem Gitter und dynamischer Akzentfarbe aus `/api/customer/info`.
- 🌐 **Native 10-Sprachen-Unterstützung**: Englisch, Spanisch, Deutsch, Französisch, Italienisch, Polnisch, Portugiesisch, Russisch, Türkisch und Chinesisch mit interaktiver Flaggenauswahl.
- 📱 **Dynamische Einstellungsanpassung**: Reagiert automatisch auf geschlossene Registrierungen, deaktivierte Passwort-Resets und Wartungszustände.
- ⚡ **Zero-Framework-Client**: Reines statisches HTML mit modularem ES JavaScript für minimale Ladezeiten und Ressourcenverbrauch.
- 🔒 **Ende-zu-Ende-Verschlüsselung (libsodium Sealed Boxes)**: Vertrauliche Anmeldedaten werden im Browser mit dem öffentlichen Schlüssel des Servers versiegelt (`crypto_box_seal`).
- 🛡️ **Integriertes Cap-Captcha**: Datenschutzfreundliche Proof-of-Work-Validierung über lokales WebAssembly (WASM).
- 🐳 **Docker- & Docker-Compose-Unterstützung**: Mehrstufiges Image für den produktiven Betrieb unter einem unprivilegierten Benutzer.

---

## Installation & Einrichtung

1. **Repository klonen**:
   ```bash
   git clone https://github.com/NightAuth/NightAuth-Vite-Portal.git
   cd NightAuth-Vite-Portal
   ```

2. **Abhängigkeiten mit pnpm installieren**:
   ```bash
   pnpm install
   ```

3. **Umgebungsvariablen konfigurieren**:
   ```bash
   cp .env.example .env
   ```
   Passen Sie `.env` an:
   ```env
   PUBLIC_NIGHTAUTH_API_URL=https://nightauth.org
   PUBLIC_NIGHTAUTH_PORTAL_ID=ihre_portal_id_hier
   PUBLIC_NIGHTAUTH_APP_NAME="Meine Anwendung"
   ```

---

## Portal starten

### Lokale Entwicklung

```bash
pnpm dev
```
Öffnen Sie [http://localhost:4321](http://localhost:4321).

### Produktions-Build

```bash
pnpm build
pnpm preview
```

---

## Docker-Bereitstellung

```bash
docker compose up -d --build
```

---

## Lizenz

Diese Software ist unter der [Elastic License 2.0](../LICENSE) lizenziert.
