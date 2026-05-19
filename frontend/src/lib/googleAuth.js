/** Prod: VITE_BE_PROD_URL on Vercel (= Render B_PROD_URL, includes /api) */
export const getGoogleAuthUrl = () => {
  if (import.meta.env.DEV) {
    return "/api/auth/google";
  }
  const base = import.meta.env.VITE_BE_PROD_URL?.replace(/\/$/, "");
  return `${base}/auth/google`;
};
