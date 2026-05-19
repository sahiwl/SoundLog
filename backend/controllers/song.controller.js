import * as songService from "../services/song.service.js";

export const getAlbumTracksHandler = async (req, res) => {
    const { itemId } = req.params;
    const tracks = await songService.getAlbumTracks(itemId);
    res.json(tracks);
};

export const getNewReleasesHandler = async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const newRelease = await songService.getNewReleases(limit, offset);
    res.status(200).json(newRelease);
};
