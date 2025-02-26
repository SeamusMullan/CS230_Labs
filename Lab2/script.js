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
        // console.log(data);
        populateCityInfo(data, cityName);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function populateCityInfo(data, cityName){
    cityName = cityName.toLowerCase();
    // check if the city we want is in the data, if not, change info on site
    if (data.cities[cityName]){

        // set the data to the city we want
        let cityData = data.cities[cityName];
        console.log(cityData);
        document.getElementById('uv').innerText = cityData.uvIndex + ' UV';
        document.getElementById('temperature').innerText = cityData.temperatureCelsius + '°C';
        document.getElementById('humidity').innerText = cityData.humidity + '% Humidity';
        document.getElementById('wind').innerText = (cityData.windSpeed + ' Knots');

        updateStyles(cityData);

    } else {
        // the city doesnt exist...
        console.error('City not found in data.');
        document.getElementById('uv').innerText = 'City not found in JSON';
        document.getElementById('temperature').innerText = 'City not found in JSON';
        document.getElementById('humidity').innerText = 'City not found in JSON';
        document.getElementById('wind').innerText = 'City not found in JSON';
    }
}

function updateStyles(data){
    // using weather data, update the styles of the page based on the weather itself.
}