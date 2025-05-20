// File: Dashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { fetchWeatherByCity, fetchWeatherByCoords } from "./api/weatherApi";
import NetworkStatus from "./NetworkStatus";
import "./App.css";

function Dashboard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("search");

  const navigate = useNavigate();

  const handleSearch = async () => {
    setError(null);
    try {
      let data;

      if (mode === "search") {
        if (!city) {
          setError("Please enter a city name.");
          return;
        }
        data = await fetchWeatherByCity(city);
      } else if (mode === "location") {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            data = await fetchWeatherByCoords(latitude, longitude);
            setWeather(data);
            saveToBackend(data);
          },
          (err) => {
            setError("Unable to retrieve your location.");
            setWeather(null);
          }
        );
        return;
      }

      setWeather(data);
      saveToBackend(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  const saveToBackend = async (data) => {
    try {
      await fetch("http://localhost:3001/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: data.name,
          description: data.weather[0].description,
          temperature: data.main.temp,
        }),
      });
    } catch (err) {
      console.error("Failed to save weather:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <NetworkStatus />
      <h2 className="dashboard-heading">🌦️ Weather Dashboard</h2>

      <div className="mode-toggle">
        <label>
          <input
            type="radio"
            value="search"
            checked={mode === "search"}
            onChange={() => setMode("search")}
          />
          Search by City
        </label>
        <label>
          <input
            type="radio"
            value="location"
            checked={mode === "location"}
            onChange={() => setMode("location")}
          />
          Use My Location
        </label>
      </div>

      {mode === "search" && (
        <input
          className="styled-input"
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      )}

      {/* Search / Location button */}
      <button onClick={handleSearch} className="styled-button">
        {mode === "search" ? "Search Weather" : "Get Weather from Location"}
      </button>

      {/* View Saved Records button moved below the search button */}
      <button
        onClick={() => navigate("/weather-records")}
        className="styled-button"
        style={{ marginTop: "20px" }}
      >
        View Saved Records
      </button>

      {error && <p className="error">{error}</p>}

      {weather ? (
        <div className="weather-card fade-in">
          <h3>{weather.name}</h3>
          <div className="weather-icon">
            {weather.weather[0].main === "Clouds" ? (
              <img src="https://openweathermap.org/img/wn/03d@2x.png" alt="cloud" />
            ) : weather.weather[0].main === "Clear" ? (
              <img src="https://openweathermap.org/img/wn/01d@2x.png" alt="sun" />
            ) : (
              <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather" />
            )}
          </div>
          <div className="temp">{Math.round(weather.main.temp)}°C</div>
          <div className="description">{weather.weather[0].description}</div>
        </div>
      ) : (
        <p className="fade-in">Enter a city name or use location to get weather data.</p>
      )}
    </div>
  );
}

export default Dashboard;
