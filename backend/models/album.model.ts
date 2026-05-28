import mongoose, { Document, Schema, Model } from "mongoose";
import type { ISpotifyArtistEmbed, ISpotifyImage } from "../types/spotify.js";

/** Track item embedded in an album document (not the Track collection). */
export interface IAlbumTrackItem {
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
  artists: ISpotifyArtistEmbed[];
}

export interface IAlbumTracks {
  total?: number;
  items: IAlbumTrackItem[];
}

export interface ICopyright {
  text: string;
  type: string;
}

export interface IAlbum extends Document {
  albumId: string;
  name: string;
  album_type?: string;
  total_tracks?: number;
  is_playable?: boolean;
  release_date?: string;
  release_date_precision?: string;
  images: ISpotifyImage[];
  artists: ISpotifyArtistEmbed[];
  tracks: IAlbumTracks;
  external_urls: {
    spotify: string;
  };
  external_ids: {
    upc: string;
  };
  uri: string;
  href?: string;
  popularity?: number;
  label?: string;
  copyrights: ICopyright[];
  genres: string[];
  lastAccessed?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const albumImageSchema = new Schema<ISpotifyImage>(
  {
    url: { type: String, required: true },
    height: { type: Number },
    width: { type: Number },
  },
  { _id: false }
);

const artistInfoSchema = new Schema<ISpotifyArtistEmbed>(
  {
    spotifyId: { type: String, required: true },
    name: { type: String, required: true },
    uri: { type: String, required: true },
    href: { type: String },
    external_urls: {
      spotify: { type: String, required: true }
    },
    type: { type: String }
  },
  { _id: false }
);

const albumTrackArtistSchema = new Schema<ISpotifyArtistEmbed>(
  {
    spotifyId: { type: String, required: true },
    name: { type: String, required: true },
    uri: { type: String, required: true },
    external_urls: {
      spotify: { type: String, required: true }
    }
  },
  { _id: false }
);

const albumTrackItemSchema = new Schema<IAlbumTrackItem>(
  {
    name: { type: String, required: true },
    trackId: { type: String, required: true },
    disc_number: { type: Number },
    duration_ms: { type: Number },
    explicit: { type: Boolean },
    track_number: { type: Number },
    uri: { type: String, required: true },
    is_playable: { type: Boolean },
    is_local: { type: Boolean },
    preview_url: { type: String },
    artists: [albumTrackArtistSchema]
  },
  { _id: false }
);

const albumTracksSchema = new Schema<IAlbumTracks>(
  {
    total: { type: Number },
    items: [albumTrackItemSchema]
  },
  { _id: false }
);

const copyrightSchema = new Schema<ICopyright>(
  {
    text: { type: String, required: true },
    type: { type: String, required: true }
  },
  { _id: false }
);

const albumSchema: Schema<IAlbum> = new Schema(
  {
    albumId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    album_type: {
      type: String
    },
    total_tracks: {
      type: Number
    },
    is_playable: {
      type: Boolean
    },
    release_date: {
      type: String
    },
    release_date_precision: {
      type: String
    },
    images: [albumImageSchema],
    artists: [artistInfoSchema],
    tracks: albumTracksSchema,
    external_urls: {
      spotify: { type: String, required: true }
    },
    external_ids: {
      upc: { type: String }
    },
    uri: { type: String, required: true },
    href: { type: String },
    popularity: { type: Number },
    label: { type: String },
    copyrights: [copyrightSchema],
    genres: [{ type: String }],
    lastAccessed: { type: Date, default: Date.now }
    // createdAt/updatedAt will be managed by timestamps option
  },
  { timestamps: true }
);

const Album: Model<IAlbum> = mongoose.model<IAlbum>("Album", albumSchema);

export default Album;