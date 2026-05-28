import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

type RequestParts = {
  body: unknown;
  params: unknown;
  query: unknown;
}

export const validate = (schema: ZodType<RequestParts>) => (req:Request, res:Response, next:NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid request";
    return res.status(400).json({ message });
  }

    if (result.data.body !== undefined) req.body = result.data.body;
    if (result.data.params !== undefined) req.params = result.data.params as Request["params"];
    if (result.data.query !== undefined) req.query = result.data.query as Request["query"];
  next();
};
