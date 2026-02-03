import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./predictReddit.css";

export default function RedditPredict() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const coin = location.state?.coin;

	const API = "http://localhost:5000";

	const queryUrl = useMemo(() => {
		return `${API}/api/reddit-sentiment?coin=${encodeURIComponent(id)}&feed=new&limit=25`;
	}, [API, id]);

	// One state object for everything
	const [req, setReq] = useState({
		status: "idle", // "idle" | "loading" | "success" | "error"
		data: null,
		error: null,
	});

	useEffect(() => {
		let cancelled = false;

		// Do NOT setState synchronously at the top of the effect
		// Only setState from async callbacks

		(async () => {
			try {
				const r = await fetch(queryUrl);
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				const json = await r.json();

				if (!cancelled) {
					setReq({ status: "success", data: json, error: null });
				}
			} catch (e) {
				if (!cancelled) {
					setReq({ status: "error", data: null, error: String(e) });
				}
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [queryUrl]);

	// Render helpers
	const loading = req.status === "idle" || req.status === "loading";
	const error = req.status === "error" ? req.error : null;
	const data = req.status === "success" ? req.data : null;

	return (
		<div className="predict-page">
			<div className="predict-header">
				<h1 className="predict-title">Reddit Prediction</h1>
				<p className="predict-subtitle">Community sentiment for {coin?.name || id}</p>
			</div>

			<div className="predict-coin-hero">
				{coin?.image && <img src={coin.image} alt={coin.name} />}
				<div className="predict-coin-hero-name">{coin?.name || id}</div>
			</div>

			<div style={{ maxWidth: 1100, margin: "1.5rem auto" }}>
				{loading && <div>Loading Reddit sentiment...</div>}
				{error && <div style={{ color: "red" }}>Error: {error}</div>}

				{data && (
					<div className="source-card" style={{ width: "100%" }}>
						<div className="source-top">
							<div className="source-title">
								<i className="fa-brands fa-reddit source-icon icon-reddit"></i>
								Reddit — r/{data.subreddit}
							</div>
							<span className="source-badge">{data.globalSentiment}</span>
						</div>

						<div className="source-desc">
							Score: <b>{data.totalScore}</b> • Posts analyzed: <b>{data.postsAnalyzed}</b>
							<br />
							Bullish: {data.counts.bullish} • Bearish: {data.counts.bearish} • Neutral: {data.counts.neutral}
						</div>

						<hr style={{ opacity: 0.2 }} />

						<div style={{ display: "grid", gap: 12 }}>
							{data.posts.slice(0, 8).map((p) => (
								<div key={p.id}>
									<div style={{ fontSize: 12, opacity: 0.7 }}>
										{p.sentiment.toUpperCase()} ({Number(p.sentimentScore).toFixed(2)}) • 👍 {p.ups} • 💬 {p.comments}
									</div>
									<a href={p.permalink} target="_blank" rel="noreferrer">
										{p.title}
									</a>
								</div>
							))}
						</div>

						<div style={{ marginTop: 16, display: "flex", gap: 12 }}>
							<button className="source-btn btn-reddit" onClick={() => navigate(-1)}>
								← Back
							</button>
							<button
								className="source-btn btn-both"
								onClick={() => navigate(`/predict/${id}/both`, { state: { coin } })}
							>
								View Combined →
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
