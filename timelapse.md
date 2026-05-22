# Timelapse

### 22 May 2026 4:26PM
 - fix: when no Profile Pic, a character is rendered as a placeholder at pfp
 - setup pnpm workspace for root dev script 
 - add a unified cache module at [spotifyCache.js](./backend/lib/spotifyCache.js). Looks up in mongodb first, on miss fetches from spotify, upserts and updates lastAccess endpoint if older than 24hr. 

### 20 May 2026 4:03AM
 - getUserProfile now has favourites populated with album cover/title/artist
 - Recent Reviews with last 3 with album thumb on profilepage
 - fix settings page  

### 20 May 2026 2:39AM
 - checkAuth() was called from Navbar, Hero, and AuthSuccess on load. Landing page alone could fire 2–3 /auth/check requests. Fixed it using a single checkAUth() at app.jsx
 - removed checkAUth from navbar, hero
 - User pages now have hook + grid + pagination (~35 lines each)

### 20 May 2026 2:08AM
 - All route files import and wrap async controllers from asyncHandler.js
 - removed muttler
 - add new AppError.js for global error handling, focusing on removing redundant try/catch blocks
 - every throw is now AppError. 400 for validation, 404 for "not found", 409 for "already reviewed".
 - controllers have no try/catch anymore. Routes are wrapped in asyncHandler, so any thrown AppError flows straight to the global handler.

### 20 May 2026 1:18AM
 - proper zod import, valid signup/login/update-profile schemas 
 - Removed the JWT fallback in index.js. Sessions now use only SESSION_SECRET (already required by validateEnv).


### 19 May 2026 9:01PM
   vercel.json changes: Proxy /api/* to Render beofre the SPA catch all. Browser sees soundlog.sahiwl.me/api (same site as the app) so JWT cookies work in Firefox. Update destination if backend host changes.


### 17 Nov 2025 1:18AM
fix auto api calls from ai services on every refresh/first visit on homepage


### 17 Nov 2025 12:45AM
- Major bug in ai services: the model used was deprecated long back, switched to a better model (updated to 2.5flash)
- disabled mood buttons during cooldown
- fix remaining req displaying on frontend
- if ai services fail, accoriding to Atomicity, ratelimits will be back to as it was before request was sent (for eg - initially it was 2reqs per minute, after req was made -> 1 req remaining for the rest of the minute, if req fails -> ratelimits back to 2reqs/min) 
- fix coutdown to show updated rate limit info from backend


### 2 Nov 2025 12:44pm
gAuth disabled 

### 11 Aug 2025 1:35pm
finally shifted to vercel for backend 
update: vercel supports serverless backends, so reverting back to render

### 7 May 2025 7:48PM
- ui changes
- fixed wakatime link 
- added analytics support using umami


### 10 April 2025 1:38AM
- [x] add google auth


### 4 April 2025 2:41AM
 
- [ ] add get artist's individual albums, top-tracks, related artists
- [ ] add userRatings.jsx on track page (different user's ratings)
- [ ] add recent reviews on homepage
- [x] newreleases specific page


### 3 April 2025 3:54AM
- fixed pages crashing on every reload (vercel issue)

> after scratching my head for 36hrs, i figured why my logout was not working. I should've read carefully about cookie management, but wtv ~ `sameSite: lax` this was the culprit. this basically doesn't allow cross-site requests for cookies, only same-site. just keep it `sameSite:None; secure: true` for when your backend and frontend are on different domains :)

### 1 April 2025 2:07PM
- fixed search component not being mounted over children components

### 1 April 2025 4:31AM
- [x] bio should have a different font 
- [x] font schema change kar sahil 😡
- [x] umami ananlytics
- [x] backdrop blur walls behind as background of pages (experimental)

### 31 Mar 2025 6:10PM
- Track ratings are now visible in albumPage, users can go to trackpages and rate individual tracks. 
(yes even from searchBox ;) 
 
### 31 Mar 2025 3:03AM
- Added user-specific albums page (`/user/:username/albums`) with pagination. Same for reviews, listenlater pages
- [x] add user-specific likes pages
- [x] add profile page, profile icon
- [x] fix navbar overflowing over other pages (sticky)
 

### 30Mar 2025 3:15AM

- Added AlbumPage, TrackPage
- UI is still a mess
- Removed DropdownSearch, instead will use a full screen search component smh
 #### Some Todos
- [x] navbar usericon and logout icon disappears after a while -> fix it such that it stays there till user is logged in.
- [x] remove clutter from landing page
- [x] implement actions on albumPage, trackPage
- [x] albumPage and trackPage are too long, divide it into smaller components
- [x] improvise the project structure

### pushdate
- fixed navbar issue where user and logout icon disappeared even when user is logged in.