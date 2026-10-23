// Environment configuration loaded from .env
export const PORTAL_ID = (import.meta.env.PUBLIC_NIGHTAUTH_PORTAL_ID || import.meta.env.VITE_NIGHTAUTH_PORTAL_ID)?.trim() || "";
export const APP_NAME = (import.meta.env.PUBLIC_NIGHTAUTH_APP_NAME || import.meta.env.VITE_NIGHTAUTH_APP_NAME)?.trim() || "";
export const API_BASE = "";
