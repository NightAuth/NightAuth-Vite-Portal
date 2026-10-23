# NightAuth Custom Customer Portal (Vite) — Zostaw gwiazdkę na GitHubie ⭐

Oficjalny szablon portalu klienta self-hosted dla [NightAuth](https://nightauth.org). Zbudowany w oparciu o **Vite** i **TailwindCSS**, wiernie odwzorowuje wbudowany portal klienta NightAuth (ten sam styl graficzny, pełne cykle uwierzytelniania i licencjonowania oraz natywna lokalizacja w 10 językach) korzystając z API `/api/customer/*`.

Oficjalny portal: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!TIP]
> ### 🔒 Zalecany menedżer pakietów: pnpm
> Zdecydowanie zalecamy używanie **pnpm** (`pnpm install -g pnpm` lub `corepack enable`) zamiast npm. **pnpm** zapewnia najwyższy poziom bezpieczeństwa łańcucha dostaw, ścisłą izolację `node_modules` i deterministyczną spójność pliku blokady.

---

> [!NOTE]
> ### 📺 Samouczki wideo i przewodniki konfiguracji
> Oficjalne poradniki wideo i przewodniki krok po kroku dotyczące konfiguracji aplikacji, licencji i portali klientów pojawią się wkrótce na naszym portalu i kanale YouTube.

---

## Dostępne strony i przepływy

| Strona | Opis | Wykorzystywane endpointy |
| :--- | :--- | :--- |
| `/signin` | Logowanie danymi konta lub kluczem licencyjnym | `auth/signin` |
| `/signup` | Aktywacja klucza licencyjnego i rejestracja konta | `auth/signup` |
| `/2fa-required` | Uwierzytelnianie dwuskładnikowe (TOTP lub kody zapasowe) | `auth/2fa-verify` |
| `/forgot-password` · `/reset-password?token=` | Przepływ samodzielnego resetowania hasła | `auth/forgot-password`, `auth/reset-password` |
| `/` | Panel klienta: przegląd, reset HWID, pliki do pobrania, sesje i 2FA | `data`, `actions/*`, `account`, `account/2fa/*` |

---

## Funkcje

- 🎨 **Oryginalny design NightAuth**: Ciemne tło `#060608` z animowaną siatką, półprzezroczystymi kartami i dynamicznym kolorem akcentu z `/api/customer/info`.
- 🌐 **Natywne wsparcie dla 10 języków**: Angielski, hiszpański, niemiecki, francuski, włoski, polski, portugalski, rosyjski, turecki i chiński z interaktywnym przełącznikiem flag.
- 📱 **Dynamiczne dostosowanie do ustawień**: Automatycznie uwzględnia wyłączoną rejestrację, zablokowany reset haseł oraz stan prac konserwacyjnych.
- ⚡ **Klient bez frameworków**: Czysty statyczny HTML i modułowy ES JavaScript zapewniający błyskawiczny czas ładowania.
- 🔒 **Szyfrowanie poświadczeń End-to-End (Zapieczętowane skrzynki libsodium)**: Poufne dane są pieczętowane w przeglądarce kluczem publicznym serwera (`crypto_box_seal`) przed wysłaniem.
- 🛡️ **Zintegrowana weryfikacja Cap Captcha**: Ochrona proof-of-work z lokalną weryfikacją WebAssembly (WASM).
- 🐳 **Wsparcie dla Docker i Docker Compose**: Zoptymalizowany wieloetapowy obraz uruchamiany przez użytkownika bez uprawnień roota.

---

## Instalacja i konfiguracja

1. **Sklonuj repozytorium**:
   ```bash
   git clone https://github.com/NightAuth/NightAuth-Vite-Portal.git
   cd NightAuth-Vite-Portal
   ```

2. **Zainstaluj zależności za pomocą pnpm**:
   ```bash
   pnpm install
   ```

3. **Skonfiguruj zmienne środowiskowe**:
   ```bash
   cp .env.example .env
   ```
   Dostosuj `.env`:
   ```env
   PUBLIC_NIGHTAUTH_API_URL=https://nightauth.org
   PUBLIC_NIGHTAUTH_PORTAL_ID=twoj_portal_id_tutaj
   PUBLIC_NIGHTAUTH_APP_NAME="Moja Aplikacja"
   ```

---

## Uruchamianie portalu

### Środowisko deweloperskie

```bash
pnpm dev
```
Otwórz [http://localhost:4321](http://localhost:4321).

### Budowanie produkcyjne

```bash
pnpm build
pnpm preview
```

---

## Wdrożenie z Dockerem

```bash
docker compose up -d --build
```

---

## Licencja

Oprogramowanie jest udostępniane na warunkach licencji [Elastic License 2.0](../LICENSE).
