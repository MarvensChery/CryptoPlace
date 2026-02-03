/* eslint-env node */

// backend/index.js
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));
const redditRoutes = require("./routes/reddit");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/api/hello", (req, res) => {
	res.json({ message: "Hello from CryptoPlace backend 👋" });
});

// get crypto price route
app.get("/api/market", async (req, res) => {
	try {
		const response = await fetch(
			"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano"
		);
		const data = await response.json();
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: "Erreur API marché crypto" });
	}
});
app.get("/api/market-info", async (req, res) => {
	try {
		// 1) données globales
		const g = await fetch("https://api.coingecko.com/api/v3/global");
		const globalData = await g.json();

		// 2) top cryptos (par capitalisation)
		const m = await fetch(
			"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1"
		);
		const coins = await m.json();

		res.json({ global: globalData.data, coins });
	} catch (err) {
		console.error("Erreur /api/market-info:", err);
		res.status(500).json({ error: "Erreur serveur" });
	}
});
// Reddit sentiment routes
app.use("/api", redditRoutes);


app.listen(PORT, () => {
	console.log(`CryptoPlace backend running at http://localhost:${PORT}`);
});
