// ========================================================================
// Main Setup Schtuff
// ========================================================================

window.onload = (event) => {
    const page = window.location.pathname.split('/').pop();
    console.log(page);
    
    // returns ___.html

    switch (page) {
        case 'index.html':
            // Do nothing on the index page
            break;

        default:
            // if were on any other page, load from the local storage.
            populateFromLocalStorage();
            break;
    }

  };

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
        localStorage.setItem('cityName', cityName);
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
    try{
        let data = JSON.parse(localStorage.getItem('weatherData'));
        console.log("Local Storage Data: " + data);
        let cityName = localStorage.getItem('cityName');
        console.log("Local Storage cityName: " + cityName);
        if (!data || !cityName) {
            throw new Error('Data or cityName not found in localStorage');
        }
        populateCityInfo(data, cityName);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function populateCityInfo(data, cityName) {
    // Use Array.find to locate the city object with a matching cityName (case-insensitive)
    const cityData = data.find(
      (city) => city.cityName.toLowerCase() === cityName.toLowerCase()
    );
  
    if (cityData) {
      console.log(cityData);

      const page = window.location.pathname.split('/').pop();

      switch(page){
        case '':
            // update all for testing
            document.getElementById('temperature').innerText = cityData.temperatureCelsius + '°C';
            document.getElementById('humidity').innerText = cityData.humidity * 100 + '% Humidity';
            document.getElementById('uv').innerText = cityData.uvIndex + ' UV';
            document.getElementById('wind').innerText = cityData.windSpeed;
            break;
        case 'temperature.html':
            document.getElementById('temperature').innerText = cityData.temperatureCelsius + '°C';
            break;
        case 'humidity.html':
            document.getElementById('humidity').innerText = cityData.humidity * 100 + '% Humidity';
            break;
        case 'uv.html':
            document.getElementById('uv').innerText = cityData.uvIndex + ' UV';
            break;
        case 'wind.html':
            document.getElementById('wind').innerText = cityData.windSpeed;
            break;
        default:
            console.error('Page not specified, this should not happen.');
            break;
      }
  
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

function toggleTemperature() {
    const temp = document.getElementById('temperature');
    
    const currentTemp = temp.innerText;
    if (!currentTemp) {
      try{
        temp = JSON.parse(localStorage.getItem('temperature'));
      } catch (error) {
        console.error('Error fetching data:', error);
      }

        if (!temp) {
            console.error('Temperature not found in localStorage');
            return;
        }
    }
    
    const tempValue = parseFloat(currentTemp);
    if (currentTemp.includes('°C')) {
      // Convert to Fahrenheit
      const fahrenheit = (tempValue * 9) / 5 + 32;
      temp.innerText = `${fahrenheit.toFixed(2)}°F`;
    } else {
      // Convert to Celsius
      const celsius = ((tempValue - 32) * 5) / 9;
      temp.innerText = `${celsius.toFixed(2)}°C`;
    }
}

function updateStyles(data){
    // using weather data, update the styles of the page based on the weather itself.
    let weatherData = JSON.parse(localStorage.getItem('weatherData'));
    
    const temperature = data.temperatureCelsius;
    const humidity = data.humidity;
    const uv = data.uvIndex;
    const wind = data.windSpeed;

    // Temperature
    

    // UV Index

    // Humidity

    // Wind
}