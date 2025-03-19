# CS 230 Lab 3 - Full Stack Music Application

## Structure

### Frontend
- Uses React for fronted ui
- Includes custom components for all relevant elements of this app (see project-description.md)

### Backend
- Uses Express, Node.js, Axios and PostgreSQL
- Axios + React for CRUD-like events
- PostgreSQL 14 for managing databases
- Hosted on Express / Node.js

#### Database Layout

Artists
- Name (varchar)
- Monthly Listeners (int)
- Genre (varchar)
- Albums (json)
- Songs (json)

Albums
- Name (varchar)
- Artist (varchar)
- Release Year (year)
- Num. Listens (int)
- Songs (json)

Songs
- Name (varchar)
- Artist (varchar)
- Release Year (year)
- Album (json)

## Running the Project

Open the project in VSCode, tasks for running fronted, backend and Postgres are included.


NB: This project was created with `create-react-app`, which includes a large amount of code not required for this specific project
These files were left in the project because frankly, i wasnt bothered removing them and breaking stuff...

## License

See repository license
