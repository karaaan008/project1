// File: WeatherRecords.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Make sure this file includes the new CSS
import "./WeatherRecords.css";


function WeatherRecords() {
  const [savedData, setSavedData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ city: "", description: "", temperature: "" });
  const navigate = useNavigate();

  const fetchData = () => {
    fetch("http://localhost:3001/weather")
      .then((res) => res.json())
      .then((data) => setSavedData(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      city: item.city,
      description: item.description,
      temperature: item.temperature,
    });
  };

  const saveEdit = async (id) => {
    await fetch(`http://localhost:3001/weather/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditingId(null);
    fetchData();
  };

  const deleteRecord = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      await fetch(`http://localhost:3001/weather/${id}`, {
        method: "DELETE",
      });
      fetchData();
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">📋 Saved Weather Records</h2>

      <button
        className="styled-button"
        onClick={() => navigate("/dashboard")}
        style={{ marginBottom: "20px" }}
      >
        ⬅ Back to Dashboard
      </button>

      <div className="table-wrapper">
        <table className="weather-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Description</th>
              <th>Temperature (°C)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedData.map((item) => (
              <tr key={item.id}>
                <td>
                  {editingId === item.id ? (
                    <input
                      className="table-input"
                      value={editData.city}
                      onChange={(e) =>
                        setEditData({ ...editData, city: e.target.value })
                      }
                    />
                  ) : (
                    item.city
                  )}
                </td>
                <td>
                  {editingId === item.id ? (
                    <input
                      className="table-input"
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                    />
                  ) : (
                    item.description
                  )}
                </td>
                <td>
                  {editingId === item.id ? (
                    <input
                      className="table-input"
                      type="number"
                      value={editData.temperature}
                      onChange={(e) =>
                        setEditData({ ...editData, temperature: e.target.value })
                      }
                    />
                  ) : (
                    item.temperature
                  )}
                </td>
                <td>
                  {editingId === item.id ? (
                    <>
                      <button className="action-btn" onClick={() => saveEdit(item.id)}>
                        💾 Save
                      </button>
                      <button
                        className="action-btn cancel"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="action-btn edit" onClick={() => startEdit(item)}>
                        ✏️ Edit
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => deleteRecord(item.id)}
                      >
                        🗑 Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeatherRecords;
