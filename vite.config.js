import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = (env.PUBLIC_NIGHTAUTH_API_URL || env.VITE_NIGHTAUTH_API_URL)?.trim();
  if (!apiUrl) {
    console.warn("[portal] PUBLIC_NIGHTAUTH_API_URL is not set in .env: /api/* will not be proxied.");
  }

  const HOST_COOKIE = /__Host-(customer-[\w-]+)/g;
  const DEV_COOKIE = /(^|;\s*)(customer-[\w-]+)=/g;

  return {
    envPrefix: ["VITE_", "PUBLIC_"],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          signin: resolve(__dirname, "signin/index.html"),
          signup: resolve(__dirname, "signup/index.html"),
          twoFactor: resolve(__dirname, "2fa-required/index.html"),
          forgotPassword: resolve(__dirname, "forgot-password/index.html"),
          resetPassword: resolve(__dirname, "reset-password/index.html"),
        },
      },
    },
    server: {
      port: 4321,
      proxy: apiUrl
        ? {
            "/api": {
              target: apiUrl,
              changeOrigin: true,
              secure: env.NIGHTAUTH_PROXY_INSECURE_TLS !== "1",
              configure: (proxy) => {
                proxy.on("proxyReq", (proxyReq, req) => {
                  const url = new URL(apiUrl);
                  proxyReq.setHeader("host", url.host);
                  proxyReq.setHeader("origin", url.origin);
                  const cookie = req.headers["cookie"];
                  if (cookie) {
                    proxyReq.setHeader("cookie", cookie.replace(DEV_COOKIE, "$1__Host-$2="));
                  }
                });
                proxy.on("proxyRes", (proxyRes) => {
                  const setCookie = proxyRes.headers["set-cookie"];
                  if (setCookie) {
                    proxyRes.headers["set-cookie"] = setCookie.map((c) =>
                      c
                        .replace(HOST_COOKIE, "$1")
                        .replace(/;\s*Secure/gi, "")
                        .replace(/;\s*SameSite=Strict/gi, "; SameSite=Lax"),
                    );
                  }
                });
              },
            },
          }
        : undefined,
    },
    preview: {
      port: 4321,
      host: "0.0.0.0",
    },
  };
});
