
# Assignment 3: Full-Stack Music Application

## Introduction

This assignment looks at developing a full-stack application utilizing React, PostgreSQL, Express, Node.JS, and Axios to create a music website.

## Objective

- Develop a full-stack application capable of storing music information.
- Utilize Axios and React to perform CRUD activities with your Express server and PostgreSQL database.

## Task Description

### Task 1: React [Frontend Technology] (30%)

- **Boilerplate (5%):** Create a standard React application with a folder for each page (Artist, Songs, Albums). Include a Home Page with buttons to direct to the other three pages.
- **Pages (25%):** Create a seperate React page for artists, songs and albums. Each page should have the appropriate input fields and buttons for each of the CRUD (Create, Retrieve, Update and Delete) commands. Each page should also have a div that displays any information received back from the server on the page. Each page should have the functionality to query the server with each of the CRUD commands and return data accordingly.

### Task 2: Express/Node.js [Backend Technology] (30%)

- **Boilerplate (10%):** Set up a Node.js project with an Express server connecting to your Maynooth CS230 PostgreSQL database. Generate folders for controllers and routes. The server file should be named server.js and import all controllers and routes.
- **Controllers (10%):** Implement all CRUD functionality for artists, songs and albums in their own separate controllers.
- **Routes (10%):** Create routes for each controller in their own file to direct all requests based on URLs.

### Task 3: SQL [Database Technology] (20%)

- **Artist Model (5%):** Define an artist model with fields for Artist Name, Number of Monthly Listeners, Genre, and two lists (songs, albums) containing references to the appropriate items in other databases.
- **Song Model (5%):** Define a song model with fields for song name, release year, and album.
- **Album Model (10%):** Define an album model with fields for album name, artist, release year, number of listens, and a list of songs. The songs and artist should reference to the appropriate items in the other databases.

### Task 4: Demonstrator Explanation (20%)

Students will be asked two questions regarding the assignment and key concepts used in the project. Each question is worth 10% of the assignment.

## Deliverables

Submit a .ZIP file to Moodle containing the following items:

- frontend
- backend
- screenshot.jpg (Screenshot of the home page)

Exclude the `node_modules` folder from both.

## Extra Notes

Students are encouraged to seek assistance from demonstrators for clarification or questions regarding the assignment.
	
assignment-03.pdf assignment-03.pdf
11 March 2025, 2:47 PM