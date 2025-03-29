import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
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
    // Album info as subdocument
    album: {
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
      images: [
        {
          url: { type: String },
          height: { type: Number },
          width: { type: Number },
        },
      ],
      artists: [
        {
          spotifyId: { type: String },
          name: { type: String },
          type: { type: String },
          uri: { type: String },
          href: { type: String },
          external_urls: {
            spotify: { type: String },
          },
        },
      ],
      external_urls: {
        spotify: { type: String },
      },
    },
    // Artists: array of objects
    artists: [
      {
        spotifyId: { type: String },
        name: { type: String },
        type: { type: String },
        uri: { type: String },
        href: { type: String },
        external_urls: {
          spotify: { type: String },
        },
      },
    ],
    external_urls: {
      spotify: { type: String },
    },
    external_ids: {
      isrc: { type: String },
    },
    uri: { type: String },
    linked_from: {
      id: { type: String },
      type: { type: String },
      uri: { type: String },
      href: { type: String },
      external_urls: {
        spotify: { type: String },
      },
    },
    lastAccessed: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Track = mongoose.model("Track", trackSchema);
export default Track;