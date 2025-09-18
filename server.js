const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Top Roblox experiences by universe ID
const universeIds = [
  920587237,     // Adopt Me
  492492222,     // Brookhaven
  873760244,     // Blox Fruits
  1550233904,    // Pet Simulator 99
  735030788,     // Royale High
  142823291,     // Murder Mystery 2
  1962086868,    // Tower of Hell
  6516141723,    // Doors
  1119586518     // Arsenal
];

app.get("/market", async (req, res) => {
  const url = "https://games.roblox.com/v1/games?universeIds=" + universeIds.join(",");

  try {
    const response = await axios.get(url);
    const result = {};

    for (const game of response.data.data) {
      result[game.name] = {
        Price: game.playing || 0,
        Visits: game.visits || 0
      };
    }

    res.json(result);
  } catch (err) {
    console.error("Error fetching market data:", err.message);
    res.status(500).json({ error: "Failed to fetch market data." });
  }
});

app.listen(PORT, () => {
  console.log(`Roblox Crypto Market Proxy running on port ${PORT}`);
});
