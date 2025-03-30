import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    artistId: { 
        type: String, 
        required: true,
        unique: true 
    },
    name: {
        type: String,
        required: true
    },
    followers: {
        href: String,
        total: Number
    },
    genres: [String],
    href: String,
    images: [{
        url: String,
        height: Number,
        width: Number
    }],
    popularity: {
        type: Number,
        min: 0,
        max: 100
    },
    type: {
        type: String,
        default: 'artist'
    },
    uri: String,
    external_urls: {
        spotify: String
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// // Index for better query performance
// artistSchema.index({ artistId: 1 });
// artistSchema.index({ lastAccessed: 1 });
// artistSchema.index({ name: 'text' });

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;