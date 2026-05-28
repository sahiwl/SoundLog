/**
 * searchSpotifyData - A helper function that queries Spotify's Web API.
 *
 * @param endpoint - The endpoint (e.g., "search" or "tracks/{id}").
 * @param params - Query parameters for the request.
 * @returns The data returned by Spotify.
 */

import axios, { AxiosError } from "axios";
import { getSpotifyAccessToken } from "./spotifyAuth.js";
import { AppError } from "./AppError.js";

type SpotifyParams = Record<string, string | number | boolean | undefined>;

const spotifyError = (context: string, error: any): never => {
  // Narrow error, can be AxiosError or unknown
  const err = error as AxiosError<any>;
  console.error(`Error in ${context}:`, err.message);
  const status = err.response?.status;
  const message =
    err.response?.data?.error?.message ||
    `Failed to fetch from Spotify (${context})`;
  throw new AppError(message, status && status >= 400 && status < 600 ? status : 502);
};

export const searchSpotifyData = async (
  endpoint: string,
  params: SpotifyParams = {}
): Promise<any> => {
  try {
    const token = await getSpotifyAccessToken();
    const url = `https://api.spotify.com/v1/${endpoint}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in searchSpotifyData:", error.message);
    throw error;
  }
};

export const GetSpecificTrack = async (
  itemId: string,
  params: SpotifyParams = {}
): Promise<any> => {
  try {
    const token = await getSpotifyAccessToken();
    const url = `https://api.spotify.com/v1/tracks/${itemId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in GetSpecificTrack:", error.message);
    throw error;
  }
};

export const GetSpecificAlbum = async (
  itemId: string,
  params: SpotifyParams = {}
): Promise<any> => {
  try {
    const token = await getSpotifyAccessToken();
    const url = `https://api.spotify.com/v1/albums/${itemId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in GetSpecificAlbum:", error.message);
    throw error;
  }
};

export const GetSpecificArtist = async (
  itemId: string,
  params: SpotifyParams = {}
): Promise<any> => {
  try {
    const token = await getSpotifyAccessToken();
    const url = `https://api.spotify.com/v1/artists/${itemId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in GetSpecificArtist: ", error.message);
    throw error;
  }
};

export const getNewReleases = async (
  limit?: number,
  offset?: number
): Promise<any> => {
  try {
    const token = await getSpotifyAccessToken();
    const endpoint = `https://api.spotify.com/v1/browse/new-releases`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { limit, offset },
    });
    return response.data;
  } catch (error: any) {
    spotifyError("getNewReleases", error);
  }
};
