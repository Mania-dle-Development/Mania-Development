# Milestone 3 Progress Report

## GitHub Project Setup

Project board created: yes
Project board shared with codepathreview: yes

## Issues Created

List the title of each issue you created, one per line:

- Setup Backend #4
  - Create `.env.example` file #20
  - Setup Node/Express server to run on some port #28
- Setup Frontend #3
  - Setup React frontend #29
  - Configure TailwindCSS for Styling #14
- Setup Database on Render #2
  - Define and setup database config files #15
  - Create database tables based on ERD #16
  - Populate all tables in database with sample data #17
  - Add reset script to reset and seed the database #31
  - Update `.env.example` with Render environment variables #21
- Setup User Authentication
  - Create/setup auth config files #7
  - Setup authentication middleware #8
  - Create backend route for GitHub SSO #9
  - Create backend route for logout #12
  - Create a placeholder login page #11
  - Send requests to backend to login/logout from the frontend #24
  - Update .env.example with Passport.js environment variables #22
  - Create backend routes for other SSO #19
- Populate wordles table with default data #39
- Create Profile Page #5
- Create Classic Wordle Board #10
- Create Switcharoo Board #13
- Create Clock Mode Board #25
- Create Wordle Creator Page #35
- Build Wordle Leaderboard #36

## GitHub Milestones Created

List the name of each GitHub Milestone you created, one per line:

- Milestone 3 - Unit 7
- Milestone 4 - Unit 8
- Final Milestone - Unit 9

## Milestone 3 Completion

Replace the blank before the percent sign with a number from 0 to 100.
Completion percentage for Milestone 3 - Unit 7: 100%
List each issue you completed this unit and the main file or folder where that work lives, one per line:

- Setup Backend #4 - `/server`
  - Create `.env.example` file #20 - `/server/.env.example`
  - Setup Node/Express server to run on some port #28 - `/server`
- Setup Frontend #3 - `/client`
  - Setup React frontend #29 - `/client`
  - Configure TailwindCSS for Styling #14 - `/client/src/index.css`
- Setup Database on Render #2 - `/server/config/database.js` + `/server/config/reset.js`
  - Define and setup database config files #15 - `/server/config/database.js`
  - Create database tables based on ERD #16 - `/server/config/reset.js`
  - Populate all tables in database with sample data #17 - `/server/config/reset.js`
  - Add reset script to reset and seed the database #31 - `/server/package.json`
  - Update `.env.example` with Render environment variables #21 - `/server/.env.example`
- Setup User Authentication - `/server/config/auth.js` + `/server/server.js` + `/server/routes/auth.js` + `/client/src/pages/Login.jsx` + `/client/src/App.jsx` + `/server/.env.example`
  - Create/setup auth config files #7 - `/server/config/auth.js`
  - Setup authentication middleware #8 - `/server/server.js`
  - Create backend route for GitHub SSO #9 - `/server/routes/auth.js`
  - Create backend route for logout #12 - `/server/routes/auth.js`
  - Create a placeholder login page #11 - `/client/src/pages/Login.jsx`
  - Send requests to backend to login/logout from the frontend #24 - `/client/src/App.jsx` + `/client/src/pages/Login.jsx`
  - Update `.env.example` with Passport.js environment variables #22 - `/server/.env.example`

## Features Completed This Unit

List each feature you completed and checked off in readme.md this unit, one per line:

- User Authentication (backend implementation with a placeholder login page)
