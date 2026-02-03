/* eslint-env node */

const express = require("express");
const router = express.Router();

const { getRedditSentiment } = require("../services/redditSentiment");

router.get("/reddit-sentiment", async (req, res) => {
	try {
		const coin = req.query.coin;
		const subreddit = req.query.subreddit || "Bitcoin";
		const feed = req.query.feed || "new";
		const limit = Number(req.query.limit || 50);

		console.log("[/api/reddit-sentiment]", { coin, subreddit, feed, limit });

		const data = await getRedditSentiment({ coin,subreddit, feed, limit });
		res.json(data);
	} catch (err) {
		console.error("Erreur /api/reddit-sentiment:", err);
		res.status(err.status || 500).json({
			error: "Erreur Reddit sentiment",
			status: err.status || 500,
			details: String(err.message || err),
		});
	}
});

module.exports = router;
