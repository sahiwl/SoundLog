# Timelapse

### 17 Nov 1:18AM
fix auto api calls from ai services on every refresh/first visit on homepage


### 17 Nov 12:45AM
- Major bug in ai services: the model used was deprecated long back, switched to a better model (updated to 2.5flash)
- disabled mood buttons during cooldown
- fix remaining req displaying on frontend
- if ai services fail, accoriding to Atomicity, ratelimits will be back to as it was before request was sent (for eg - initially it was 2reqs per minute, after req was made -> 1 req remaining for the rest of the minute, if req fails -> ratelimits back to 2reqs/min) 
- fix coutdown to show updated rate limit info from backend


### 2 Nov 12:44pm
gAuth disabled 

### 11 Aug 1:35pm
finally shifted to vercel for backend 
update: vercel supports serverless backends, so reverting back to render

### 7 May 7:48PM
- ui changes
- fixed wakatime link 
- added analytics support using umami


### 10 April 1:38AM
- [x] add google auth


### 4 April 2:41AM
 
- [ ] add get artist's individual albums, top-tracks, related artists
- [ ] add userRatings.jsx on track page (different user's ratings)
- [ ] add recent reviews on homepage
- [x] newreleases specific page


### 3 April 3:54AM
- fixed pages crashing on every reload (vercel issue)

> after scratching my head for 36hrs, i figured why my logout was not working. I should've read carefully about cookie management, but wtv ~ `sameSite: lax` this was the culprit. this basically doesn't allow cross-site requests for cookies, only same-site. just keep it `sameSite:None; secure: true` for when your backend and frontend are on different domains :)

### 1 April 2:07PM
- fixed search component not being mounted over children components

### 1 April 4:31AM
- [x] bio should have a different font 
- [x] font schema change kar sahil 😡
- [x] umami ananlytics
- [x] backdrop blur walls behind as background of pages (experimental)

### 31 Mar 6:10PM
- Track ratings are now visible in albumPage, users can go to trackpages and rate individual tracks. 
(yes even from searchBox ;) 
 
### 31 Mar 3:03AM
- Added user-specific albums page (`/user/:username/albums`) with pagination. Same for reviews, listenlater pages
- [x] add user-specific likes pages
- [x] add profile page, profile icon
- [x] fix navbar overflowing over other pages (sticky)
 

### 30Mar 3:15AM

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