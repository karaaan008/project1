const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("weather.db");

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS weather (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT,
    description TEXT,
    temperature REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// POST - Create weather entry
app.post("/weather", (req, res) => {
  const { city, description, temperature } = req.body;
  db.run(
    `INSERT INTO weather (city, description, temperature) VALUES (?, ?, ?)`,
    [city, description, temperature],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// GET - All weather data
app.get("/weather", (req, res) => {
  db.all(`SELECT * FROM weather ORDER BY timestamp DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// PUT - Update a record
app.put("/weather/:id", (req, res) => {
  const { description, temperature } = req.body;
  db.run(
    `UPDATE weather SET description = ?, temperature = ? WHERE id = ?`,
    [description, temperature, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Updated", changes: this.changes });
    }
  );
});

// DELETE - Delete a record
app.delete("/weather/:id", (req, res) => {
  db.run(`DELETE FROM weather WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted", changes: this.changes });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
