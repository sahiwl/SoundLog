/**
 * searchSpotifyData - A helper function that queries Spotify's Web API.
 *
 * @param {string} endpoint - The endpoint (e.g., "search" or "tracks/{id}").
 * @param {object} params - Query parameters for the request.
 * @returns {Promise<object>} - The data returned by Spotify.
 */

import axios from "axios";
import { getSpotifyAccessToken } from "./spotifyAuth.js";
import { AppError } from "./AppError.js";

const spotifyError = (context, error) => {
  console.error(`Error in ${context}:`, error.message);
  const status = error.response?.status;
  const message =
    error.response?.data?.error?.message ||
    `Failed to fetch from Spotify (${context})`;
  throw new AppError(message, status >= 400 && status < 600 ? status : 502);
};

export const searchSpotifyData = async (endpoint, params = {}) => {
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
  } catch (error) {
    console.error("Error in searchSpotifyData:", error.message);
    throw error;
  }
};

export const GetSpecificTrack = async (itemId, params = {}) => {
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
  } catch (error) {
    console.error("Error in GetSpecificTrack:", error.message);
    throw error;
  }
};

export const GetSpecificAlbum = async (itemId, params = {}) => {
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
  } catch (error) {
    console.error("Error in GetSpecificAlbum:", error.message);
    throw error;
  }
};

export const GetSpecificArtist = async (itemId, params = {}) => {
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
  } catch (error) {
    console.error("Error in GetSpecificArtist: ", error.message);
    throw error;
  }
};

export const getNewReleases = async (limit, offset) => {
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
  } catch (error) {
    spotifyError("getNewReleases", error);
  }
};
