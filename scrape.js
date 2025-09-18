const puppeteer = require("puppeteer");
const fs = require("fs");

const games = {
  "Blox Fruits": "https://www.roblox.com/games/873760244/Blox-Fruits",
  "Brookhaven 🏡RP": "https://www.roblox.com/games/492492222/Brookhaven-RP",
  "Pet Simulator 99": "https://www.roblox.com/games/1550233904/Pet-Simulator-99",
  "Garden Tower Defense": "https://www.roblox.com/games/108533757090220/Garden-Tower-Defense"
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const result = [];

  for (const [name, url] of Object.entries(games)) {
    try {
      await page.goto(url, { waitUntil: "networkidle2" });
      const count = await page.$eval("p.text-lead.font-caption-body", el => el.textContent.replace(/,/g, ""));
      result.push({
        name,
        playing: parseInt(count) || 0,
        visits: null
      });
    } catch (err) {
      console.error(`Error scraping ${name}:`, err.message);
      result.push({
        name,
        playing: 0,
        visits: null
      });
    }
  }

  await browser.close();

  fs.writeFileSync("data.json", JSON.stringify(result, null, 2));
  console.log("✅ Scraped data saved to data.json");
})();
