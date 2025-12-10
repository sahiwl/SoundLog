import * as songService from "../services/song.service.js";

export const getAlbumTracksHandler = async (req, res) => {
    try {
        const { itemId } = req.params;
        const tracks = await songService.getAlbumTracks(itemId);
        res.json(tracks);
    } catch (error) {
        console.error("Error in getAlbumTracksHandler:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getNewReleasesHandler = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20
        const offset = parseInt(req.query.offset) || 0
        const newRelease = await songService.getNewReleases(limit, offset)

        return res.status(200).json(newRelease);
    } catch (error) {
        console.error("Error in getNewReleasesHandler:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}