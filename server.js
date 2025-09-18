const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// List of experience URLs to scrape
const games = {
  "Garden Tower Defense": "https://www.roblox.com/games/108533757090220/Garden-Tower-Defense",
  "Blox Fruits": "https://www.roblox.com/games/873760244/Blox-Fruits",
  "Brookhaven 🏡RP": "https://www.roblox.com/games/492492222/Brookhaven-RP",
  "Pet Simulator 99": "https://www.roblox.com/games/1550233904/Pet-Simulator-99"
};

app.get("/market", async (req, res) => {
  const result = {};

  for (const [name, url] of Object.entries(games)) {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const $ = cheerio.load(response.data);
      const activeText = $("p.text-lead.font-caption-body").first().text().replace(/,/g, "");
      const activeCount = parseInt(activeText) || 0;

      result[name] = {
        Price: activeCount,
        Visits: null
      };
    } catch (err) {
      console.error(`Error scraping ${name}:`, err.message);
      result[name] = {
        Price: 0,
        Visits: null
      };
    }
  }

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`✅ Roblox Game Scraper running on port ${PORT}`);
});
