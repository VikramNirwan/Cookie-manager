const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3000;

// Create MySQL connection
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Qwerty@12345",
  database: "clickstream",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Middleware to parse JSON bodies
app.use(express.json());

// POST route for inserting new data
app.post("/clickstream", (req, res) => {
  const { panelid, referer, url } = req.body; // Assuming panelid, referer, and url are the fields you want to insert
  const sql = "INSERT INTO data (panelid, referer, url) VALUES (?, ?, ?)";
  const values = [panelid, referer, url];
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    console.log("New data inserted:", result.insertId);
    res
      .status(201)
      .json({ message: "Data created successfully", dataId: result.insertId });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
