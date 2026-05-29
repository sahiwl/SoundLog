import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

export const rateLimiter : RateLimitRequestHandler = rateLimit({
  windowMs :  10 * 60 * 1000,
  limit: 900,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 10 minutes.",
  },
});

export const authRateLimiter:RateLimitRequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 5 minutes.",
  },
});
