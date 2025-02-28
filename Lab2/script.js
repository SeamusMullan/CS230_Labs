// ========================================================================
// Main Setup Schtuff
// ========================================================================

// Make the submit button fetch the weather for the specified city
// if we dont get a valid city, the later functions will say this.

document.getElementById('submit-button').addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value;
    if (cityName) {
        updateWeather(cityName);
    } else {
        alert('Please enter a city name.');
    }
});


// ========================================================================
// Weather Function Fetching
// ========================================================================

/*
Example json file:

"dublin": {
            "temperature": 12,
            "humidity": 80,
            "uv_index": 3,
            "wind": {
                "speed": 20,
                "direction": "W"
            }
        },
*/

/**
 * Fetches weather data for the specified city.
 * Function will wait for the information from the json before calling updateSite() to avoid undefined errors.
 * @param {string} cityName
 */
function updateWeather(cityName) {
    // Fetch the data from the JSON file
    fetch("weather-info.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        localStorage.setItem('weatherData', JSON.stringify(data));
        populateCityInfo(data, cityName);
    })
    .catch(error => console.error('Error fetching data:', error));
}

/**
 * This function allows us to populate the site with the data from the local storage.
 * This gets used when we load the pages in the pages/ folder.
 * we need to do this since we have to keep the data between all the pages.
 */
function populateFromLocalStorage(){
    let data = JSON.parse(localStorage.getItem('weatherData'));
    populateCityInfo(data, cityName);
}

function populateCityInfo(data, cityName) {
    // Use Array.find to locate the city object with a matching cityName (case-insensitive)
    const cityData = data.find(
      (city) => city.cityName.toLowerCase() === cityName.toLowerCase()
    );
  
    if (cityData) {
      console.log(cityData);
      document.getElementById('uv').innerText = cityData.uvIndex + ' UV';
      document.getElementById('temperature').innerText =
        cityData.temperatureCelsius + '°C';
      document.getElementById('humidity').innerText =
        cityData.humidity * 100 + '% Humidity';
      document.getElementById('wind').innerText = cityData.windSpeed;
  
      updateStyles(cityData);
    } else {
      // The city doesn't exist in the data
      console.error('City not found in data.');
      document.getElementById('uv').innerText = 'City not found in JSON';
      document.getElementById('temperature').innerText = 'City not found in JSON';
      document.getElementById('humidity').innerText = 'City not found in JSON';
      document.getElementById('wind').innerText = 'City not found in JSON';
    }
  }
  

function updateStyles(data){
    // using weather data, update the styles of the page based on the weather itself.
    
    // Temperature

    // UV Index

    // Humidity

    // Wind
}