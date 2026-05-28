import mongoose, { Document, Schema, Model } from "mongoose";
import type { ISpotifyImage } from "../types/spotify.js";

export interface IArtistFollowers {
    href?: string;
    total: number;
}

export interface IArtist extends Document {
    artistId: string;
    name: string;
    followers?: IArtistFollowers;
    genres: string[];
    href?: string;
    images: ISpotifyImage[];
    popularity?: number;
    type?: string;
    uri?: string;
    external_urls?: {
        spotify: string;
    };
    lastAccessed?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const artistImageSchema = new Schema<ISpotifyImage>(
    {
        url: { type: String, required: true },
        height: { type: Number },
        width: { type: Number },
    },
    { _id: false }
);

const artistFollowersSchema = new Schema<IArtistFollowers>(
    {
        href: { type: String },
        total: { type: Number, required: true },
    },
    { _id: false }
);

const artistSchema = new Schema<IArtist>(
    {
        artistId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        followers: {
            type: artistFollowersSchema,
        },
        genres: [{ type: String }],
        href: { type: String },
        images: [artistImageSchema],
        popularity: {
            type: Number,
            min: 0,
            max: 100,
        },
        type: {
            type: String,
            default: "artist",
        },
        uri: { type: String },
        external_urls: {
            spotify: { type: String, required: true },
        },
        lastAccessed: {
            type: Date,
            default: Date.now,
        },
        // createdAt/updatedAt handled by timestamps
    },
    { timestamps: true }
);

// // Index for better query performance
// artistSchema.index({ artistId: 1 });
// artistSchema.index({ lastAccessed: 1 });
// artistSchema.index({ name: "text" });

const Artist: Model<IArtist> = mongoose.model<IArtist>("Artist", artistSchema);
export default Artist;