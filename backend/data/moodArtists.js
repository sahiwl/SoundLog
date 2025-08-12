// Curated popular artists for each mood 
// Each mood has 50+ artists for maximum variety and different results each time

export const MOOD_ARTISTS = {
  happy: [

    'Dua Lipa', 'The Weeknd', 'Bruno Mars', 'Ed Sheeran', 'Taylor Swift',
    'Ariana Grande', 'Justin Timberlake', 'Doja Cat', 'Harry Styles', 'Lizzo',
    'Pharrell Williams', 'Mark Ronson', 'Charlie Puth', 'Post Malone', 'Billie Eilish',
    
    // Dance & happy vibes
    'Calvin Harris', 'David Guetta', 'The Chainsmokers', 'Marshmello', 'Zedd',
    'Disclosure', 'ODESZA', 'Porter Robinson', 'Madeon', 'Flume',
    
    // Feel-Good indie & ALt
    'Foster the People', 'MGMT', 'Phoenix', 'Vampire Weekend', 'Two Door Cinema Club',
    'The Strokes', 'Franz Ferdinand', 'Arcade Fire', 'Of Monsters and Men', 'Passion Pit',
    
    // R&B & soul happy
    'Anderson .Paak', 'Silk Sonic', 'Daniel Caesar', 'Kali Uchis', 'SZA',
    'Frank Ocean', 'The Internet', 'Mac Miller', 'Tyler, The Creator', 'Childish Gambino',
    
    // Classic feelGood
    'Stevie Wonder', 'Earth Wind & Fire', 'Queen', 'The Beatles', 'Michael Jackson',
    'Outkast', 'Kanye West', 'Kendrick Lamar', 'Chance the Rapper', 'Anderson Paak',
    
    // Modern 
    'Olivia Rodrigo', 'Dua Lipa', 'Billie Eilish', 'The Kid LAROI', 'Lorde',
    'Clairo', 'Rex Orange County', 'Still Woozy', 'Boy Pablo', 'Cuco'
  ],

  sad: [
    // Indie Folk 
    'Phoebe Bridgers', 'Bon Iver', 'The National', 'Sufjan Stevens', 'Elliott Smith',
    'Iron & Wine', 'Fleet Foxes', 'Daughter', 'The Paper Kites', 'Novo Amor',
    'Cigarettes After Sex', 'Beach House', 'Mazzy Star', 'Slowdive', 'Cocteau Twins',
    
    // Melancholic Pop 
    'Lana Del Rey', 'Radiohead', 'Thom Yorke', 'Atoms for Peace', 'Kings of Convenience',
    'The Smiths', 'Morrissey', 'Joy Division', 'New Order', 'Interpol',
    
    // Sad Singer
    'Damien Rice', 'Glen Hansard', 'Nick Drake', 'Johnny Cash', 'Leonard Cohen',
    'Jeff Buckley', 'Tim Buckley', 'Antony and the Johnsons', 'Perfume Genius', 'Julien Baker',
    
    // Modern Sad/Emo
    'Billie Eilish', 'Lorde', 'Clairo', 'Phoebe Bridgers', 'Japanese Breakfast',
    'Mitski', 'FKA twigs', 'James Blake', 'Frank Ocean', 'The 1975',
    
    // Ambient Sad
    'Grouper', 'Tim Hecker', 'Stars of the Lid', 'A Winged Victory for the Sullen', 'Godspeed You! Black Emperor',
    'Sigur Rós', 'Jónsi', 'Ólafur Arnalds', 'Nils Frahm', 'Max Richter',
    
    // Alternative Rock Sad
    'Nirvana', 'Alice in Chains', 'Soundgarden', 'Stone Temple Pilots', 'Mad Season'
  ],

  energetic: [
    // Rock & Alternative Energy
    'Imagine Dragons', 'OneRepublic', 'Fall Out Boy', 'Panic! At The Disco', 'Twenty One Pilots',
    'The Killers', 'Foo Fighters', 'Green Day', 'Linkin Park', 'Red Hot Chili Peppers',
    'Arctic Monkeys', 'Royal Blood', 'Muse', 'Queens of the Stone Age', 'The Strokes',
    
    // Electronic 
    'Skrillex', 'Deadmau5', 'Swedish House Mafia', 'Avicii', 'Tiësto',
    'Armin van Buuren', 'Above & Beyond', 'Eric Prydz', 'Knife Party', 'Pendulum',
    'The Prodigy', 'Fatboy Slim', 'Chemical Brothers', 'Justice', 'Daft Punk',
    
    // Punk 
    'Green Day', 'Blink-182', 'Sum 41', 'Good Charlotte', 'Simple Plan',
    'My Chemical Romance', 'Paramore', 'Hayley Williams', 'All Time Low', 'Pierce the Veil',
    
    // Hip-Hop 
    'Eminem', 'Kanye West', 'Travis Scott', 'Kendrick Lamar', 'J. Cole',
    'Drake', 'Lil Wayne', 'Nicki Minaj', 'Cardi B', 'Megan Thee Stallion',
    
    // Classic Rock 
    'AC/DC', 'Led Zeppelin', 'The Rolling Stones', 'Queen', 'Guns N\' Roses',
    'Aerosmith', 'Van Halen', 'Black Sabbath', 'Deep Purple', 'Rush'
  ],

  chill: [
    // Chill Pop 
    'Billie Eilish', 'Lorde', 'The 1975', 'Mac Miller', 'Frank Ocean',
    'SZA', 'Daniel Caesar', 'Kali Uchis', 'Rex Orange County', 'Boy Pablo',
    'Clairo', 'Still Woozy', 'Tame Impala', 'Glass Animals', 'alt-J',
    
    // Lo-Fi 
    'Cuco', 'Omar Apollo', 'Brockhampton', 'Tyler, The Creator', 'Earl Sweatshirt',
    'Vince Staples', 'Saba', 'Noname', 'Smino', 'Ravyn Lenae',
    
    // Chill Electronic
    'ODESZA', 'Flume', 'Bonobo', 'Tycho', 'Emancipator',
    'RJD2', 'Pretty Lights', 'GRiZ', 'Gramatik', 'Thievery Corporation',
    'Zero 7', 'Massive Attack', 'Portishead', 'Tricky', 'Morcheeba',
    
    // Chill R&B
    'Anderson .Paak', 'Silk Sonic', 'H.E.R.', 'Solange', 'Erykah Badu',
    'D\'Angelo', 'Maxwell', 'Alicia Keys', 'John Legend', 'Common',
    
    // Ambient 
    'Brian Eno', 'Boards of Canada', 'Aphex Twin', 'Four Tet', 'Caribou',
    'Floating Points', 'Nils Frahm', 'Ólafur Arnalds', 'Max Richter', 'Tim Hecker'
  ],

  focus: [
    // Classical 
    'Max Richter', 'Nils Frahm', 'Ólafur Arnalds', 'Kiasmos', 'Johann Johannsson',
    'Dustin O\'Halloran', 'Peter Broderick', 'A Winged Victory for the Sullen', 'Stars of the Lid', 'Tim Hecker',
    'Eluvium', 'Grouper', 'William Basinski', 'Rafael Anton Irisarri', 'Taylor Deupree',
    
    // Ambient & Drone
    'Brian Eno', 'Steve Roach', 'Robert Rich', 'Biosphere', 'Geir Jenssen',
    'Thomas Köner', 'Pauline Oliveros', 'La Monte Young', 'Terry Riley', 'Philip Glass',
    'Steve Reich', 'Arvo Pärt', 'Henryk Górecki', 'John Cage', 'Morton Feldman',
    
    // Electronic Focus Music
    'Boards of Canada', 'Aphex Twin', 'Autechre', 'Squarepusher', 'Plaid',
    'Four Tet', 'Caribou', 'Floating Points', 'Actress', 'Ben Frost',
    'Alva Noto', 'Ryuichi Sakamoto', 'Fennesz', 'Christian Fennesz', 'Mark Pritchard',
    
    // Post-Rock 
    'Godspeed You! Black Emperor', 'Sigur Rós', 'Explosions in the Sky', 'This Will Destroy You', 'Russian Circles',
    'Mono', 'Boris', 'Sunn O)))', 'Earth', 'Sleep',
    
    // Jazz & Experimental
    'GoGo Penguin', 'Portico Quartet', 'Mammal Hands', 'Hania Rani', 'Peter Broderick'
  ],

  party: [
    // Dance & EDM Party
    'Calvin Harris', 'David Guetta', 'The Chainsmokers', 'Swedish House Mafia', 'Marshmello',
    'Skrillex', 'Diplo', 'Major Lazer', 'Zedd', 'Disclosure',
    'Martin Garrix', 'Tiësto', 'Armin van Buuren', 'Hardwell', 'Afrojack',
    
    // Hip-Hop  Bangers
    'Drake', 'Kendrick Lamar', 'Travis Scott', 'Future', 'Migos',
    'Cardi B', 'Megan Thee Stallion', 'Doja Cat', 'Saweetie', 'City Girls',
    'Lil Wayne', 'Nicki Minaj', 'Big Sean', 'A$AP Rocky', 'Playboi Carti',
    
    // Pop Party Hits
    'Dua Lipa', 'Ariana Grande', 'Taylor Swift', 'Olivia Rodrigo', 'Doja Cat',
    'Lizzo', 'Harry Styles', 'The Weeknd', 'Bruno Mars', 'Post Malone',
    'Billie Eilish', 'Bad Bunny', 'Rosalía', 'Karol G', 'J Balvin',
    
    // Classic Party & Dance
    'Daft Punk', 'Justice', 'Modjo', 'Stardust', 'Cassius',
    'Bob Sinclar', 'Roger Sanchez', 'Armand Van Helden', 'Fatboy Slim', 'The Chemical Brothers',
    
    // Latin & Reggaeton Party
    'Bad Bunny', 'J Balvin', 'Ozuna', 'Anuel AA', 'Karol G',
    'Rosalía', 'C. Tangana', 'Rauw Alejandro', 'Daddy Yankee', 'Don Omar'
  ]
};

// Helper func to get random artists from a mood
export const getRandomArtistsFromMood = (mood, count = 4) => {
  const artists = MOOD_ARTISTS[mood] || MOOD_ARTISTS.happy;
  const shuffled = [...artists].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getAvailableMoods = () => {
  return Object.keys(MOOD_ARTISTS);
};

// artist count for a mood (for debugging)
export const getArtistCountForMood = (mood) => {
  return MOOD_ARTISTS[mood] ? MOOD_ARTISTS[mood].length : 0;
};
