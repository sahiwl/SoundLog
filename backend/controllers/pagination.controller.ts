import type { Request, Response } from "express";
import * as paginationService from "../services/pagination.service.js";
import { parsePage, requireParam } from "../lib/requestHelpers.js";

export const getUserReviews = async (req: Request, res: Response) => {
  const username = requireParam(req.params.username, "username");
  const page = parsePage(req.query.page);
  const result = await paginationService.getUserReviews(username, page);
  res.json(result);
};

export const getUserAlbums = async (req: Request, res: Response) => {
  const username = requireParam(req.params.username, "username");
  const page = parsePage(req.query.page);
  const result = await paginationService.getUserAlbums(username, page);
  res.json(result);
};

export const getUserLikes = async (req: Request, res: Response) => {
  const username = requireParam(req.params.username, "username");
  const page = parsePage(req.query.page);
  const result = await paginationService.getUserLikes(username, page);
  res.json(result);
};

export const getAlbumPage = async (req: Request, res: Response) => {
  const albumId = requireParam(req.params.albumId, "albumId");
  const page = parsePage(req.query.page);
  const result = await paginationService.getAlbumPage(albumId, page);
  res.json(result);
};

export const getTrackPage = async (req: Request, res: Response) => {
  const trackId = requireParam(req.params.trackId, "trackId");
  const page = parsePage(req.query.page);
  const result = await paginationService.getTrackPage(trackId, page);
  res.json(result);
};

export const getArtistPage = async (req: Request, res: Response) => {
  const artistId = requireParam(req.params.artistId, "artistId");
  const result = await paginationService.getArtistPage(artistId);
  res.json(result);
};

export const getUserListenLater = async (req: Request, res: Response) => {
  const username = requireParam(req.params.username, "username");
  const page = parsePage(req.query.page);
  const result = await paginationService.getUserListenLater(username, page);
  res.json(result);
};
