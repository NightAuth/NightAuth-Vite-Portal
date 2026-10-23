# NightAuth Custom Customer Portal (Vite) — Deixe uma estrela no GitHub ⭐

Modelo oficial de portal de cliente auto-hospedado para [NightAuth](https://nightauth.org). Desenvolvido com **Vite** e **TailwindCSS**, este modelo reproduz fielmente o portal de clientes nativo do NightAuth (mesma identidade visual, fluxos completos de autenticação e licenciamento, e internacionalização nativa em 10 idiomas) consumindo a API `/api/customer/*`.

Portal Oficial: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!TIP]
> ### 🔒 Gerenciador de Pacotes Recomendado: pnpm
> Recomendamos enfaticamente utilizar o **pnpm** (`pnpm install -g pnpm` ou `corepack enable`) em vez do npm. O **pnpm** fornece maior segurança na cadeia de suprimentos, armazenamento endereçável por conteúdo e isolamento estrito de `node_modules`.

---

> [!NOTE]
> ### 📺 Tutoriais em Vídeo e Guias de Configuração
> Tutoriais oficiais e guias de configuração para aplicativos, licenças e portais de cliente no Painel do NightAuth serão disponibilizados em breve em nosso portal e canal do YouTube.

---

## Páginas e Fluxos Incluídos

| Página | Descrição | Endpoints Consumidos |
| :--- | :--- | :--- |
| `/signin` | Login com credenciais de conta ou chave de licença | `auth/signin` |
| `/signup` | Ativar chave de licença e cadastrar credenciais | `auth/signup` |
| `/2fa-required` | Autenticação de dois fatores (TOTP ou códigos de recuperação) | `auth/2fa-verify` |
| `/forgot-password` · `/reset-password?token=` | Fluxo completo de recuperação de senha | `auth/forgot-password`, `auth/reset-password` |
| `/` | Painel do cliente: resumo, reset de HWID, downloads, sessões e 2FA | `data`, `actions/*`, `account`, `account/2fa/*` |

---

## Recursos

- 🎨 **Design Original NightAuth**: Fundo escuro `#060608` com grade animada, cartões translúcidos e cor de destaque obtida em `/api/customer/info`.
- 🌐 **Internacionalização Nativa em 10 Idiomas**: Suporte a inglês, espanhol, alemão, francês, italiano, polonês, português, russo, turco e chinês com seletor interativo.
- 📱 **Adaptação Dinâmica**: Adapta-se automaticamente às políticas da aplicação (registro desativado, redefinição de senha fechada, manutenções).
- ⚡ **Cliente Sem Frameworks**: HTML estático puro e JavaScript modular ES para carregamento ultrarrápido.
- 🔒 **Criptografia de Credenciais de Ponta a Ponta (Sealed Boxes libsodium)**: As credenciais são seladas no navegador com a chave pública do servidor (`crypto_box_seal`) antes do envio.
- 🛡️ **Captcha Cap Integrado**: Prova de trabalho leve com verificação WebAssembly (WASM) local.
- 🐳 **Suporte Completo a Docker e Docker Compose**: Imagem em múltiplos estágios executada sob usuário não-root.

---

## Instalação e Configuração

1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/NightAuth/NightAuth-Vite-Portal.git
   cd NightAuth-Vite-Portal
   ```

2. **Instalar dependências com pnpm**:
   ```bash
   pnpm install
   ```

3. **Configurar variáveis de ambiente**:
   ```bash
   cp .env.example .env
   ```
   Edite `.env`:
   ```env
   PUBLIC_NIGHTAUTH_API_URL=https://nightauth.org
   PUBLIC_NIGHTAUTH_PORTAL_ID=seu_portal_id_aqui
   PUBLIC_NIGHTAUTH_APP_NAME="Meu Aplicativo"
   ```

---

## Executando o Portal

### Desenvolvimento Local

```bash
pnpm dev
```
Abra [http://localhost:4321](http://localhost:4321).

### Build de Produção

```bash
pnpm build
pnpm preview
```

---

## Implantação com Docker

```bash
docker compose up -d --build
```

---

## Licença

Este software é distribuído sob os termos da [Elastic License 2.0](../LICENSE).
