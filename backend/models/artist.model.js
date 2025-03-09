import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        bio: {
            type: String
        },
        image: {
            type: String
        },
        // socialLinks: {
        //     website: {
        //         type: String
        //     },
        //     twitter: {
        //         type: String
        //     },
        //     instagram: {
        //         type: String
        //     },
        //     facebook: {
        //         type: String
        //     }
        // }
    },
    { timestamps: true }
);

const Artist = mongoose.model("Artist", artistSchema);

export default Artist;