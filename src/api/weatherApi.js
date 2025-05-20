// src/api/weatherApi.js

const apiKey = "7dba400116b29419cf1091a21132cb3d"; // Put your OpenWeather API key here

export const fetchWeatherByCity = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
  if (!response.ok) {
    throw new Error("City not found");
  }
  const data = await response.json();
  return data;
};

export const fetchWeatherByCoords = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  if (!response.ok) {
    throw new Error("Weather data not found");
  }
  const data = await response.json();
  return data;
};
