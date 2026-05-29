

export interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyArtistEmbed {
  spotifyId: string;
  name: string;
  uri: string;
  href?: string;
  type?: string;
  external_urls: SpotifyExternalUrls;
}

/** Minimal artist ref on carousel / search cards (Spotify API id, not spotifyId). */
export interface SpotifyArtistRef {
  id: string;
  name: string;
}
