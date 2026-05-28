import Album from "../models/album.model.js";
import Track from "../models/track.model.js";
import Artist from "../models/artist.model.js";

import {
  GetSpecificAlbum,
  GetSpecificTrack,
  GetSpecificArtist,
} from "./pullSpotifyData.js";
import { AppError } from "./AppError.js";

// Only bump lastAccessed once per 24h to avoid write amplification on hot albums.
// Eviction (cleanup.js) still works because any active reader updates within the window.
const TOUCH_THROTTLE_MS = 24 * 60 * 60 * 1000;

// Per-process in-flight map prevents concurrent first-fetches from double-hitting
// Spotify and racing on insert (e.g. user clicks several uncached albums at once).
const inFlight: {
  albums: Map<string, Promise<any>>,
  tracks: Map<string, Promise<any>>,
  artists: Map<string, Promise<any>>,
} = {
  albums: new Map(),
  tracks: new Map(),
  artists: new Map(),
};

// --- Types for mapping functions ---

interface SpotifyArtist {
  id: string;
  name: string;
  uri?: string;
  href?: string;
  external_urls?: Record<string, string>;
  type?: string;
}
interface SpotifyTrack {
  id: string;
  name: string;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  track_number: number;
  uri: string;
  is_playable: boolean;
  is_local: boolean;
  preview_url: string | null;
  artists: SpotifyArtist[];
}

interface SpotifyAlbumArtist extends SpotifyArtist {
  external_urls?: Record<string, string>;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  total_tracks: number;
  is_playable?: boolean;
  release_date: string;
  release_date_precision: string;
  images: Array<Record<string, any>>;
  artists?: SpotifyAlbumArtist[];
  tracks?: {
    total: number;
    items: SpotifyTrack[];
  };
  external_urls: Record<string, any>;
  external_ids?: Record<string, string>;
  uri: string;
  href: string;
  popularity?: number;
  label?: string;
  copyrights?: any[];
  genres?: string[];
}

interface SpotifyArtistObj {
  id: string;
  name: string;
  type?: string;
  uri?: string;
  href?: string;
  external_urls?: Record<string, string>;
  followers?: {
    href: string | null;
    total: number;
  };
  genres?: string[];
  images?: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  popularity?: number;
}

/* Document type for 'maybeTouch' parameter */
type CacheDoc = {
  lastAccessed?: Date;
  save: () => Promise<any>;
};

const mapAlbum = (data: SpotifyAlbum) => ({
  name: data.name,
  album_type: data.album_type,
  total_tracks: data.total_tracks,
  is_playable: data.is_playable,
  release_date: data.release_date,
  release_date_precision: data.release_date_precision,
  images: data.images,
  artists: data.artists?.map((artist) => ({
    spotifyId: artist.id,
    name: artist.name,
    uri: artist.uri,
    href: artist.href,
    external_urls: artist.external_urls,
    type: artist.type,
  })),
  tracks: {
    total: data.tracks?.total,
    items: data.tracks?.items?.map((track) => ({
      name: track.name,
      trackId: track.id,
      disc_number: track.disc_number,
      duration_ms: track.duration_ms,
      explicit: track.explicit,
      track_number: track.track_number,
      uri: track.uri,
      is_playable: track.is_playable,
      is_local: track.is_local,
      preview_url: track.preview_url,
      artists: track.artists?.map((artist) => ({
        spotifyId: artist.id,
        name: artist.name,
        uri: artist.uri,
        external_urls: artist.external_urls,
      })),
    })),
  },
  external_urls: data.external_urls,
  external_ids: data.external_ids,
  uri: data.uri,
  href: data.href,
  popularity: data.popularity,
  label: data.label,
  copyrights: data.copyrights,
  genres: data.genres,
});

const mapTrack = (data: any) => ({
  name: data.name,
  duration_ms: data.duration_ms,
  explicit: data.explicit,
  popularity: data.popularity,
  track_number: data.track_number,
  disc_number: data.disc_number,
  is_local: data.is_local,
  is_playable: data.is_playable,
  preview_url: data.preview_url,
  type: data.type,
  href: data.href,
  album: data.album && {
    album_type: data.album.album_type,
    spotifyId: data.album.id,
    name: data.album.name,
    release_date: data.album.release_date,
    release_date_precision: data.album.release_date_precision,
    total_tracks: data.album.total_tracks,
    type: data.album.type,
    uri: data.album.uri,
    href: data.album.href,
    is_playable: data.album.is_playable,
    images: data.album.images,
    artists: data.album.artists?.map((artist: any) => ({
      spotifyId: artist.id,
      name: artist.name,
      type: artist.type,
      uri: artist.uri,
      href: artist.href,
      external_urls: artist.external_urls,
    })),
    external_urls: data.album.external_urls,
  },
  artists: data.artists?.map((artist: any) => ({
    spotifyId: artist.id,
    name: artist.name,
    type: artist.type,
    uri: artist.uri,
    href: artist.href,
    external_urls: artist.external_urls,
  })),
  external_urls: data.external_urls,
  external_ids: data.external_ids,
  uri: data.uri,
  linked_from: data.linked_from,
});

const mapArtist = (data: SpotifyArtistObj) => ({
  name: data.name,
  followers: {
    href: data.followers?.href ?? null,
    total: data.followers?.total ?? 0,
  },
  genres: data.genres,
  href: data.href,
  images: data.images?.map((img) => ({
    url: img.url,
    height: img.height,
    width: img.width,
  })),
  popularity: data.popularity,
  type: data.type,
  uri: data.uri,
  external_urls: { spotify: data.external_urls?.spotify },
});

const maybeTouch = async (doc: CacheDoc | null | undefined): Promise<void> => {
  if (!doc) return;
  const last = doc.lastAccessed ? new Date(doc.lastAccessed).getTime() : 0;
  if (Date.now() - last > TOUCH_THROTTLE_MS) {
    doc.lastAccessed = new Date();
    await doc.save();
  }
};

type MakeGetOrCreateParams<M extends { findOne: Function, findOneAndUpdate: Function }> = {
  bucket: keyof typeof inFlight;
  Model: M;
  idField: string;
  fetchSpotify: (id: string, opts?: any) => Promise<any>;
  mapFn: (data: any) => any;
  notFoundLabel: string;
};

const makeGetOrCreate = <M extends { findOne: Function, findOneAndUpdate: Function }>({
  bucket,
  Model,
  idField,
  fetchSpotify,
  mapFn,
  notFoundLabel,
}: MakeGetOrCreateParams<M>) => {
  return async (
    id: string,
    { touch = true }: { touch?: boolean } = {},
  ): Promise<any> => {
    if (!id) throw new AppError(`${notFoundLabel} id is required.`, 400);

    const cached = await Model.findOne({ [idField]: id });
    if (cached) {
      if (touch) await maybeTouch(cached);
      return cached;
    }

    const map = inFlight[bucket] as Map<string, Promise<any>>;
    if (map.has(id)) return map.get(id);

    const promise = (async () => {
      const spotifyData = await fetchSpotify(`${id}`, { market: "IN" });
      if (!spotifyData || spotifyData.error) {
        throw new AppError(`${notFoundLabel} not found on Spotify.`, 404);
      }
      // Upsert-on-insert: if a parallel request created the doc first, this
      // returns the existing doc instead of throwing a duplicate key error.
      return Model.findOneAndUpdate(
        { [idField]: id },
        { $setOnInsert: { [idField]: id, ...mapFn(spotifyData) } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    })();

    map.set(id, promise);
    try {
      return await promise;
    } finally {
      map.delete(id);
    }
  };
};

export const getOrCreateAlbum = makeGetOrCreate({
  bucket: "albums",
  Model: Album,
  idField: "albumId",
  fetchSpotify: GetSpecificAlbum,
  mapFn: mapAlbum,
  notFoundLabel: "Album",
});

export const getOrCreateTrack = makeGetOrCreate({
  bucket: "tracks",
  Model: Track,
  idField: "trackId",
  fetchSpotify: GetSpecificTrack,
  mapFn: mapTrack,
  notFoundLabel: "Track",
});

export const getOrCreateArtist = makeGetOrCreate({
  bucket: "artists",
  Model: Artist,
  idField: "artistId",
  fetchSpotify: GetSpecificArtist,
  mapFn: mapArtist,
  notFoundLabel: "Artist",
});
