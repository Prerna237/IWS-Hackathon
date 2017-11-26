# IWS-Hackathon
Website: https://iws-forum.herokuapp.com/

**Check `docs` folder for full documentation**

- [Tech Stack: MongoDB | Node | Express | Bootstrap](#tech-stack)
- [Features](#features)
- [UI Pages](#ui-pages)
- [Setup on local machine](#using-node)
    - [Instructions](#instructions)
 
## Tech Stack
* Backend: Node
* Database: MongoDB (MLab : Database as a Service)
* Frontend: Bootstrap
* Hosted at: Heroku

## Features
* Bookmark
* Stars
* Comments to replies (Questions + Comments | Replies + Comments)
* Flag Inappropriate
* Thread Suggestions based on interests
* Categorywise Suggestions based on association rule mining
* Chat option: funtional only on specific IDs
* Delete by moderator
* Sort by Time and Views
* Relative thread suggestions based on answers viewed
* Analytics:
    * Google Analytics for device based analytics or facebook Analytics
    * Moderator Dashboard (access only from categorywise post page)
        * Clicks per category
        * Threads per category
        * Interests Chart
        * Moderator suggestion

## UI Pages
- [x] Profile Page
- [x] Categorywise Posts: Regular and Moderator
- [x] Posts and Replies
- [x] Home Page
- [x] Signup Page
- [x] Analytics Page

## Using Node
### Instructions
* Install nodejs > 8.0
* Clone git repo
* `npm install && npm start` or `yarn && yarn start`
* Open http://localhost:3000
* Edit website interface files in ./public/

* Using Express framework

