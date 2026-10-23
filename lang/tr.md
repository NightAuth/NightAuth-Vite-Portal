# NightAuth Custom Customer Portal (Vite) — GitHub'da Bize Yıldız Verin ⭐

[NightAuth](https://nightauth.org) için resmi barındırılabilir müşteri portalı şablonu. **Vite** ve **TailwindCSS** ile geliştirilen bu şablon, `/api/customer/*` API'sini kullanarak NightAuth'un yerleşik müşteri portalını (birebir görsel tasarım, eksiksiz kimlik doğrulama ve lisanslama akışları ve 10 dilde yerel yerelleştirme) tam olarak yansıtır.

Resmi Portal: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!TIP]
> ### 🔒 Önerilen Paket Yöneticisi: pnpm
> npm yerine **pnpm** (`pnpm install -g pnpm` veya `corepack enable`) kullanmanızı önemle tavsiye ederiz. **pnpm**, üstün tedarik zinciri güvenliği, katı `node_modules` yalıtımı ve deterministik kilit dosyası bütünlüğü sağlar.

---

> [!NOTE]
> ### 📺 Video Eğitimleri & Kurulum Kılavuzları
> Uygulama yapılandırmaları, lisanslar ve müşteri portalları hakkındaki resmi eğitim videoları yakında portalımızda ve YouTube kanalımızda yayınlanacaktır.

---

## Dahil Edilen Sayfalar ve Akışlar

| Sayfa | Açıklama | Tüketilen Uç Noktalar |
| :--- | :--- | :--- |
| `/signin` | Kullanıcı hesabı veya lisans anahtarı ile giriş | `auth/signin` |
| `/signup` | Lisans anahtarını etkinleştirme ve hesap kaydı | `auth/signup` |
| `/2fa-required` | İki faktörlü kimlik doğrulama (TOTP veya kurtarma kodları) | `auth/2fa-verify` |
| `/forgot-password` · `/reset-password?token=` | Kendi kendine parola sıfırlama akışı | `auth/forgot-password`, `auth/reset-password` |
| `/` | Müşteri Paneli: genel bakış, HWID sıfırlama, indirmeler, oturumlar ve 2FA | `data`, `actions/*`, `account`, `account/2fa/*` |

---

## Özellikler

- 🎨 **Orijinal NightAuth Tasarımı**: `#060608` koyu arka plan, etkileşimli ızgara, yarı saydam kartlar ve `/api/customer/info` üzerinden dinamik vurgu rengi.
- 🌐 **Yerel 10 Dil Desteği**: İngilizce, İspanyolca, Almanca, Fransızca, İtalyanca, Lehçe, Portekizce, Rusça, Türkçe ve Çince bayrak seçici ile birlikte.
- 📱 **Dinamik Yapılandırma**: Kapalı kayıtlar, devre dışı bırakılmış parola sıfırlama ve bakım durumlarına otomatik olarak uyum sağlar.
- ⚡ **Framework'süz İstemci**: Minimum kaynak tüketimi ve anında yükleme süreleri için saf statik HTML ve modüler ES JavaScript.
- 🔒 **Uçtan Uca Kimlik Bilgisi Şifreleme (libsodium Sealed Boxes)**: Hassas veriler tarayıcıda sunucunun genel anahtarıyla mühürlenir (`crypto_box_seal`).
- 🛡️ **Entegre Cap Doğrulaması**: Yerel WebAssembly (WASM) ile harici CDN gerektirmeyen proof-of-work doğrulaması.
- 🐳 **Docker ve Docker Compose Desteği**: Güvenli üretim ortamı için root olmayan kullanıcı ile çalışan çok aşamalı imaj.

---

## Kurulum ve Başlangıç

1. **Depoyu klonlayın**:
   ```bash
   git clone https://github.com/NightAuth/NightAuth-Vite-Portal.git
   cd NightAuth-Vite-Portal
   ```

2. **Bağımlılıkları pnpm ile yükleyin**:
   ```bash
   pnpm install
   ```

3. **Ortam değişkenlerini ayarlayın**:
   ```bash
   cp .env.example .env
   ```
   `.env` dosyasını düzenleyin:
   ```env
   PUBLIC_NIGHTAUTH_API_URL=https://nightauth.org
   PUBLIC_NIGHTAUTH_PORTAL_ID=portal_id_buraya
   PUBLIC_NIGHTAUTH_APP_NAME="Uygulamam"
   ```

---

## Portalı Çalıştırma

### Yerel Geliştirme

```bash
pnpm dev
```
Tarayıcınızda [http://localhost:4321](http://localhost:4321) adresini açın.

### Üretim Derlemesi

```bash
pnpm build
pnpm preview
```

---

## Docker ile Dağıtım

```bash
docker compose up -d --build
```

---

## Lisans

Bu yazılım [Elastic License 2.0](../LICENSE) şartları altında lisanslanmıştır.
