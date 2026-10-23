# NightAuth Custom Customer Portal (Vite) — 在 GitHub 上为我们点亮星标 ⭐

[NightAuth](https://nightauth.org) 官方自托管客户门户模板。采用 **Vite** 与 **TailwindCSS** 构建，通过调用 `/api/customer/*` API，完美复刻 NightAuth 原生客户门户（统一的高端视觉美学、完整的认证与许可生命周期以及原生 10 种语言国际化）。

官方门户: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!TIP]
> ### 🔒 推荐包管理器：pnpm
> 我们强烈推荐使用 **pnpm**（`pnpm install -g pnpm` 或 `corepack enable`）代替 npm。**pnpm** 具备更出色的供应链安全保障、基于内容寻址的高效存储、严格的非扁平化 `node_modules` 隔离（防止幽灵依赖）以及确定性的 lockfile 一致性。

---

> [!NOTE]
> ### 📺 视频教程与系统配置指南
> 涵盖 NightAuth 控制台中应用、许可、订阅、云变量和客户门户配置的官方视频教程及详细指南即将发布在官方门户与 YouTube 频道。

---

## 包含的页面与业务流程

| 页面路径 | 描述说明 | 调用的 API 端点 |
| :--- | :--- | :--- |
| `/signin` | 使用用户账号密码或纯许可证密钥登录 | `auth/signin` |
| `/signup` | 激活许可证密钥并创建新用户凭据 | `auth/signup` |
| `/2fa-required` | 双因素身份验证（TOTP 验证器或备用恢复代码） | `auth/2fa-verify` |
| `/forgot-password` · `/reset-password?token=` | 完整的自助找回与重置密码流程 | `auth/forgot-password`, `auth/reset-password` |
| `/` | 客户控制台：概要概览、HWID 重置、文件下载、会话管理与 2FA | `data`, `actions/*`, `account`, `account/2fa/*` |

---

## 功能特性

- 🎨 **NightAuth 原生设计系统**：深邃的 `#060608` 暗黑背景、动态交互式背景网格、毛玻璃半透明卡片与来自 `/api/customer/info` 的动态品牌主题色。
- 🌐 **原生 10 种语言国际化**：完整支持英语、西班牙语、德语、法语、意大利语、波兰语、葡萄牙语、俄语、土耳其语与中文，并配备交互式国旗切换器。与内置门户共用 `localStorage` 键，无缝保持用户语言偏好。
- 📱 **动态策略自适应**：自动响应应用配置（关闭注册、禁止找回密码、维护停机状态、按需显示 HWID 解绑、文件下载与活动会话终止）。
- ⚡ **零客户端框架**：纯静态 HTML 与模块化 ES JavaScript，带来极致加载性能与极低的资源开销。
- 🔒 **端到端凭据密封加密（libsodium 密封盒）**：敏感认证数据在发送前由浏览器使用服务器公钥密封加密（`crypto_box_seal`）。中间代理、反向代理与 CDN 均无法解密或窥探凭据。
- 🛡️ **内置 Cap 人机验证**：本地 WebAssembly (WASM) 工作量证明（PoW）验证，无第三方追踪，无需外部 CDN，无需配置跨域（CORS）。
- 🐳 **支持 Docker 与 Docker Compose**：经生产优化的多阶段构建镜像，运行于非 root 安全用户。

---

## 环境要求

- **Node.js**：`v18.0.0` 或更高版本。
- **pnpm**：`v9.0.0` 或更高版本（推荐 `v11.x`）。
- **NightAuth 实例**：[https://nightauth.org](https://nightauth.org) 或自托管实例。

---

## 安装与快速上手

1. **克隆代码库**：
   ```bash
   git clone https://github.com/NightAuth/NightAuth-Vite-Portal.git
   cd NightAuth-Vite-Portal
   ```

2. **使用 pnpm 安装依赖**：
   ```bash
   pnpm install
   ```

3. **配置环境变量**：
   ```bash
   cp .env.example .env
   ```
   编辑 `.env`：
   ```env
   PUBLIC_NIGHTAUTH_API_URL=https://nightauth.org
   PUBLIC_NIGHTAUTH_PORTAL_ID=此处填写您的_portal_id
   PUBLIC_NIGHTAUTH_APP_NAME="我的应用名称"
   ```

---

## 运行门户

### 本地开发模式

```bash
pnpm dev
```
在浏览器中打开 [http://localhost:4321](http://localhost:4321)。

### 生产环境构建

```bash
pnpm build
pnpm preview
```

---

## Docker 容器化部署

```bash
docker compose up -d --build
```

---

## 开源许可

本软件基于 [Elastic License 2.0](../LICENSE) 协议发布。
