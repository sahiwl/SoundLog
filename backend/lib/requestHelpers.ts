import { AppError } from "./AppError.js";

export const requireParam = ( value: string | string[] | undefined, name: string ): string => {
  if (typeof value === "string" && value.length > 0) return value;
  throw new AppError(`Invalid or missing route parameter: ${name}`, 400);
};

export const optionalQueryString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

export const parsePage = (value: unknown, defaultPage = 1): number => {
  if (typeof value !== "string") return defaultPage;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : defaultPage;
};

export const parseIntQuery = (value: unknown,defaultValue: number,{ min = 0, max = Number.MAX_SAFE_INTEGER }: { min?: number; max?: number } = {} ): number => {
  if (typeof value !== "string") return defaultValue;
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < min || n > max) return defaultValue;
  return n;
};

export const requireItemType = (value: string): "tracks" | "albums" => {
  if (value === "tracks" || value === "albums") return value;
  throw new AppError("Valid itemType (tracks or albums) is required.", 400);
};
