# Assignment 4: Therapist Client Management System

## Introduction

In this application, you will be asked to create a simple system for a user to manage therapists, clients and sessions.

### Task 1: React (Frontend Development) (20%)

#### Requirements:

- [ ] **Home Page (5%)**:

    - [ ] Create a React app with separate pages for the Therapist, Client and Session Pages
    - [ ] Use React Router and add buttons to the home page to navigate between each of the pages.

- [ ] **Therapist Page (5%)**:

    - [ ] Design and implement a dashboard displaying all therapists in a tabular format.
    - [ ] Display all the information about them from the model in a tidy fashion..
    - [ ] Enable user to perform CRUD operations (Create, Read, Update, Delete) on therapists directly from the dashboard.

- [ ] **Client Page (5%)**:

    - [ ] Design and implement a dashboard displaying all clients in a tabular format.
    - [ ] Display all the information about them from the model in a tidy fashion..
    - [ ] Enable user to perform CRUD operations (Create, Read, Update, Delete) on clients directly from the dashboard.

- [ ] **Session Page (5%)**:

    - [ ] Design and implement a dashboard displaying all sessions in a tabular format.
    - [ ] Display all the information about them from the model in a tidy fashion..
    - [ ] Enable user to perform CRUD operations (Create, Read, Update, Delete) on sessions directly from the dashboard.

### Task 2: Express / Node.js / SQL (60%)

You will be required to make a server that processes requests the user makes on the UI, perform the correct command, and return the correct data from the database.

#### Requirements:

- [ ] **Express Server (10%)**:

    - [ ] Set up an Express server to handle incoming requests from the frontend.
    - [ ] Implement routes and controllers for therapists, clients and sessions.

- [ ] **Routes / Controllers (30%)**:

    - [ ] Define routes and corresponding controllers to handle CRUD operations for therapists.
    - [ ] Define routes and corresponding controllers to handle CRUD operations for clients.
    - [ ] Define routes and corresponding controllers to handle CRUD operations for sessions.

- [ ] **Models (20%)**:

    - [ ] Design database tables to store therapist, clients and sessions information.
    - [ ] Clients should have a name, email, phone number and regularity of appointments (WEEKLY/MONTHLY).
    - [ ] Therapists should have a title, name, email, location, years of practice and availability (TAKING CLIENTS/NOT TAKING CLIENTS).
    - [ ] Sessions should have a therapist (use key from other database), client (use key from other database), notes, date and length.

### Task 3: Demonstrator Explanation (20%)

Students will be asked two questions regarding the assignment and key concepts used in the project. Each question is worth 10% of the assignment.

## Deliverables

Submit a .ZIP file to Moodle containing the following items:

- [ ] frontend
- [ ] backend
- [ ] screenshot.jpg (Screenshot of the home page)

Exclude the `node_modules` folder from both.