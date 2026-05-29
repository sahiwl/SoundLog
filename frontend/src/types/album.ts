import type {
  SpotifyArtistEmbed,
  SpotifyArtistRef,
  SpotifyExternalUrls,
  SpotifyImage,
} from "./spotify";
import type { AlbumPageReview } from "./review";

export interface AlbumCard {
  id: string;
  name: string;
  artists: SpotifyArtistRef[];
  images: SpotifyImage[];
  release_date?: string;
  total_tracks?: number;
  external_urls?: SpotifyExternalUrls;
  album_type?: string;
  popularity?: number;
}

export interface AlbumSummary {
  albumId: string;
  name: string;
  images: SpotifyImage[];
  artists: Pick<SpotifyArtistEmbed, "spotifyId" | "name">[];
  release_date?: string;
}

export interface AlbumTrackItem {
  name: string;
  trackId: string;
  disc_number?: number;
  duration_ms?: number;
  explicit?: boolean;
  track_number?: number;
  uri: string;
  is_playable?: boolean;
  is_local?: boolean;
  preview_url?: string;
  artists: SpotifyArtistEmbed[];
}

export interface AlbumTracks {
  total?: number;
  items: AlbumTrackItem[];
}

export interface AlbumCopyright {
  text: string;
  type: string;
}

/** Cached album document — /pages/albums/:albumId and paginated user lists. */
export interface Album {
  _id?: string;
  albumId: string;
  name: string;
  album_type?: string;
  total_tracks?: number;
  is_playable?: boolean;
  release_date?: string;
  release_date_precision?: string;
  images: SpotifyImage[];
  artists: SpotifyArtistEmbed[];
  tracks: AlbumTracks;
  external_urls: SpotifyExternalUrls;
  external_ids?: { upc?: string };
  uri: string;
  href?: string;
  popularity?: number;
  label?: string;
  copyrights?: AlbumCopyright[];
  genres?: string[];
  /** Present on paginated user album grids. */
  rating?: number | null;
  timestamp?: string;
}

export interface NewReleasesResponse {
  albums: {
    items: AlbumCard[];
  };
}

export interface AlbumPageResponse {
  album: Album;
  reviews: AlbumPageReview[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    totalComments: number;
  };
}
