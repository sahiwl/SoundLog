import type { Request, Response } from "express";
import * as songService from "../services/song.service.js";
import { parseIntQuery } from "../lib/requestHelpers.js";

export const getNewReleasesHandler = async (req: Request, res: Response) => {
  const limit = parseIntQuery(req.query.limit, 20, { min: 1, max: 50 });
  const offset = parseIntQuery(req.query.offset, 0, { min: 0 });
  const newRelease = await songService.getNewReleases(limit, offset);
  res.status(200).json(newRelease);
};
