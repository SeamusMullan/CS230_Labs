// ========================================================================
// Main Setup Schtuff
// ========================================================================

window.onload = (event) => {
    const page = window.location.pathname.split('/').pop();
    console.log(page);
    
    // returns ___.html

    switch (page) {
        case 'index.html':
        case '':
            // Handle the index page - ensure submit button exists
            if (document.getElementById('submit-button')) {
                document.getElementById('submit-button').addEventListener('click', () => {
                    const cityName = document.getElementById('city-input').value;
                    if (cityName) {
                        updateWeather(cityName);
                    } else {
                        alert('Please enter a city name.');
                    }
                });
            }
            break;

        default:
            // if we're on any other page, load from the local storage.
            populateFromLocalStorage();
            break;
    }
};

// ========================================================================
// Weather Function Fetching
// ========================================================================

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
        console.log("Local Storage Data: ", data);
        let cityName = localStorage.getItem('cityName');
        console.log("Local Storage cityName: ", cityName);
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
      console.log("Found city data:", cityData);

      const page = window.location.pathname.split('/').pop();
      
      // Get elements or set fallbacks if they don't exist
      const tempElement = document.getElementById('temperature');
      const humidElement = document.getElementById('humidity');
      const uvElement = document.getElementById('uv');
      const windElement = document.getElementById('wind');

      switch(page) {
        case '':
        case 'index.html':
            // Update all elements for the index page
            if (tempElement) tempElement.innerText = cityData.temperatureCelsius + '°C';
            if (humidElement) humidElement.innerText = cityData.humidity * 100 + '% Humidity';
            if (uvElement) uvElement.innerText = cityData.uvIndex + ' UV';
            if (windElement) windElement.innerText = cityData.windSpeed + '/h';
            break;
        case 'temperature.html':
            if (tempElement) tempElement.innerText = cityData.temperatureCelsius + '°C';
            break;
        case 'humidity.html':
            if (humidElement) humidElement.innerText = cityData.humidity * 100 + '% Humidity';
            break;
        case 'uv.html':
            if (uvElement) uvElement.innerText = cityData.uvIndex + ' UV';
            break;
        case 'wind.html':
            if (windElement) windElement.innerText = cityData.windSpeed + '/h';
            break;
        default:
            console.log('Page not specified: ' + page);
            break;
      }
  
      updateStyles(cityData);

    } else {
      // The city doesn't exist in the data
      console.error('City not found in data.');
      
      // Get elements or set fallbacks if they don't exist
      const tempElement = document.getElementById('temperature');
      const humidElement = document.getElementById('humidity');
      const uvElement = document.getElementById('uv');
      const windElement = document.getElementById('wind');
      
      const errorMessage = 'City not found in data';
      
      if (tempElement) tempElement.innerText = errorMessage;
      if (humidElement) humidElement.innerText = errorMessage;
      if (uvElement) uvElement.innerText = errorMessage;
      if (windElement) windElement.innerText = errorMessage;
    }
}

function toggleTemperature() {
    const temp = document.getElementById('temperature');
    
    if (!temp) {
        console.error('Temperature element not found');
        return;
    }
    
    const currentTemp = temp.innerText;
    if (!currentTemp) {
      try{
        const storedTemp = localStorage.getItem('temperature');
        if (storedTemp) {
          temp.innerText = storedTemp;
        }
      } catch (error) {
        console.error('Error fetching temperature:', error);
        return;
      }
    }
    
    const tempValue = parseFloat(currentTemp);
    if (isNaN(tempValue)) {
        console.error('Invalid temperature value');
        return;
    }
    
    if (currentTemp.includes('°C')) {
      // Convert to Fahrenheit
      const fahrenheit = (tempValue * 9) / 5 + 32;
      temp.innerText = `${fahrenheit.toFixed(1)}°F`;
    } else {
      // Convert to Celsius
      const celsius = ((tempValue - 32) * 5) / 9;
      temp.innerText = `${celsius.toFixed(1)}°C`;
    }
}

function updateStyles(data){
    // Using weather data, update the styles of the page based on the weather itself
    const temperature = data.temperatureCelsius;
    const humidity = data.humidity;
    const uv = data.uvIndex;
    const wind = parseFloat(data.windSpeed.replace('km', ''));
    
    const page = window.location.pathname.split('/').pop();

    // Temperature styling
    if (page === 'temperature.html') {
        const bodyElement = document.body;
        bodyElement.classList.remove('temp-cold', 'temp-moderate', 'temp-hot');
        
        if (temperature < 10) {
            bodyElement.classList.add('temp-cold');
        } else if (temperature < 25) {
            bodyElement.classList.add('temp-moderate');
        } else {
            bodyElement.classList.add('temp-hot');
        }
        
        // Update thermometer height if it exists
        const thermometer = document.getElementById('thermometer');
        if (thermometer) {
            const thermometerFill = thermometer.querySelector('::before');
            // Thermometer is styled using CSS pseudo-elements
        }
    }

    // Humidity styling
    if (page === 'humidity.html') {
        const bodyElement = document.body;
        bodyElement.classList.remove('humid-low', 'humid-moderate', 'humid-high');
        
        if (humidity < 0.3) {
            bodyElement.classList.add('humid-low');
        } else if (humidity < 0.7) {
            bodyElement.classList.add('humid-moderate');
        } else {
            bodyElement.classList.add('humid-high');
        }
    }

    // UV Index styling
    if (page === 'uv.html') {
        const bodyElement = document.body;
        bodyElement.classList.remove('uv-low', 'uv-moderate', 'uv-high');
        
        if (uv < 3) {
            bodyElement.classList.add('uv-low');
        } else if (uv < 6) {
            bodyElement.classList.add('uv-moderate');
        } else {
            bodyElement.classList.add('uv-high');
        }
    }

    // Wind styling
    if (page === 'wind.html') {
        const bodyElement = document.body;
        bodyElement.classList.remove('wind-calm', 'wind-moderate', 'wind-strong');
        
        if (wind < 10) {
            bodyElement.classList.add('wind-calm');
        } else if (wind < 20) {
            bodyElement.classList.add('wind-moderate');
        } else {
            bodyElement.classList.add('wind-strong');
        }
    }
}