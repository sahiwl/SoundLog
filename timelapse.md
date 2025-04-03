# Timelapse

### 4 April 2:41AM
 
- [ ] add get artist's individual albums, top-tracks, related artists
- [ ] add userRatings.jsx on track page (different user's ratings)
- [ ] add recent reviews on homepage



### 3 April 3:54AM
- fixed pages crashing on every reload (vercel issue)

> after scratching my head for 36hrs, i figured why my logout was not working. I should've read carefully about cookie management, but wtv ~ `sameSite: lax` this was the culprit. this basically doesn't allow cross-site requests for cookies, only same-site. just keep it `sameSite:None; secure: true` for when your backend and frontend are on different domains :)

### 1 April 2:07PM
- fixed search component not being mounted over children components

### 1 April 4:31AM
- [ ] bio should have a different font 
- [ ] font schema change kar sahil 😡
- [ ] umami ananlytics
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