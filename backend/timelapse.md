# Timelapse

### 30 Mar 3:09am
 - changed track and album models, to store as much data I can from the api response
 - Did this because there was v less data to show on the albumPage and trackPage
 - One con I see is that responses have become as heavy as ~20kb per request, this can affect the performance of the site
 - so as a safetly, cleanup.js deletes the docs which are not accessed in the last 7days since lastAccess (date)
 - this make sures not too many unaccessed albums, tracks docs stay on db
 - also spotify gives free 3calls/sec so we don't really need ratelimiting. 