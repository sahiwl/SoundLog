import { axiosInstance } from '../lib/spotifyAuth.js';
import { MOOD_ARTISTS, getRandomArtistsFromMood } from '../data/moodArtists.js';

export const MOOD_CONFIGURATIONS = {
  happy: {
    genres: ['pop', 'dance', 'funk'],
    attributes: {
      target_valence: 0.8,
      target_energy: 0.7,
      target_danceability: 0.7,
      min_valence: 0.5
    },
    searchTerms: ['upbeat', 'happy', 'cheerful', 'positive', 'feel good']
  },
  sad: {
    genres: ['indie', 'alternative', 'folk'],
    attributes: {
      target_valence: 0.3,
      target_energy: 0.4,
      max_valence: 0.5,
      target_acousticness: 0.6
    },
    searchTerms: ['melancholy', 'emotional', 'heartbreak', 'indie', 'acoustic']
  },
  energetic: {
    genres: ['rock', 'electronic', 'punk'],
    attributes: {
      target_energy: 0.9,
      target_tempo: 140,
      min_energy: 0.7,
      target_loudness: -5
    },
    searchTerms: ['energetic', 'high energy', 'pump up', 'workout', 'intense']
  },
  chill: {
    genres: ['ambient', 'jazz', 'indie'],
    attributes: {
      target_valence: 0.6,
      target_energy: 0.3,
      max_energy: 0.5,
      target_acousticness: 0.7
    },
    searchTerms: ['chill', 'relaxing', 'mellow', 'ambient', 'lounge']
  },
  focus: {
    genres: ['classical', 'ambient', 'electronic'],
    attributes: {
      target_instrumentalness: 0.8,
      max_speechiness: 0.1,
      target_energy: 0.4,
      min_instrumentalness: 0.5
    },
    searchTerms: ['instrumental', 'focus', 'study', 'ambient', 'classical']
  },
  party: {
    genres: ['pop', 'dance', 'hip-hop'],
    attributes: {
      target_danceability: 0.9,
      target_energy: 0.8,
      min_danceability: 0.6,
      target_valence: 0.8
    },
    searchTerms: ['party', 'dance', 'club', 'upbeat', 'celebration']
  }
};

// genre seeds 
export const SPOTIFY_GENRE_SEEDS = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'blues', 'bossanova', 'brazil',
  'breakbeat', 'british', 'chill', 'classical', 'club', 'country', 'dance', 'deep-house',
  'disco', 'drum-and-bass', 'dub', 'dubstep', 'electronic', 'folk', 'funk', 'garage',
  'gospel', 'groove', 'grunge', 'hip-hop', 'house', 'indie', 'jazz', 'latin', 'metal',
  'pop', 'punk', 'r-n-b', 'reggae', 'rock', 'soul', 'techno', 'trance'
];

// func to remove compilation and generic albums
export const isRealAlbum = (album) => {
  const albumName = album.name.toLowerCase();
  const artistName = album.artists?.[0]?.name?.toLowerCase() || '';
  
  const compilationKeywords = [
    'compilation', 'greatest hits', 'best of', 'vol.', 'volume',
    'instrumental', 'covers', 'remix', 'karaoke', 'tribute',
    'various artists', 'soundtrack', 'disney', 'christmas',
    'hits collection', 'anthology', 'essential', 'ultimate'
  ];
  
  const isCompilation = compilationKeywords.some(keyword => 
    albumName.includes(keyword) || artistName.includes(keyword)
  );
  
  // Prefer albums over singles, but include substantial singles/EPs
  const isGoodContent = album.album_type === 'album' || 
                       (album.album_type === 'single' && album.total_tracks >= 3) ||
                       (album.total_tracks >= 4);
  
  return !isCompilation && isGoodContent && album.total_tracks > 0;
};

// Strategy 1: Search for albums by curated popular artists
export const getAlbumsByArtists = async (mood, minCount = 8) => {
  const albums = [];
  
  try {
    const selectedArtists = getRandomArtistsFromMood(mood, 6);
    
    console.log(`Searching for albums by artists: ${selectedArtists.join(', ')}`);
    
    const albumPromises = selectedArtists.map(async (artist) => {
      try {
        const artistSearchResponse = await axiosInstance.get('/search', {
          params: {
            q: `artist:"${artist}"`,
            type: 'album',
            limit: 10,
            market: 'US'
          }
        });

        const artistAlbums = artistSearchResponse.data.albums?.items || [];
        
        // Filtering out compilations and generic albums
        const realAlbums = artistAlbums.filter(isRealAlbum);
        
        // sorting using recently released and popularity
        const sortedAlbums = realAlbums
          .sort((a, b) => {
            const aYear = new Date(a.release_date).getFullYear();
            const bYear = new Date(b.release_date).getFullYear();
            // Prefer newer albums (2015+) but not necessarily the newest
            const aScore = (aYear >= 2015 ? 1 : 0.5) * (a.popularity || 50);
            const bScore = (bYear >= 2015 ? 1 : 0.5) * (b.popularity || 50);
            return bScore - aScore;
          })
          .slice(0, 2); 
        
        albums.push(...sortedAlbums);
      } catch (artistError) {
        console.error(`Failed to fetch albums for artist ${artist}:`, artistError.message);
      }
    });
    
    await Promise.all(albumPromises);
  } catch (error) {
    console.error('Artist-based search failed:', error.message);
  }
  
  return albums;
};

// Strategy 2: Get albums from popular tracks using Spotify recommendations
export const getAlbumsFromRecommendations = async (mood, existingAlbums = []) => {
  const albums = [];
  
  try {
    const moodConfig = MOOD_CONFIGURATIONS[mood] || MOOD_CONFIGURATIONS.happy;
    const validGenres = moodConfig.genres.filter(g => SPOTIFY_GENRE_SEEDS.includes(g));
    const seedGenres = validGenres.slice(0, 2);
    
    if (seedGenres.length > 0) {
      const recommendationParams = {
        seed_genres: seedGenres.join(','),
        limit: 20,
        market: 'US',
        min_popularity: 40, 
        ...moodConfig.attributes
      };

      const spotifyResponse = await axiosInstance.get('/recommendations', {
        params: recommendationParams
      });

      const tracks = spotifyResponse.data.tracks || [];
      
      // Extract albums from popular tracks
      const seenAlbumIds = new Set(existingAlbums.map(a => a.id));
      const albumsFromTracks = [];
      
      for (const track of tracks) {
        if (track.album && !seenAlbumIds.has(track.album.id)) {
          // Filter out compilation-style albums
          const albumName = track.album.name.toLowerCase();
          const isCompilation = albumName.includes('compilation') || 
                              albumName.includes('vol.') ||
                              albumName.includes('volume') ||
                              albumName.includes('instrumental') ||
                              albumName.includes('various artists');
          
          if (!isCompilation && track.popularity >= 35) {
            albumsFromTracks.push({
              ...track.album,
              popularity: track.popularity,
              preview_url: track.preview_url
            });
            seenAlbumIds.add(track.album.id);
          }
        }
      }
      
      albums.push(...albumsFromTracks);
    }
  } catch (error) {
    console.error('Recommendations API failed:', error.message);
  }
  
  return albums;
};

// Strategy 3: Search for trending albums in recent years
export const getTrendingAlbums = async (mood, existingAlbums = []) => {
  const albums = [];
  
  try {
    const moodConfig = MOOD_CONFIGURATIONS[mood] || MOOD_CONFIGURATIONS.happy;
    const currentYear = new Date().getFullYear();
    const searchYears = [currentYear, currentYear - 1, currentYear - 2];
    
    for (const year of searchYears) {
      if (albums.length >= 8) break;
      
      // Use different search terms for variety
      const searchTerm = moodConfig.searchTerms[Math.floor(Math.random() * moodConfig.searchTerms.length)];
      
      const yearSearchResponse = await axiosInstance.get('/search', {
        params: {
          q: `year:${year} genre:${moodConfig.genres[0]}`,
          type: 'album',
          limit: 10,
          market: 'US'
        }
      });

      const yearAlbums = yearSearchResponse.data.albums?.items || [];
      const seenAlbumIds = new Set(existingAlbums.map(a => a.id));
      
      const filteredYearAlbums = yearAlbums.filter(album => {
        return !seenAlbumIds.has(album.id) && 
               isRealAlbum(album) && 
               album.total_tracks >= 5 &&
               album.album_type === 'album';
      });
      
      albums.push(...filteredYearAlbums);
    }
  } catch (error) {
    console.error('Year based search failed:', error.message);
  }
  
  return albums;
};

// Utility function to shuffle and format final albums with artist diversity
export const shuffleAndFormatAlbums = (albums, limit = 12) => {
  const uniqueAlbums = albums.filter((album, index, self) => 
    // Remove duplicates
    index === self.findIndex(a => a.id === album.id)
  );

  // artist diversity select at most 2 albums per artist
  const diverseAlbums = [];
  const artistCount = {};
  
  // First pass: Add one album from each unique artist
  for (const album of uniqueAlbums) {
    const mainArtist = album.artists[0]?.name || 'Unknown';
    if (!artistCount[mainArtist]) {
      artistCount[mainArtist] = 1;
      diverseAlbums.push(album);
    }
  }
  
  // Second pass: Add a second album from artists if we haven't reached the limit
  for (const album of uniqueAlbums) {
    if (diverseAlbums.length >= limit) break;
    
    const mainArtist = album.artists[0]?.name || 'Unknown';
    if (artistCount[mainArtist] === 1 && !diverseAlbums.find(a => a.id === album.id)) {
      artistCount[mainArtist] = 2;
      diverseAlbums.push(album);
    }
  }
  

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const finalAlbums = shuffleArray(diverseAlbums).slice(0, limit);
  
  return finalAlbums.map(album => ({
    id: album.id,
    name: album.name,
    artists: album.artists.map(artist => ({ name: artist.name, id: artist.id })),
    images: album.images,
    release_date: album.release_date,
    total_tracks: album.total_tracks,
    external_urls: album.external_urls,
    album_type: album.album_type,
    popularity: album.popularity
  }));
};
