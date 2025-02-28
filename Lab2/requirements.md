# Assignment 2: Weather JSON Application

## Introduction

The objective of this assignment is to develop a web application that retrieves weather data from a local JSON file and dynamically updates the page content based on the received information. Users can input their location (city name), and the application will display relevant weather forecast details such as temperature, humidity, UV index, wind speed, etc.

## Objective

- Develop a web application structured into organized HTML, CSS, and JavaScript files.
- Utilize JavaScript to fetch data from a JSON file and display it dynamically.
- Implement CSS styles that adjust based on the user's input location, including background images, icon colors, and page appearance, reflecting the weather conditions.

## Task Description

### Task 1: HTML (Hypertext Markup Language) (30%)

This section focuses on creating the basic structure of the web application.

#### Requirements:

- **Boilerplate (5%)**: Initialize the web application with an organized folder structure containing `index.html`, `styles.css`, and `script.js` and a folder for the following HTMl pages.
- **Home Page (5%)**: Develop a Home Page featuring a heading, an input field for the city name, a button to submit the input, and a navbar with four buttons to pages for Temperature, Humidity, UV Index, and Wind Speed.
- **Temperature Section (5%)**: Create a HTML page displaying the temperature with a title, a paragraph (with an id for temperature data), a toggle button for Fahrenheit and Celsius, and space for a thermometer icon.
- **Humidity Section (5%)**: Develop a HTML page displaying the humidity with a title, a paragraph (with an id for humidity data), and space for a drop icon.
- **UV Index Section (5%)**: Implement a HTML page displaying the UV Index with a title, a paragraph (with an id for UV data), and space for a sun icon.
- **Wind Speed Section (5%)**: Create a HTML page displaying wind speed with a title, a paragraph (with an id for wind data), and space for a gust of air icon.

### Task 2: CSS (Cascading Style Sheets) (10%)

This section involves styling the web application dynamically based on weather data.

#### Requirements:

- **Boilerplate (5%)**: Ensure each HTML page has appropriate styling using `styles.css`.
- **Background Color (5%)**: Give each HTML page a unique background color.

### Task 3: JS (JavaScript) (40%)

This section focuses on implementing functionality using JavaScript, including fetching data from the JSON file and updating styles dynamically.

#### Requirements:

- **JSON Data Integration (20%)**: Upon user input (city search), fetch weather data from a local JSON file using the Fetch API. Parse the received data and update the respective elements (Temperature, Humidity, UV Index, Wind Speed) with data from the input city accordingly.
- **Style Updates (20%)**: Dynamically adjust the color of icons within each section based on weather conditions. For example, if the temperature exceeds 20°C, the temperature icon should turn yellow; otherwise, it should remain blue. Apply similar color adjustments for wind speed, humidity, and UV (you can choose the threshold).

### Task 4: Demonstrator Explanation (20%)

Students will be asked two questions regarding the assignment and key concepts used in the project. Each question is worth 10% of the assignment.

## Deliverables

Students are required to submit a `.ZIP` file containing the complete web application, ensuring all required files (`index.html`, `styles.css`, `script.js`, and `weather.json` and the other HTML files) are included.