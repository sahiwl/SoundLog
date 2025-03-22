/**
 * searchSpotifyData - A helper function that queries Spotify's Web API.
 *
 * @param {string} endpoint - The endpoint (e.g., "search" or "tracks/{id}").
 * @param {object} params - Query parameters for the request.
 * @returns {Promise<object>} - The data returned by Spotify.
 */

import axios from "axios";
import { getSpotifyAccessToken } from "./spotifyAuth.js";

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

export const GetSpecificTrack = async (itemId, params={}) =>{
  try {
    const token = await getSpotifyAccessToken()
    const url = `https://api.spotify.com/v1/tracks/${itemId}`

    const response = await axios.get(url, {
      headers:{
        "Authorization": `Bearer ${token}`
      },
      params
    })
    return response.data
  } catch (error) {
    console.error("Error in searchTracks:", error.message);
    throw error;
  }
}

export const GetSpecificAlbum = async (itemId, params={}) =>{
  try {
    const token = await getSpotifyAccessToken()
    const url = `https://api.spotify.com/v1/albums/${itemId}`

    const response = await axios.get(url, {
      headers:{
        "Authorization": `Bearer ${token}`
      },
      params
    })
    return response.data
  } catch (error) {
    console.error("Error in searchAlbums:", error.message);
    throw error;
  }
}

export const GetAlbumTracks = async(itemId, params= {}) =>{
  try {
    const token = await getSpotifyAccessToken()
    const url = `https://api.spotify.com/v1/albums/${itemId}/tracks`

    const response = await axios.get(url, {
      headers:{
        "Authorization": `Bearer ${token}`,
      },
      params
    })
    return response.data
  } catch (error) {
    console.error("Error in GetAlbumTracks:", error.message);
  }
}

export const getNewReleases = async (limit, offset) =>{
  try {
    const token = await getSpotifyAccessToken()
    const endpoint = `https://api.spotify.com/v1/browse/new-releases`

    const response= await axios.get(endpoint, {
      headers:{
        "Authorization": `Bearer ${token}`,
      },
      params: { limit, offset }, 
    })
    return response.data

  } catch (error) {
    console.error("Error in getNewReleases:", error.message);
  }
}
