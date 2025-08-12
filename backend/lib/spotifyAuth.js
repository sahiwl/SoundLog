/**
 * What is going on here -
 * getSpotifyAccessToken -> Uses the Client Credentials Flow to obtain an access token from Spotify.
 * Caches the token in memory until it expires.
 * @returns {Promise<string>} -> A valid Spotify access token.
 */

import axios from "axios";

let accessToken = null;
let tokenExpiry = null;

export const getSpotifyAccessToken = async () => {
  //check if we have a token and it hasn't expired, we'll return it
  if (accessToken & (Date.now() < tokenExpiry)) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Spotify client credentials are missing.");
  }
//   console.log('Client ID:', clientId);
//   console.log('Client Secret:', clientSecret);

  const tokenUrl = "https://accounts.spotify.com/api/token";
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
  };

  try {
    const response = await axios.post(tokenUrl, params, { headers });
    accessToken = response.data.access_token;

    // Set the token expiry time (expires_in is in seconds) minus 60 seconds for safety.
    tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000;
    return accessToken;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error.message);
    throw error;
  }
};

export const axiosInstance = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});

// request interceptor to include fresh access token
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await getSpotifyAccessToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});
