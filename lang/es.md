# NightAuth Custom Customer Portal (Vite) — Danos una estrella en GitHub ⭐

Plantilla oficial de portal de cliente auto-alojado para [NightAuth](https://nightauth.org). Desarrollada con **Vite** y **TailwindCSS**, esta plantilla replica fielmente el portal de clientes integrado de NightAuth (misma estética visual, ciclo completo de autenticación y licencias, e internacionalización nativa en 10 idiomas) consumiendo la API `/api/customer/*`.

Portal Oficial: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!TIP]
> ### 🔒 Gestor de Paquetes Recomendado: pnpm
> Recomendamos enfáticamente utilizar **pnpm** (`pnpm install -g pnpm` o `corepack enable`) en lugar de npm. **pnpm** proporciona mayor seguridad en la cadena de suministro, almacenamiento eficiente basado en contenido, aislamiento estricto de `node_modules` (evitando dependencias fantasma) e integridad determinista en el lockfile.

---

> [!NOTE]
> ### 📺 Tutoriales en Video y Guías de Configuración
> Los video-tutoriales oficiales y las guías paso a paso para configurar aplicaciones, planes, suscripciones, variables en la nube, webhooks y portales de cliente en el Panel de NightAuth serán publicados próximamente en nuestro portal oficial y canal de YouTube.

---

## Páginas y Flujos Incluidos

| Página | Descripción | Endpoints Consumidos |
| :--- | :--- | :--- |
| `/signin` | Inicio de sesión con cuenta de usuario o clave de licencia | `auth/signin` |
| `/signup` | Activar clave de licencia y registrar credenciales | `auth/signup` |
| `/2fa-required` | Autenticación de dos factores (TOTP autenticador o códigos de respaldo) | `auth/2fa-verify` |
| `/forgot-password` · `/reset-password?token=` | Flujo de recuperación de contraseña autoservicio | `auth/forgot-password`, `auth/reset-password` |
| `/` | Panel de Cliente: resumen, reseteo HWID, descargas, sesiones y 2FA | `data`, `actions/*`, `account`, `account/2fa/*` |

---

## Características

- 🎨 **Diseño Oficial NightAuth**: Fondo oscuro profundo `#060608` con cuadrícula interactiva animada, tarjetas translúcidas de cristal, transiciones fluidas y color de acento dinámico obtenido automáticamente de los ajustes del portal (`/api/customer/info`).
- 🌐 **Internacionalización Nativa en 10 Idiomas**: Soporte completo para inglés, español, alemán, francés, italiano, polaco, portugués, ruso, turco y chino con selector interactivo de banderas. Utiliza la misma clave de `localStorage` que el portal nativo para preservar la preferencia del usuario.
- 📱 **Adaptación Dinámica a Ajustes**: Respeta automáticamente las restricciones de la aplicación (registro deshabilitado, recuperación de contraseña cerrada, estado pausado o inactivo, y visibilidad condicional de reset de HWID, descargas y cierre de sesiones activas).
- ⚡ **Cliente Sin Frameworks**: HTML estático puro con JavaScript modular ES para carga ultrarrápida, cero sobrecarga de runtime y mínimo consumo de recursos.
- 🔒 **Cifrado de Credenciales Extremo a Extremo (Sealed Boxes libsodium)**: Las cargas sensibles (contraseñas, códigos 2FA, tokens de recuperación, licencias) se sellan en el navegador con la clave pública del servidor (`crypto_box_seal`) antes de viajar. Los intermediarios, proxies inversos y CDNs no pueden descifrar credenciales.
- 🛡️ **Captcha Cap Integrado**: Prueba de trabajo (proof-of-work) respetuosa con la privacidad con verificación local por WebAssembly (WASM). Sin rastreo de terceros, sin CDNs externas y sin necesidad de configurar CORS.
- 🐳 **Listo para Docker y Docker Compose**: Imagen multi-etapa optimizada para producción con ejecución bajo usuario sin privilegios root.

---

## Requisitos Previos

- **Node.js**: `v18.0.0` o superior.
- **pnpm**: `v9.0.0` o superior (recomendado: `v11.x`).
- **Instancia de NightAuth**: Ya sea [https://nightauth.org](https://nightauth.org) o una instancia auto-alojada.

---

## Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/NightAuth/NightAuth-Vite-Portal.git
   cd NightAuth-Vite-Portal
   ```

2. **Instalar dependencias con pnpm**:
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**:
   Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
   Edita `.env` y define tu configuración:
   ```env
   # Instancia oficial o tu URL auto-alojada
   PUBLIC_NIGHTAUTH_API_URL=https://nightauth.org

   # ID público del Portal de Cliente desde el Panel de NightAuth
   # (Panel -> Ajustes de la Aplicación -> Portal de Cliente)
   PUBLIC_NIGHTAUTH_PORTAL_ID=tu_portal_id_aqui

   # Opcional: Nombre provisional de la app mientras cargan los ajustes
   PUBLIC_NIGHTAUTH_APP_NAME="Mi Aplicación"
   ```

> [!WARNING]
> **Nunca coloques una Business API Key (`biz_...`) en este proyecto.**
> Todas las variables `PUBLIC_` se compilan en el JavaScript del cliente y son visibles en el navegador. El portal de clientes únicamente necesita el `PORTAL_ID` público.

---

## Ejecución del Portal

### Desarrollo Local

Inicia el servidor de desarrollo Vite con el proxy de API integrado:
```bash
pnpm dev
```
Abre tu navegador en [http://localhost:4321](http://localhost:4321). El proxy reenvía todas las llamadas `/api/*` directamente a la URL configurada en `PUBLIC_NIGHTAUTH_API_URL` y adapta las cookies `__Host-` para `http://localhost`.

### Compilación para Producción

Genera los archivos estáticos optimizados en `dist/`:
```bash
pnpm build
```

Previsualiza la compilación de producción en local:
```bash
pnpm preview
```

---

## Despliegue en Producción (Dominio Propio)

Para desplegar en tu propio dominio (ej. `portal.tuempresa.com`):

1. **Registrar el dominio personalizado**:
   Ve a Panel de NightAuth → Ajustes de la Aplicación → *Dominio personalizado* y añade tu dominio. NightAuth rechaza solicitudes con error `unknown_domain` si el host no está registrado.
2. **Servir los archivos estáticos (`dist/`)**:
   Despliega el directorio `dist/` en tu servidor web (Nginx, Caddy, Cloudflare Pages, etc.).
3. **Configurar el proxy inverso**:
   Configura tu servidor web para reenviar `/api/*` a NightAuth conservando la cabecera `Host` original:
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
     portal.tuempresa.com {
         root * /var/www/portal/dist
         file_server
         try_files {path} {path}/index.html /index.html

         reverse_proxy /api/* https://nightauth.org
     }
     ```
4. **HTTPS Obligatorio**:
   HTTPS es estrictamente obligatorio: las cookies de sesión `__Host-customer-session` son rechazadas por los navegadores en conexiones HTTP inseguras.

---

## Despliegue con Docker

### Con Docker Compose (Recomendado)

1. Configura tu archivo `.env` con `PUBLIC_NIGHTAUTH_PORTAL_ID` y `PUBLIC_NIGHTAUTH_API_URL`.
2. Inicia el contenedor:
   ```bash
   docker compose up -d --build
   ```
3. Verifica el estado:
   ```bash
   docker compose ps
   docker compose logs -f
   ```

### Con Docker CLI

Compila la imagen:
```bash
docker build -t nightauth-vite-portal .
```

Ejecuta el contenedor:
```bash
docker run -d \
  --name nightauth-vite-portal \
  -p 4321:4321 \
  --env-file .env \
  --restart unless-stopped \
  nightauth-vite-portal
```

---

## Mantenimiento y Sincronización con el Monorepo

Las traducciones (`src/i18n/portal-translations.js`), iconos (`src/lib/icons.js`), banderas (`public/flags/`) y archivos de Cap (`public/cap/`) se sincronizan directamente con el portal oficial.

Para re-sincronizar los activos:
```bash
pnpm exec tsx scripts/sync-from-nightauth.mts
```

---

## Licencia

Este software está licenciado bajo los términos de la [Elastic License 2.0](../LICENSE).
