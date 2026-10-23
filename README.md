# NightAuth Custom Customer Portal (Vite) — Star us on GitHub ⭐

Official self-hosted customer portal template for [NightAuth](https://nightauth.org). Built with **Vite** and **TailwindCSS**, this template replicates the native NightAuth customer portal (identical visual aesthetic, complete authentication and licensing lifecycle, and native 10-language internationalization) consuming the `/api/customer/*` API.

Official Portal: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](README.md) • [Español](lang/es.md) • [Français](lang/fr.md) • [Deutsch](lang/de.md) • [Italiano](lang/it.md) • [Português](lang/pt.md) • [Русский](lang/ru.md) • [Türkçe](lang/tr.md) • [Polski](lang/pl.md) • [中文](lang/zh.md)

---

> [!TIP]
> ### 🔒 Recommended Package Manager: pnpm
> We strongly recommend using **pnpm** (`pnpm install -g pnpm` or `corepack enable`) instead of npm. **pnpm** provides superior supply-chain security, content-addressable storage, strict non-flat `node_modules` isolation (preventing phantom dependencies), and deterministic lockfile integrity.

---

> [!NOTE]
> ### 📺 Video Tutorials & System Setup Guides
> Official video tutorials and step-by-step guides explaining how to configure applications, plans, subscriptions, cloud variables, webhooks, and customer portals in the NightAuth Dashboard will be published soon on our official portal and YouTube channel.

---

## Included Pages & Workflows

| Page | Description | Endpoints Consumed |
| :--- | :--- | :--- |
| `/signin` | Login with user account credentials or raw license key | `auth/signin` |
| `/signup` | Activate a license key and register new user credentials | `auth/signup` |
| `/2fa-required` | Two-factor authentication (TOTP authenticator or recovery codes) | `auth/2fa-verify` |
| `/forgot-password` · `/reset-password?token=` | Complete self-service password recovery flow | `auth/forgot-password`, `auth/reset-password` |
| `/` | Customer Dashboard: overview, HWID reset, downloads, sessions, and 2FA | `data`, `actions/*`, `account`, `account/2fa/*` |

---

## Features

- 🎨 **Original NightAuth Design System**: Deep dark `#060608` background with dynamic interactive canvas grid, glassmorphic cards, smooth transitions, and dynamic accent colors loaded automatically from your portal settings (`/api/customer/info`).
- 🌐 **Native 10-Language Internationalization**: Complete support for English, Spanish, German, French, Italian, Polish, Portuguese, Russian, Turkish, and Chinese with interactive flag selector. Uses the exact same `localStorage` key as the built-in portal so the user's language preference is seamlessly preserved.
- 📱 **Dynamic Feature Adaptation**: Automatically adapts to application settings (disabled public registration, disabled password resets, active/paused portal status, and conditional visibility for HWID resets, file downloads, and active session termination).
- ⚡ **Zero-Framework Client**: Pure static HTML + modular ES JavaScript for instant load times, zero client runtime bloat, and minimal resource consumption.
- 🔒 **End-to-End Credential Encryption (libsodium sealed boxes)**: Sensitive authentication payloads (passwords, 2FA codes, reset tokens, license keys) are sealed in the browser with the server's public key (`crypto_box_seal`) before transmission. Intermediaries, reverse proxies, and CDNs cannot decrypt or inspect credentials.
- 🛡️ **Integrated Cap Captcha**: Built-in privacy-respecting proof-of-work captcha with local WASM challenge verification. No third-party tracking, external CDN dependencies, or CORS setup required.
- 🐳 **Docker & Docker Compose Ready**: Production-optimized multi-stage Docker build running under a non-root user.

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher.
- **pnpm**: `v9.0.0` or higher (recommended: `v11.x`).
- **NightAuth Instance**: Either [https://nightauth.org](https://nightauth.org) or a self-hosted instance.

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NightAuth/NightAuth-Vite-Portal.git
   cd NightAuth-Vite-Portal
   ```

2. **Install dependencies with pnpm**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your configuration:
   ```env
   # Official cloud instance or your self-hosted URL
   PUBLIC_NIGHTAUTH_API_URL=https://nightauth.org

   # Public Customer Portal ID from NightAuth Dashboard
   # (Dashboard -> Application Settings -> Customer Portal)
   PUBLIC_NIGHTAUTH_PORTAL_ID=your_portal_id_here

   # Optional: Fallback application title during initial load
   PUBLIC_NIGHTAUTH_APP_NAME="My Application"
   ```

> [!WARNING]
> **Never include a Business API Key (`biz_...`) in this project.**
> All `PUBLIC_` variables are bundled into client-side JavaScript and visible in the browser. The customer portal only requires your public `PORTAL_ID`.

---

## Running the Portal

### Local Development

Start the local Vite development server with the built-in API proxy:
```bash
pnpm dev
```
Open your browser at [http://localhost:4321](http://localhost:4321). The development server proxies all `/api/*` calls directly to your configured `PUBLIC_NIGHTAUTH_API_URL` and translates `__Host-` cookies for `http://localhost`.

### Production Build

Generate the optimized static output in `dist/`:
```bash
pnpm build
```

Preview the production build locally:
```bash
pnpm preview
```

---

## Production Deployment (Custom Domain)

To deploy on your own domain (e.g. `portal.yourcompany.com`):

1. **Register your custom domain**:
   Navigate to NightAuth Dashboard → Application Settings → *Custom Domain* and add your domain. NightAuth rejects requests with an `unknown_domain` error if the domain is not registered.
2. **Serve static files (`dist/`)**:
   Deploy the `dist/` directory to your web server (Nginx, Caddy, Cloudflare Pages, etc.).
3. **Configure reverse proxy**:
   Configure your web server to proxy `/api/*` requests to NightAuth while preserving the original `Host` header:
   - **Nginx**:
     ```nginx
     location /api/ {
         proxy_pass https://nightauth.org/api/;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header X-Forwarded-Proto $scheme;
     }
     ```
   - **Caddy**:
     ```caddy
     portal.yourcompany.com {
         root * /var/www/portal/dist
         file_server
         try_files {path} {path}/index.html /index.html

         reverse_proxy /api/* https://nightauth.org
     }
     ```
4. **Enforce HTTPS**:
   HTTPS is strictly required because NightAuth session tokens use `__Host-customer-session` cookies which modern browsers reject over insecure HTTP.

---

## Docker Deployment

### Using Docker Compose (Recommended)

1. Ensure your `.env` file is configured with `PUBLIC_NIGHTAUTH_PORTAL_ID` and `PUBLIC_NIGHTAUTH_API_URL`.
2. Start the container:
   ```bash
   docker compose up -d --build
   ```
3. Check running status:
   ```bash
   docker compose ps
   docker compose logs -f
   ```

### Using Standalone Docker CLI

Build the container image:
```bash
docker build -t nightauth-vite-portal .
```

Run the container:
```bash
docker run -d \
  --name nightauth-vite-portal \
  -p 4321:4321 \
  --env-file .env \
  --restart unless-stopped \
  nightauth-vite-portal
```

---

## Maintenance & Monorepo Synchronization

Translations (`src/i18n/portal-translations.js`), icons (`src/lib/icons.js`), flags (`public/flags/`), and Cap assets (`public/cap/`) mirror the official NightAuth customer portal.

To re-synchronize assets from the NightAuth repository:
```bash
pnpm exec tsx scripts/sync-from-nightauth.mts
```

---

## License

This software is licensed under the [Elastic License 2.0](LICENSE).
