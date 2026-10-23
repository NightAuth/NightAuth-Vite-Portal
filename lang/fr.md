# NightAuth Custom Customer Portal (Vite) — Mettez-nous une étoile sur GitHub ⭐

Modèle officiel de portail client auto-hébergé pour [NightAuth](https://nightauth.org). Développé avec **Vite** et **TailwindCSS**, ce modèle reproduit fidèlement le portail client intégré de NightAuth (même conception visuelle, flux complets d'authentification et de gestion de licences, et internationalisation native en 10 langues) en consommant l'API `/api/customer/*`.

Portail Officiel : [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!TIP]
> ### 🔒 Gestionnaire de Paquets Recommandé : pnpm
> Nous recommandons vivement d'utiliser **pnpm** (`pnpm install -g pnpm` ou `corepack enable`) au lieu de npm. **pnpm** offre une sécurité accrue de la chaîne d'approvisionnement, un stockage adressable par contenu, une isolation stricte des `node_modules` et une intégrité déterministe du lockfile.

---

> [!NOTE]
> ### 📺 Tutoriels Vidéo et Guides de Configuration
> Des tutoriels vidéo officiels et des guides détaillés expliquant comment configurer les applications, les abonnements, les variables cloud, les webhooks et les portails clients seront bientôt disponibles sur notre portail et notre chaîne YouTube.

---

## Pages et Flux Inclus

| Page | Description | Endpoints Consommés |
| :--- | :--- | :--- |
| `/signin` | Connexion avec identifiants utilisateur ou clé de licence | `auth/signin` |
| `/signup` | Activation d'une clé de licence et création d'un compte | `auth/signup` |
| `/2fa-required` | Authentification à deux facteurs (TOTP ou codes de secours) | `auth/2fa-verify` |
| `/forgot-password` · `/reset-password?token=` | Flux complet de récupération de mot de passe en libre-service | `auth/forgot-password`, `auth/reset-password` |
| `/` | Tableau de bord client : aperçu, réinitialisation HWID, téléchargements, sessions et 2FA | `data`, `actions/*`, `account`, `account/2fa/*` |

---

## Caractéristiques

- 🎨 **Système de Design NightAuth** : Arrière-plan sombre `#060608` avec grille animée, cartes transparentes, et couleur d'accentuation dynamique récupérée depuis `/api/customer/info`.
- 🌐 **Internationalisation Native en 10 Langues** : Support complet pour l'anglais, l'espagnol, l'allemand, le français, l'italien, le polonais, le portugais, le russe, le turc et le chinois avec sélecteur de drapeaux interactif.
- 📱 **Adaptation Dynamique des Paramètres** : Respecte les règles d'application (inscriptions fermées, récupération de mot de passe désactivée, statut de maintenance, et visibilité conditionnelle des téléchargements ou réinitialisations de HWID).
- ⚡ **Client Sans Framework** : HTML statique pur et JavaScript modulaire ES pour des temps de chargement ultra-rapides et une consommation minimale de ressources.
- 🔒 **Chiffrement des Identifiants de Bout en Bout (Boîtes Scellées libsodium)** : Les données sensibles (mots de passe, codes 2FA, clés) sont scellées dans le navigateur avec la clé publique du serveur (`crypto_box_seal`) avant transmission.
- 🛡️ **Captcha Cap Intégré** : Preuve de travail respectueuse de la vie privée avec vérification locale WebAssembly (WASM).
- 🐳 **Prêt pour Docker et Docker Compose** : Image multi-étapes optimisée pour la production s'exécutant sous un utilisateur non-root.

---

## Prérequis

- **Node.js** : `v18.0.0` ou supérieur.
- **pnpm** : `v9.0.0` ou supérieur (recommandé : `v11.x`).
- **Instance NightAuth** : Soit [https://nightauth.org](https://nightauth.org), soit une instance auto-hébergée.

---

## Installation et Configuration

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/NightAuth/NightAuth-Vite-Portal.git
   cd NightAuth-Vite-Portal
   ```

2. **Installer les dépendances avec pnpm** :
   ```bash
   pnpm install
   ```

3. **Configurer les variables d'environnement** :
   ```bash
   cp .env.example .env
   ```
   Éditez `.env` :
   ```env
   PUBLIC_NIGHTAUTH_API_URL=https://nightauth.org
   PUBLIC_NIGHTAUTH_PORTAL_ID=votre_portal_id_ici
   PUBLIC_NIGHTAUTH_APP_NAME="Mon Application"
   ```

---

## Exécution du Portail

### Développement Local

```bash
pnpm dev
```
Ouvrez [http://localhost:4321](http://localhost:4321).

### Build de Production

```bash
pnpm build
pnpm preview
```

---

## Déploiement avec Docker

```bash
docker compose up -d --build
```

---

## Licence

Ce logiciel est sous licence [Elastic License 2.0](../LICENSE).
