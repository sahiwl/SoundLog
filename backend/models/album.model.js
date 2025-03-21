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
    release_date: {
         type: String 
        },
    images: [
      {
        url: { type: String },
        height: { type: Number },
        width: { type: Number },
      },
    ],
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

const Album = mongoose.model("Album", albumSchema);
export default Album;
