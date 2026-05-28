import type { Request, Response } from "express";
import * as searchService from "../services/search.service.js";
import { optionalQueryString } from "../lib/requestHelpers.js";
import { AppError } from "../lib/AppError.js";

export const searchAll = async (req: Request, res: Response) => {
  const query = optionalQueryString(req.query.query);
  if (!query) {
    throw new AppError("Query parameter 'query' is required.", 400);
  }
  const result = await searchService.searchAll(query);
  res.json(result);
};
