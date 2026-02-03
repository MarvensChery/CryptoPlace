/* eslint-env node */

// backend/services/redditSentiment.js

// Baseline sentiment analysis library
const Sentiment = require("sentiment");
const sentiment = new Sentiment();


const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

// In-memory cache to avoid hitting Reddit too often
const CACHE_MS = 2 * 60 * 1000;
const redditCache = new Map();

// Normalize text before sentiment analysis
function cleanText(text) {
	return (text || "")
		.toLowerCase()
		.replace(/http\S+/g, "")
		.replace(/[^a-z\s]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

// Map coin IDs to relevant subreddits
const COIN_TO_SUBREDDIT = {
	bitcoin: "Bitcoin",
	ethereum: "ethereum",
	tether: "Tether",
	bnb: "binance",
	xrp: "XRP",
	usdc: "USDC",
	solana: "solana",
	tron: "Tronix",
	dogecoin: "dogecoin",
	cardano: "cardano",
	"bitcoin-cash": "Bitcoincash",
	chainlink: "Chainlink",
	monero: "Monero",

};


// Crypto-specific keywords with weights (custom rules)
const CRYPTO_LEXICON = [
	{ re: /\b(ath|all time high|breakout|bullish|pump|moon|mooning|rip|rally|uptrend)\b/g, w: +2 },
	{ re: /\b(buy|accumulate|long|support held|strong support)\b/g, w: +1.5 },
	{ re: /\b(etf approval|halving|adoption)\b/g, w: +1.5 },

	{ re: /\b(bearish|dump|crash|rekt|downtrend|capitulation)\b/g, w: -2 },
	{ re: /\b(fud|fear|panic|sell off|liquidation|rug)\b/g, w: -1.5 },
	{ re: /\b(resistance rejected|weak|scam|hacked)\b/g, w: -1.5 },

	{ re: /\b(maybe|not sure|uncertain|could|might)\b/g, w: -0.5 },
];

// Custom crypto sentiment score based on keyword matches
function customCryptoScore(text) {
	let score = 0;
	for (const rule of CRYPTO_LEXICON) {
		const matches = text.match(rule.re);
		if (matches) score += matches.length * rule.w;
	}
	return score;
}

// Engagement-based weighting (ups + comments)
function engagementWeight(ups, comments) {
	const u = Math.log((ups || 0) + 1);
	const c = Math.log((comments || 0) + 1);
	return 1 + 0.15 * u + 0.10 * c;
}

// Clamp score to avoid outliers
function clamp(x, min, max) {
	return Math.max(min, Math.min(max, x));
}


async function getRedditSentiment({ coin,subreddit = "Bitcoin", feed = "new", limit = 50 }) {
	
	const key = coin ? String(coin).toLowerCase() : null;
	if (key && COIN_TO_SUBREDDIT[key]) {
		subreddit = COIN_TO_SUBREDDIT[key];
	}

	
	const cacheKey = `${key || "no-coin"}|${subreddit}|${feed}|${limit}`;
	const cached = redditCache.get(cacheKey);

	console.log("[getRedditSentiment]", { coin, subreddit, cacheKey });

	
	if (cached && Date.now() - cached.time < CACHE_MS) {
		return { fromCache: true, ...cached.payload };
	}

	const url = `https://www.reddit.com/r/${subreddit}/${feed}.json?limit=${limit}`;
	const response = await fetch(url, {
		headers: { "User-Agent": "CryptoPlace/1.0 (public-json)" },
	});

	if (!response.ok) {
		const err = new Error("Reddit fetch failed");
		err.status = response.status;
		throw err;
	}

	const data = await response.json();

	const postsRaw = data.data.children.map((item) => {
		const p = item.data;
		const text = p.selftext || "";
		const content = cleanText(`${p.title} ${text}`);

		const base = sentiment.analyze(content).score;
		const extra = customCryptoScore(content);
		const w = engagementWeight(p.ups, p.num_comments);

		let finalScore = clamp((base + extra) * w, -15, 15);

		let label = "neutral";
		if (finalScore > 1) label = "bullish";
		else if (finalScore < -1) label = "bearish";

		return {
			id: p.id,
			title: p.title,
			text,
			ups: p.ups,
			comments: p.num_comments,
			created_utc: p.created_utc,
			permalink: `https://www.reddit.com${p.permalink}`,
			sentimentScore: finalScore,
			sentiment: label,
		};
	});

	const posts = postsRaw.filter((p) => {
		const len = cleanText(`${p.title} ${p.text}`).length;
		if (len < 15) return false;
		if (/newsletter|daily breakdown/i.test(p.title)) return false;
		return true;
	});

	let totalScore = 0;
	let bullish = 0;
	let bearish = 0;
	let neutral = 0;

	for (const p of posts) {
		totalScore += p.sentimentScore;
		if (p.sentiment === "bullish") bullish++;
		else if (p.sentiment === "bearish") bearish++;
		else neutral++;
	}

	const globalSentiment =
		totalScore > 5 ? "Bullish" :
			totalScore < -5 ? "Bearish" :
				"Neutral";

	const payload = {
		source: "reddit",
		subreddit,
		feed,
		limit,
		postsAnalyzed: posts.length,
		globalSentiment,
		totalScore: Number(totalScore.toFixed(2)),
		counts: { bullish, bearish, neutral },
		posts,
		fetchedAt: new Date().toISOString(),
	};

	redditCache.set(cacheKey, { time: Date.now(), payload });
	return payload;
}

module.exports = { getRedditSentiment };
