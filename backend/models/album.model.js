import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema(
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
        uri: { type: String },
        href: { type: String },
        external_urls: {
          spotify: { type: String }
        },
        type: { type: String }
      },
    ],
    tracks: {
      total: { type: Number },
      items: [
        {
          name: { type: String },
          trackId: { type: String },
          disc_number: { type: Number },
          duration_ms: { type: Number },
          explicit: { type: Boolean },
          track_number: { type: Number },
          uri: { type: String },
          is_playable: { type: Boolean },
          is_local: { type: Boolean },
          preview_url: { type: String },
          artists: [
            {
              spotifyId: { type: String },
              name: { type: String },
              uri: { type: String },
              external_urls: {
                spotify: { type: String }
              }
            }
          ]
        }
      ]
    },
    external_urls: {
      spotify: { type: String },
    },
    external_ids: {
      upc: { type: String }
    },
    uri: { type: String },
    href: { type: String },
    popularity: { type: Number },
    label: { type: String },
    copyrights: [
      {
        text: { type: String },
        type: { type: String }
      }
    ],
    genres: [{ type: String }],
    lastAccessed: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Album = mongoose.model("Album", albumSchema);
export default Album;