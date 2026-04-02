require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    exposedHeaders: ["X-Coins", "X-Inventory-Remaining"]
  })
);

app.use(express.json());
app.use("/", routes);

// Generic 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});