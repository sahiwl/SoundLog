import type { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<unknown>;

export function asyncHandler(
  fn: AsyncRequestHandler
): AsyncRequestHandler;
export function asyncHandler<TReq extends Request>(
  fn: (req: TReq, res: Response, next: NextFunction) => void | Promise<unknown>
): AsyncRequestHandler;
export function asyncHandler<TReq extends Request>(
  fn: (req: TReq, res: Response, next: NextFunction) => void | Promise<unknown>
): AsyncRequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as TReq, res, next)).catch(next);
  };
}
