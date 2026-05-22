import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 300,
  message: {
    message:
      "Too many requests from this IP, please try again after 10 minutes.",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,
  message: {
    message:
      "Too many requests from this IP, please try again after 5 minutes.",
  },
});
