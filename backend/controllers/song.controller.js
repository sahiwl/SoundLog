import { pullSpotifyData } from "../lib/pullSpotifyData.js";

// searchTracks - Searches Spotify for tracks by name.
// Endpoint: GET /api/spotify/search/tracks?name=Song+Name
export const searchTracks = async (req,res)=>{
    try {
        const trackName = req.query.name
        if(!trackName){
            res.status(400).json({message: `Query parameter "name" is required.`})
        }

        //use spotify search endpoint for tracks
        const data= await pullSpotifyData('search', {
            q: trackName,
            type: 'track',
            market: 'IN',
            limit: 10
        })
        return res.json(data)
    } catch (error) { 
        console.error('Error in searchTracks:', error.message);
        return res.status(500).json({ message: 'Error fetching tracks from Spotify.' });
        
    }
}

//  searchAlbums - Searches Spotify for albums by name.
//  Endpoint: GET /api/spotify/search/albums?name=Album+Name

export const searchAlbums = async (req,res)=>{
    try {
        const albumName = req.query.name;
        if (!albumName) {
            return res.status(400).json({ message: `Query parameter "name" is required.` });
          }

          //using spotify search endpoint for albums
          const data = await pullSpotifyData('search', {
            q: albumName,
            type: 'album',
            market: 'IN',
            limit: 10
          })

          return res.json(data.albums);
      
    } catch (error) {
        console.error('Error in searchAlbums:', error.message);
    return res.status(500).json({ message: 'Error fetching albums from Spotify.' });
    }
}

// searchArtists - Searches Spotify for artists by name.
// Endpoint: GET /api/spotify/search/artists?name=Artist+Name

export const searchArtists = async (req, res) => {
  try {
    const artistName = req.query.name;
    if (!artistName) {
      return res.status(400).json({ message: `Query parameter "name" is required.` });
    }

    // Use the Spotify search endpoint for artists.
    const data = await pullSpotifyData('search', {
      q: artistName,
      type: 'artist',
      market: 'IN',
      limit: 10,
    });

    return res.json(data.artists);
  } catch (error) {
    console.error('Error in searchArtists:', error.message);
    return res.status(500).json({ message: 'Error fetching artists from Spotify' });
  }
};