const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/market", async (req, res) => {
  try {
    const exploreUrl = "https://apis.roblox.com/explore-api/v1/get-sorts?device=computer&country=us";

    const exploreRes = await axios.get(exploreUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const sorts = exploreRes.data.sorts || [];
    const popularSort = sorts.find(s => s.name === "Popular");

    if (!popularSort || !popularSort.games) {
      return res.status(500).json({ error: "No popular games found." });
    }

    const topGames = popularSort.games.slice(0, 10);
    const universeIds = topGames.map(g => g.universeId).join(",");

    const gameUrl = `https://games.roblox.com/v1/games?universeIds=${universeIds}`;
    const gameRes = await axios.get(gameUrl);

    const result = {};
    for (const game of gameRes.data.data) {
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
  console.log(`✅ Roblox Crypto Market Proxy running safely on port ${PORT}`);
});
