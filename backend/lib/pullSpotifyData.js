/**
 * pullSpotifyData - A helper function that queries Spotify's Web API.
 *
 * @param {string} endpoint - The endpoint (e.g., "search" or "tracks/{id}").
 * @param {object} params - Query parameters for the request.
 * @returns {Promise<object>} - The data returned by Spotify.
 */

import axios from "axios";
import { getSpotifyAccessToken } from "./spotifyAuth.js";

export const pullSpotifyData = async (endpoint, params = {}) => {
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
    console.error("Error in pullSpotifyData:", error.message);
    throw error;
  }
};
