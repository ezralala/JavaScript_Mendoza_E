const weatherCodes = {
  0: "Clear sky ☀️",
  1: "Mainly clear 🌤️",
  2: "Partly cloudy ⛅",
  3: "Overcast ☁️",
  45: "Fog 🌫️",
  48: "Depositing rime fog 🌫️",
  51: "Light drizzle 🌧️",
  53: "Moderate drizzle 🌧️",
  55: "Dense drizzle 🌧️",
  61: "Slight rain 🌧️",
  63: "Moderate rain 🌧️",
  65: "Heavy rain 🌧️",
  71: "Slight snow ❄️",
  73: "Moderate snow ❄️",
  75: "Heavy snow ❄️",
  80: "Slight rain showers 🌦️",
  81: "Moderate rain showers 🌦️",
  82: "Violent rain showers ⛈️",
  95: "Thunderstorm 🌩️",
  96: "Thunderstorm with slight hail ⛈️",
  99: "Thunderstorm with heavy hail ⛈️"
};

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const errorMsg = document.getElementById('error-msg');
const weatherInfo = document.getElementById('weather-info');

async function getWeather() {
  const query = cityInput.value.trim();
  if (!query) return;

  errorMsg.style.display = 'none';

  try {
    // 1. Convert City Name to Lat/Lon
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found');
    }

    const location = geoData.results[0];
    const { latitude, longitude, name, country } = location;

    // 2. Fetch Weather using Lat/Lon
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const current = weatherData.current;

    // 3. Display Data
    document.getElementById('city-display').textContent = `${name}, ${country || ''}`;
    document.getElementById('coords-display').textContent = `Lat: ${latitude.toFixed(2)} | Lon: ${longitude.toFixed(2)}`;
    document.getElementById('temp-display').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('condition-display').textContent = weatherCodes[current.weather_code] || "Unknown Condition";
    document.getElementById('wind-display').textContent = `${current.wind_speed_10m} km/h`;
    document.getElementById('humidity-display').textContent = `${current.relative_humidity_2m}%`;

    weatherInfo.style.display = 'block';

  } catch (err) {
    weatherInfo.style.display = 'none';
    errorMsg.style.display = 'block';
  }
}

// Event Listeners
searchBtn.addEventListener('click', getWeather);

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') getWeather();
});

// Load default city on initial launch
getWeather();