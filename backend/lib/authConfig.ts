import type express from "express";

const trim = (url: string | undefined) : string => (url || "").replace(/\/$/, "");

// B_PROD_URL (prod) or BE_DEV_URL (dev) — both include "/api" 
export const getApiBase = ():string => {
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.B_PROD_URL
      : process.env.BE_DEV_URL;
  return trim(url);
};

// Google Console redirect URI (SPA host + /api — proxied to backend in dev & prod)
export const getGoogleCallbackUrl = () : string => {
  if (process.env.NODE_ENV === "production") {
    return `${trim(process.env.ORIGIN_MAIN)}/api/auth/google/callback`;
  }
  if (process.env.NODE_ENV === "development" && process.env.LOCAL) {
    return `${trim(process.env.LOCAL)}/api/auth/google/callback`;
  }
  return `${getApiBase()}/auth/google/callback`;
};

// Where to send the browser after OAuth (frontend only) 
export const getFrontendOrigin = () : string => {
  if (process.env.NODE_ENV !== "production") {
    return trim(process.env.LOCAL || "http://localhost:5173");
  }
  return trim(process.env.ORIGIN_MAIN);
};

export const getJwtCookieOptions = (): express.CookieOptions => ({
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // Same-origin /api proxy (Vite + Vercel) — Lax works; None was for cross-origin Render URL
  sameSite: "lax",
  path: "/",
});
