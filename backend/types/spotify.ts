/** Shared Spotify API sub-shapes used across album / track / artist models. */

export interface ISpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

export interface ISpotifyExternalUrls {
  spotify: string;
}

/** Minimal artist ref embedded on albums and tracks (not the Artist collection). */
export interface ISpotifyArtistEmbed {
  spotifyId: string;
  name: string;
  uri: string;
  href?: string;
  type?: string;
  external_urls: ISpotifyExternalUrls;
}
