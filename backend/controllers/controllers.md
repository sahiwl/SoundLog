###  pagination.controller.js
- removed spotifyData from response (getMusic and getAlbums), as it is sending a 4k line api response, which is def hard to read. (will look into this later)
- I had to implement protectRoute, w/o it is not getting auth token ig. It makes sense for user-specific routes, but for the rest of them - i need to remove them (will look into this later)
- so far the rest of it works.


### TODOS
- in getUserTracks, use spotify tracks api to call - pass itemID in it