import type { Request, Response } from "express";
import * as songService from "../services/song.service.js";
import { parsePage } from "../lib/requestHelpers.js";

export const getNewReleasesHandler = async (req: Request, res: Response) => {
  const limit = req.query.limit ? parsePage(req.query.limit, 20) : 20;
  const offset = req.query.offset ? parsePage(req.query.offset, 0) : 0;
  const newRelease = await songService.getNewReleases(limit, offset);
  res.status(200).json(newRelease);
};
