import mongoose, { Document, Schema, Model } from "mongoose";
import type { ISpotifyArtistEmbed, ISpotifyImage } from "../types/spotify.js";

export interface ITrackArtist extends ISpotifyArtistEmbed {}

export interface ITrackAlbum {
  album_type?: string;
  spotifyId?: string;
  name?: string;
  release_date?: string;
  release_date_precision?: string;
  total_tracks?: number;
  type?: string;
  uri?: string;
  href?: string;
  is_playable?: boolean;
  images?: ISpotifyImage[];
  artists?: ITrackArtist[];
  external_urls?: {
    spotify?: string;
  };
}

export interface ITrackLinkedFrom {
  id?: string;
  type?: string;
  uri?: string;
  href?: string;
  external_urls?: {
    spotify?: string;
  };
}

export interface ITrack extends Document {
  trackId: string;
  name: string;
  duration_ms?: number;
  explicit?: boolean;
  popularity?: number;
  track_number?: number;
  disc_number?: number;
  is_local?: boolean;
  is_playable?: boolean;
  preview_url?: string;
  type?: string;
  href?: string;
  album?: ITrackAlbum;
  artists?: ITrackArtist[];
  external_urls?: {
    spotify?: string;
  };
  external_ids?: {
    isrc?: string;
  };
  uri?: string;
  linked_from?: ITrackLinkedFrom;
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

const trackArtistSchema = new Schema<ITrackArtist>(
  {
    spotifyId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String },
    uri: { type: String, required: true },
    href: { type: String },
    external_urls: {
      spotify: { type: String, required: true },
    },
  },
  { _id: false }
);

const trackAlbumSchema = new Schema<ITrackAlbum>(
  {
    album_type: { type: String },
    spotifyId: { type: String },
    name: { type: String },
    release_date: { type: String },
    release_date_precision: { type: String },
    total_tracks: { type: Number },
    type: { type: String },
    uri: { type: String },
    href: { type: String },
    is_playable: { type: Boolean },
    images: [albumImageSchema],
    artists: [trackArtistSchema],
    external_urls: {
      spotify: { type: String },
    },
  },
  { _id: false }
);

const linkedFromSchema = new Schema<ITrackLinkedFrom>(
  {
    id: { type: String },
    type: { type: String },
    uri: { type: String },
    href: { type: String },
    external_urls: {
      spotify: { type: String },
    },
  },
  { _id: false }
);

const trackSchema: Schema<ITrack> = new Schema(
  {
    trackId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    duration_ms: { type: Number },
    explicit: { type: Boolean },
    popularity: { type: Number },
    track_number: { type: Number },
    disc_number: { type: Number },
    is_local: { type: Boolean },
    is_playable: { type: Boolean },
    preview_url: { type: String },
    type: { type: String },
    href: { type: String },

    album: trackAlbumSchema,

    artists: [trackArtistSchema],

    external_urls: {
      spotify: { type: String },
    },

    external_ids: {
      isrc: { type: String },
    },

    uri: { type: String },
    linked_from: linkedFromSchema,

    lastAccessed: { type: Date, default: Date.now },
    // createdAt/updatedAt will be handled by timestamps
  },
  { timestamps: true }
);

const Track: Model<ITrack> = mongoose.model<ITrack>("Track", trackSchema);

export default Track;