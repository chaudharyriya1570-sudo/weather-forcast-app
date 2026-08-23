const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");


// =========================
// SEARCH CITY
// =========================

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    searchCity(city);
});


// =========================
// SEARCH WITH ENTER KEY
// =========================

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});


// =========================
// GET CITY COORDINATES
// =========================

async function searchCity(city) {

    try {

        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const response = await fetch(geoUrl);

        const data = await response.json();


        if (!data.results || data.results.length === 0) {
            alert("City not found!");
            return;
        }


        const location = data.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const cityName = location.name;
        const country = location.country;


        getWeather(
            latitude,
            longitude,
            cityName,
            country
        );

    }

    catch (error) {

        console.error(error);

        alert("Something went wrong. Please try again.");

    }

}


// =========================
// GET WEATHER DATA
// =========================

async function getWeather(
    latitude,
    longitude,
    cityName,
    country
) {

    try {

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;


        const response =
            await fetch(weatherUrl);


        if (!response.ok) {
            throw new Error("Weather data not found");
        }


        const data =
            await response.json();


        displayWeather(
            data,
            cityName,
            country
        );


        displayForecast(data);

    }

    catch (error) {

        console.error(error);

        alert("Unable to get weather data.");

    }

}


// =========================
// DISPLAY CURRENT WEATHER
// =========================

function displayWeather(
    data,
    cityName,
    country
) {

    const current = data.current;


    // City Name

    document.getElementById("city").innerText =
        `${cityName}, ${country}`;


    // Temperature

    document.getElementById("temperature").innerText =
        `${Math.round(current.temperature_2m)}°C`;


    // Weather Description

    document.getElementById("description").innerText =
        getWeatherDescription(current.weather_code);


    // Humidity

    document.getElementById("humidity").innerText =
        `${current.relative_humidity_2m}%`;


    // Wind

    document.getElementById("wind").innerText =
        `${Math.round(current.wind_speed_10m)} km/h`;


    // Weather Icon

    document.getElementById("weatherIcon").src =
        getWeatherIcon(
            current.weather_code,
            current.is_day
        );


    // Sunrise

    document.getElementById("sunrise").innerText =
        formatTime(
            data.daily.sunrise[0]
        );


    // Sunset

    document.getElementById("sunset").innerText =
        formatTime(
            data.daily.sunset[0]
        );


    // Current Date

    const today =
        new Date();


    document.getElementById("date").innerText =
        today.toDateString();

}


// =========================
// DISPLAY 5 DAY FORECAST
// =========================

function displayForecast(data) {

    const forecastContainer =
        document.getElementById("forecast");


    forecastContainer.innerHTML = "";


    const daily = data.daily;


    // Get next 5 days

    for (let i = 0; i < 5; i++) {

        const date =
            new Date(daily.time[i]);


        const dayName =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        const maxTemp =
            Math.round(
                daily.temperature_2m_max[i]
            );


        const minTemp =
            Math.round(
                daily.temperature_2m_min[i]
            );


        const weatherCode =
            daily.weather_code[i];


        forecastContainer.innerHTML += `

            <div class="forecast-card">

                <h3>${dayName}</h3>

                <img 
                    src="${getWeatherIcon(weatherCode, 1)}"
                    alt="Weather Icon"
                >

                <p>
                    ${maxTemp}° / ${minTemp}°
                </p>

                <p>
                    ${getWeatherDescription(weatherCode)}
                </p>

            </div>

        `;

    }

}


// =========================
// WEATHER CODE DESCRIPTION
// =========================

function getWeatherDescription(code) {

    const weatherCodes = {

        0: "Clear sky",

        1: "Mainly clear",

        2: "Partly cloudy",

        3: "Overcast",

        45: "Foggy",

        48: "Depositing rime fog",

        51: "Light drizzle",

        53: "Moderate drizzle",

        55: "Dense drizzle",

        56: "Light freezing drizzle",

        57: "Dense freezing drizzle",

        61: "Slight rain",

        63: "Moderate rain",

        65: "Heavy rain",

        66: "Light freezing rain",

        67: "Heavy freezing rain",

        71: "Slight snowfall",

        73: "Moderate snowfall",

        75: "Heavy snowfall",

        77: "Snow grains",

        80: "Slight rain showers",

        81: "Moderate rain showers",

        82: "Violent rain showers",

        85: "Slight snow showers",

        86: "Heavy snow showers",

        95: "Thunderstorm",

        96: "Thunderstorm with hail",

        99: "Heavy thunderstorm with hail"

    };


    return weatherCodes[code] || "Unknown";

}


// =========================
// WEATHER ICONS
// =========================

function getWeatherIcon(code, isDay) {

    // Day or Night

    const day =
        isDay === 1;


    if (code === 0) {
        return day
            ? "https://cdn-icons-png.flaticon.com/512/869/869869.png"
            : "https://cdn-icons-png.flaticon.com/512/581/581601.png";
    }


    if (
        code === 1 ||
        code === 2
    ) {
        return "https://cdn-icons-png.flaticon.com/512/1163/1163661.png";
    }


    if (code === 3) {
        return "https://cdn-icons-png.flaticon.com/512/414/414927.png";
    }


    if (
        code === 45 ||
        code === 48
    ) {
        return "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
    }


    if (
        code >= 51 &&
        code <= 67
    ) {
        return "https://cdn-icons-png.flaticon.com/512/4150/4150897.png";
    }


    if (
        code >= 71 &&
        code <= 77
    ) {
        return "https://cdn-icons-png.flaticon.com/512/642/642102.png";
    }


    if (
        code >= 80 &&
        code <= 82
    ) {
        return "https://cdn-icons-png.flaticon.com/512/3351/3351979.png";
    }


    if (
        code >= 85 &&
        code <= 86
    ) {
        return "https://cdn-icons-png.flaticon.com/512/2315/2315309.png";
    }


    if (
        code >= 95 &&
        code <= 99
    ) {
        return "https://cdn-icons-png.flaticon.com/512/1146/1146860.png";
    }


    return "https://cdn-icons-png.flaticon.com/512/1779/1779940.png";

}


// =========================
// FORMAT SUNRISE / SUNSET
// =========================

function formatTime(timeString) {

    const date =
        new Date(timeString);


    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =========================
// CURRENT LOCATION
// =========================

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            getCurrentLocation(
                latitude,
                longitude
            );

        },


        () => {

            alert(
                "Unable to get your location. Please allow location permission."
            );

        }

    );

});


// =========================
// GET CURRENT LOCATION NAME
// =========================

async function getCurrentLocation(
    latitude,
    longitude
) {

    try {

        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`;


        const response =
            await fetch(geoUrl);


        const data =
            await response.json();


        let cityName = "Current Location";

        let country = "";


        if (
            data.results &&
            data.results.length > 0
        ) {

            cityName =
                data.results[0].name;

            country =
                data.results[0].country;

        }


        getWeather(
            latitude,
            longitude,
            cityName,
            country
        );

    }

    catch (error) {

        console.error(error);


        getWeather(
            latitude,
            longitude,
            "Current Location",
            ""
        );

    }

}