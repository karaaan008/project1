import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";
import WeatherRecords from "./WeatherRecords";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/weather-records" element={<WeatherRecords />} /> 
      </Routes>
    </Router>
  );
}

export default App;
