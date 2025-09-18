const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/market", async (req, res) => {
  try {
    const url = "https://raw.githubusercontent.com/ThatTimothy/live-stats/main/raw-popular-data.json";
    const response = await axios.get(url);

    const result = {};
    for (const game of response.data) {
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
  console.log(`✅ Roblox Market Proxy running on port ${PORT}`);
});
