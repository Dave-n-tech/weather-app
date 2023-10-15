// accessing the html elements using their selectors
const input = document.querySelector("#input");
const button = document.querySelector("#search-button");
const locationButton = document.querySelector(".location-button")
const cityName = document.querySelector(".city-name");
const presentDate = document.querySelector("#date");
const description = document.querySelector(".icon__description");
const icon = document.querySelector("#main-icon");
const details = document.querySelectorAll(".weather-details--description");
const forecastBox = document.querySelector(".forecast-box")

// declaring variables for api url
const apiKey = "a6ae423049c54e2aaef104942232609";
const apiUrl = "https://api.weatherapi.com/v1/current.json?";
const forecastUrl = "https://api.weatherapi.com/v1/forecast.json?";


// function to generate the forecast cards
const createWeatherCard = (weatherItem) => {
  return`<li class="cards">
            <h3> (${weatherItem.date})</h3>
            <img src="${weatherItem.day.condition.icon}" alt="weather icon" class="forecast-icon">
            <p class="cards-description"> ${weatherItem.day.condition.text} </p>
            <p class="cards-details"> Temperature: ${weatherItem.day.avgtemp_c}C</p>
            <p class="cards-details"> Wind: ${weatherItem.day.maxwind_mph}mph</</p>
            <p class="cards-details"> Humidity: ${weatherItem.day.avghumidity}%</</p>
        </li>`;
};


//async function to get current weather data from the api 
const getWeather = async (city) => {
  try{
    const response = await fetch(apiUrl + `key=${apiKey}&q=${city}&aqi=yes`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data)
  
    cityName.textContent = data.location.name;
    presentDate.textContent = data.location.localtime.slice(0, 11);
    
    // selecting only the needed properties from the current obects by destructuring and inserting into the html elements
    const { temp_c, wind_mph, humidity } = data.current;
    details[0].textContent = `Temperature: ${temp_c}C`;
    details[1].textContent = `Wind: ${wind_mph}mph`;
    details[2].textContent = `Humidity: ${humidity}%`;
    
    icon.src = data.current.condition.icon;
    description.textContent = data.current.condition.text; 
  }catch(error){
    console.error("Error:", error)
    alert("An error has occured, please try again")
  }
};


//async function to get the forecast weather data from api
const getForecast = async (city) => {
  try{
    const response = await fetch(
      forecastUrl + `key=${apiKey}&q=${city}&aqi=yes&days=3`
    );
    let data = await response.json();
    // selecting only the forecast days
    let threeDayForecast = data.forecast.forecastday;
    console.log(threeDayForecast);
    console.log(data.forecast)
    //clearing the forecast container
    forecastBox.innerHTML = "";
    // looping through the forecast days and creating a card display for each of them
    threeDayForecast.forEach((weatherItem) => {
      forecastBox.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
    });
  }catch(error){
    console.error('Error:', error)
  }
};


// function to get the city input value and call the current and forecast weather functions
const generateWeather = (event) => {
  event.preventDefault();
  if(input.value.length === 0){
    alert("please enter a city name")
  }else{
    const city = input.value;
    getWeather(city);
    input.value = "";
    getForecast(city);
  }
};

const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position)
        },
        error => {
          console.log(error)
        }
      )
}

// event listener on button to call the generate weather function
button.addEventListener("click", generateWeather);
locationButton.addEventListener("click", getUserLocation);

input.addEventListener("keypress", (e)=> {

  if(e.key === 'Enter'){
    generateWeather(e)
    input.value = ""
  }
})

