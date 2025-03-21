import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
  {
    trackId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    duration_ms: { type: Number },
    explicit: { type: Boolean },
    popularity: { type: Number },
    track_number: { type: Number },
    // Album info as subdocument (if desired)
    album: {
      album_type: { type: String },
      spotifyId: { type: String },
      name: { type: String },
      release_date: { type: String },
      images: [
        {
          url: { type: String },
          height: { type: Number },
          width: { type: Number },
        },
      ],
    },
    // Artists: array of objects with minimal data.
    artists: [
      {
        spotifyId: { type: String },
        name: { type: String },
      },
    ],
    external_urls: {
      spotify: { type: String },
    },
    uri: { type: String },
  },
  { timestamps: true }
);

const Track = mongoose.model("Track", trackSchema);
export default Track;
