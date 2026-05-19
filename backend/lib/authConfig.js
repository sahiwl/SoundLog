

const trim = (url) => (url || "").replace(/\/$/, "");

// B_PROD_URL (prod) or BE_DEV_URL (dev) — both include "/api" 
export const getApiBase = () => {
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.B_PROD_URL
      : process.env.BE_DEV_URL;
  return trim(url);
};

// Google Console redirect URI 
export const getGoogleCallbackUrl = () => {

  if (process.env.NODE_ENV === "production") {
    return `${getApiBase()}/auth/google/callback`;
  }
  // Dev only: Vite proxy on SPA host so JWT cookie works with axios /api
  if (process.env.NODE_ENV === "development" && process.env.LOCAL) {
    return `${trim(process.env.LOCAL)}/api/auth/google/callback`;
  }
  return `${getApiBase()}/auth/google/callback`;
};

// Where to send the browser after OAuth (frontend only) 
export const getFrontendOrigin = () => {
  if (process.env.NODE_ENV !== "production") {
    return trim(process.env.LOCAL || "http://localhost:5173");
  }
  return trim(process.env.ORIGIN_MAIN);
};

export const getJwtCookieOptions = () => ({
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  path: "/",
});
