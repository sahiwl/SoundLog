import { GetAlbumTracks, getNewReleases, GetSpecificAlbum, GetSpecificTrack} from "../lib/pullSpotifyData.js"


export const getTrackDetails = async(itemId)=>{
    try {
        return await GetSpecificTrack(`${itemId}`, {
            market: 'IN'
        })
    } catch (error) {
        console.error("Error in getTracksDetails:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getAlbumDetails = async(itemId)=>{
    try {
        return await GetSpecificAlbum(`${itemId}`, {
            market: 'IN' //basically shortens the country array in api response from 4k lines to 800lines
        })
    } catch (error) {
        console.error("Error in getAlbumsDetails:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export const getAlbumTracksHandler = async (req, res) => {
    try {
      const { itemId } = req.params;      
      const tracks = await GetAlbumTracks(`${itemId}`,{
        market: 'IN'
      });
      res.json(tracks);
    } catch (error) {
      console.error("Error in getAlbumTracksHandler:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const getNewReleasesHandler = async (req,res)=>{
    try {
        const limit = req.query.limit || 20
        const offset = req.query.offset || 20
        const newRelease = await getNewReleases(limit, offset)
        res.status(200).json(newRelease);
        } catch (error) {
        console.error("Error in getNewReleasesHandler:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}