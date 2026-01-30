import "./Predict.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function Predict() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const coin = location.state?.coin;

  return (
    <div className="predict-page">
      <div className="predict-header">
        <h1 className="predict-title">Prediction Sources</h1>
        <p className="predict-subtitle">
          Choose where to analyze sentiment
        </p>
      </div>

      {/* ✅ COIN HERO HEADER */}
      <div className="predict-coin-hero">
        {coin?.image && <img src={coin.image} alt={coin.name} />}
        <div className="predict-coin-hero-name">
          {coin?.name || id}
        </div>
      </div>

      {/* ✅ 3 SOURCE CARDS */}
      <div className="predict-sources">

        {/* TWITTER */}
        <div className="source-card">
          <div className="source-top">
            <div className="source-title">
              <i className="fa-brands fa-x-twitter source-icon icon-twitter"></i>
              Twitter (X)
            </div>
            
          </div>

          <div className="source-desc">
            Better for short-term momentum & breaking news signals.
          </div>

          <button
            className="source-btn btn-twitter"
            onClick={() => navigate(`/predict/${id}/twitter`, { state: { coin } })}
          >
            View Twitter Sentiment →
          </button>
        </div>

        {/* BOTH */}
        <div className="source-card">
          <div className="source-top">
            <div className="source-title">
              <i className="fa-solid fa-layer-group source-icon icon-both"></i>
              Twitter + Reddit
            </div>
            <span className="source-badge">Best</span>
          </div>

          <div className="source-desc">
            Combines real-time momentum + community conviction
          </div>

          <button
            className="source-btn btn-both"
            onClick={() => navigate(`/predict/${id}/both`, { state: { coin } })}
          >
            View Combined Prediction →
          </button>
        </div>

        {/* REDDIT */}
        <div className="source-card">
          <div className="source-top">
            <div className="source-title">
              <i className="fa-brands fa-reddit source-icon icon-reddit"></i>
              Reddit
            </div>
            
          </div>

          <div className="source-desc">
            Better for deeper discussion & longer-term sentiment.
          </div>

          <button
            className="source-btn btn-reddit"
            onClick={() => navigate(`/predict/${id}/reddit`, { state: { coin } })}
          >
            View Reddit Signals →
          </button>
        </div>

      </div>

      {/* BACK */}
      <div style={{ maxWidth: 1100, margin: "2rem auto 0 auto" }}>
        <button className="btn-back" onClick={() => navigate("/market")}>
          ← Back to Market
        </button>
      </div>
    </div>
  );
}
