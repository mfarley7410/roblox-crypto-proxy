const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/market", async (req, res) => {
	const ids = [
		920587237, 492492222, 873760244, 1550233904,
		735030788, 142823291, 1962086868, 6516141723, 1119586518
	];
	const url = "https://games.roblox.com/v1/games?universeIds=" + ids.join(",");
	try {
		const response = await axios.get(url);
		const result = {};
		for (const entry of response.data.data) {
			result[entry.name] = {
				Price: entry.playing,
				Visits: entry.visits
			};
		}
		res.json(result);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch market data." });
	}
});

app.listen(PORT, () => {
	console.log(`Crypto Market Proxy running on port ${PORT}`);
});
