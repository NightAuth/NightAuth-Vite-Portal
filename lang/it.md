# NightAuth Custom Customer Portal (Vite) — Dacci una stella su GitHub ⭐

Modello ufficiale di portale clienti self-hosted per [NightAuth](https://nightauth.org). Sviluppato con **Vite** e **TailwindCSS**, questo template replica fedelmente il portale clienti integrato di NightAuth (stessa estetica, ciclo completo di autenticazione e licenze, e internazionalizzazione nativa in 10 lingue) consumando l'API `/api/customer/*`.

Portale Ufficiale: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!TIP]
> ### 🔒 Gestore di Pacchetti Consigliato: pnpm
> Raccomandiamo fortemente l'uso di **pnpm** (`pnpm install -g pnpm` o `corepack enable`) al posto di npm. **pnpm** offre una sicurezza superiore della supply chain, archiviazione content-addressable e isolamento rigoroso di `node_modules`.

---

> [!NOTE]
> ### 📺 Tutorial Video e Guide di Configurazione
> Video tutorial ufficiali e guide passo-passo per configurare applicazioni, licenze e portali clienti saranno presto disponibili sul nostro portale e sul canale YouTube.

---

## Pagine e Flussi Inclusi

| Pagina | Descrizione | Endpoint Consumati |
| :--- | :--- | :--- |
| `/signin` | Accesso con credenziali account o chiave licenza | `auth/signin` |
| `/signup` | Attivazione chiave di licenza e registrazione account | `auth/signup` |
| `/2fa-required` | Autenticazione a due fattori (TOTP o codici di recupero) | `auth/2fa-verify` |
| `/forgot-password` · `/reset-password?token=` | Flusso completo di recupero password | `auth/forgot-password`, `auth/reset-password` |
| `/` | Dashboard cliente: panoramica, reset HWID, download, sessioni e 2FA | `data`, `actions/*`, `account`, `account/2fa/*` |

---

## Caratteristiche

- 🎨 **Design Ufficiale NightAuth**: Sfondo scuro `#060608` con griglia dinamica interattiva, schede semitrasparenti e colore d'accento ricavato da `/api/customer/info`.
- 🌐 **Internazionalizzazione Nativa in 10 Lingue**: Supporto completo per inglese, spagnolo, tedesco, francese, italiano, polacco, portoghese, russo, turco e cinese con selettore di bandiere interattivo.
- 📱 **Adattamento Dinamico**: Rispetta automaticamente le impostazioni dell'app (registrazioni chiuse, recupero password disabilitato, stato di manutenzione o offline).
- ⚡ **Client Zero-Framework**: Puro HTML statico e JavaScript modulare ES per tempi di caricamento istantanei.
- 🔒 **Crittografia Credenziali End-to-End (Scatole Sigillate libsodium)**: I dati sensibili vengono sigillati nel browser con la chiave pubblica del server (`crypto_box_seal`) prima della trasmissione.
- 🛡️ **Captcha Cap Integrato**: Proof-of-work locale con verifica WebAssembly (WASM) senza CDN esterne.
- 🐳 **Pronto per Docker e Docker Compose**: Immagine ottimizzata per la produzione con esecuzione come utente non-root.

---

## Installazione e Configurazione

1. **Clonare il repository**:
   ```bash
   git clone https://github.com/NightAuth/NightAuth-Vite-Portal.git
   cd NightAuth-Vite-Portal
   ```

2. **Installare le dipendenze con pnpm**:
   ```bash
   pnpm install
   ```

3. **Configurare le variabili di ambiente**:
   ```bash
   cp .env.example .env
   ```
   Modifica `.env`:
   ```env
   PUBLIC_NIGHTAUTH_API_URL=https://nightauth.org
   PUBLIC_NIGHTAUTH_PORTAL_ID=il_tuo_portal_id_qui
   PUBLIC_NIGHTAUTH_APP_NAME="La Mia Applicazione"
   ```

---

## Esecuzione del Portale

### Sviluppo Locale

```bash
pnpm dev
```
Apri [http://localhost:4321](http://localhost:4321).

### Build di Produzione

```bash
pnpm build
pnpm preview
```

---

## Distribuzione con Docker

```bash
docker compose up -d --build
```

---

## Licenza

Questo software è distribuito sotto licenza [Elastic License 2.0](../LICENSE).
