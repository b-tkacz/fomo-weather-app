const API_KEY = "57e67eb8bdb4c603a8d0b7c92252d0aa";

const CITIES = [
  { name: "Warsaw", country: "PL", isBase: true },
  { name: "Tokyo", country: "JP", isBase: false },
  { name: "Ishigaki", country: "JP", isBase: false },
  { name: "Osaka", country: "JP", isBase: false },
  { name: "Split", country: "HR", isBase: false },
  { name: "Florence", country: "IT", isBase: false },
  { name: "Pisa", country: "IT", isBase: false },
  { name: "Lisbon", country: "PT", isBase: false },
  { name: "Athens", country: "GR", isBase: false },
  { name: "Singapore", country: "SG", isBase: false },
  { name: "Madrid", country: "ES", isBase: false },
  { name: "Barcelona", country: "ES", isBase: false },
];

document.getElementById("refreshBtn").addEventListener("click", loadAllWeather);

async function getWeather(cityName, countryCode) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch weather for ${cityName}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

function createWeatherCard(weatherData) {
  const card = document.createElement("div");
  card.className = "weather-card";

  const cityName = document.createElement("h2");
  cityName.textContent = weatherData.name;
  card.appendChild(cityName);

  const temp = document.createElement("p");
  temp.textContent = `Temperature: ${weatherData.main.temp}°C`;
  card.appendChild(temp);

  const description = document.createElement("p");
  description.textContent =
    weatherData.weather[0].description.charAt(0).toUpperCase() +
    weatherData.weather[0].description.slice(1);
  card.appendChild(description);

  const icon = document.createElement("img");
  icon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  icon.alt = weatherData.weather[0].description;
  card.appendChild(icon);

  const humidity = document.createElement("p");
  humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
  card.appendChild(humidity);

  const windSpeed = document.createElement("p");
  windSpeed.textContent = `Wind: ${weatherData.wind.speed} m/s`;
  card.appendChild(windSpeed);

  return card;
}

function isBetterWeather(warsawData, cityData) {
  const tempBetter = cityData.main.temp > warsawData.main.temp;
  const lessCloudy = cityData.clouds.all < warsawData.clouds.all;
  return tempBetter || lessCloudy;
}

let isLoading = false;

async function loadAllWeather() {
  if (isLoading) return;
  isLoading = true;

  document.getElementById("loading").classList.remove("hidden");
  const promises = CITIES.map((city) => getWeather(city.name, city.country));

  const weatherDataArray = (await Promise.all(promises)).filter(
    (data) => data !== null
  );
  const warsawData = weatherDataArray.find((data) => data.name === "Warsaw");
  const citiesToDisplay = weatherDataArray.filter((cityData) => {
    if (cityData.name === "Warsaw") {
      return true;
    }
    return isBetterWeather(warsawData, cityData);
  });

  const weatherGrid = document.getElementById("weatherGrid");

  weatherGrid.innerHTML = "";

  citiesToDisplay.forEach((cityData, index) => {
    const card = createWeatherCard(cityData);
    card.style.animationDelay = `${index * 0.1}s`;
    weatherGrid.appendChild(card);
  });

  const now = new Date();
  const timeString = now.toLocaleString();
  document.getElementById("lastUpdated").textContent = timeString;
  document.getElementById("loading").classList.add("hidden");
  isLoading = false;
}

loadAllWeather();
