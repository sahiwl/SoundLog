### pagination.controller.js

- removed spotifyData from response (getMusic and getAlbums), as it is sending a 4k line api response, which is def hard to read. (will look into this later)
- I had to implement protectRoute, w/o it is not getting auth token ig. It makes sense for user-specific routes, but for the rest of them - i need to remove them (will look into this later)
- so far the rest of it works.

### TODOS

- in getUserTracks, use spotify tracks api to call - pass itemID in it
- GetOrCreateSpotifyData - after 1000docs or more, delete the old entries / use a date-time limiter to delete old docs. for eg- keep last 10days docs, delete the rest



### changes 21mar25-

- changed actions controller, such that whenver an action is performed - tracks or albums, it is saved in the db first, and the next time on the same object action will be performed, it will search for that obj (tracks or albums) in db first, if(!obj) in db -> then only api call happens. Same for pagination.
- changed models a bit, readjusted them according to the spotify response.
