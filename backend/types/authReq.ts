import type { Request } from "express";

/** Request after `protectRoute` — `req.user` is set. */
export type AuthenticatedRequest = Request & {
  user: Express.User;
};
