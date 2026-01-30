// src/pages/Home.jsx
import "./Home.css";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <main className="home-page">
      <>
      <Navbar />
      </>
      
      <div className="home-page">...</div>
  
      {/* HERO */}
      <section className="home-hero section-container">
        <div className="home-hero-text">
          
          <h1>
            Prédit le marché crypto
            <br />
            à partir des réseaux sociaux & des nouvelles
          </h1>

          <p className="home-hero-subtitle">
            CryptoPlace analyse le sentiment sur X (Twitter), Reddit et les
            actualités crypto pour générer des signaux de marché. 
            Tu vois en un coup d’œil quels coins sont sur-hypés, sous-évalués ou à éviter.
          </p>

          <div className="home-hero-actions">
            <a href="/market" className="btn-primary">
              Lancer une prédiction
            </a>
            <button className="btn-ghost">
              Voir un exemple de signal
            </button>
          </div>

          <div className="home-hero-meta">
            <span>📊 Scores de sentiment en temps (quasi) réel</span>
            <span>📰 Impact des news pris en compte</span>
            <span>🤖 Généré par ton moteur de prédiction</span>
          </div>
        </div>

        {/* Carte de prédiction à droite */}
        <div className="home-hero-card">
          <div className="prediction-header">
            <span className="prediction-label">Aperçu d’une prédiction</span>
            <span className="prediction-pill">BTC / 24h</span>
          </div>

          <div className="prediction-main">
            <div>
              <p className="prediction-title">Probabilité de hausse</p>
              <p className="prediction-value">68%</p>
              <p className="prediction-confidence">Confiance : Élevée</p>
            </div>
            <div className="prediction-badge sentiment-positive">
              Sentiment global
              <span>Positif</span>
            </div>
          </div>

          <div className="prediction-bars">
            <div className="prediction-bar-row">
              <span>Réseaux sociaux</span>
              <div className="bar">
                <div className="bar-fill bar-social" />
              </div>
              <span className="bar-score">76</span>
            </div>
            <div className="prediction-bar-row">
              <span>News</span>
              <div className="bar">
                <div className="bar-fill bar-news" />
              </div>
              <span className="bar-score">62</span>
            </div>
          </div>

          <div className="prediction-footer">
            <span>⚠️ Ce n’est pas un conseil financier.</span>
            <span className="prediction-link">Voir les détails de la méthodo →</span>
          </div>
        </div>
      </section>

      {/* SECTION : Comment ça marche */}
      <section className="home-section section-container">
        <h2>Comment CryptoPlace prédit le marché</h2>
        <p className="home-section-subtitle">
          Trois couches d'analyse pour transformer le bruit des réseaux et des news 
          en signaux utilisables.
        </p>

        <div className="home-grid three-columns">
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Collecte des données</h3>
            <p>
              Récupération des posts, tweets, threads et titres d’articles 
              liés aux cryptos les plus suivies.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Analyse du sentiment</h3>
            <p>
              Score de sentiment (positif / neutre / négatif) sur chaque coin, 
              pondéré par l’influence des comptes et des sources.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Génération de signaux</h3>
            <p>
              Conversion du sentiment en scénarios de marché : probabilité de hausse/baisse,
              intensité du mouvement, horizon (24h, 7j…).
            </p>
          </div>
        </div>
      </section>

      {/* SECTION : Ce que tu peux faire */}
      <section className="home-section section-container">
        <h2>Ce que tu vas pouvoir faire avec CryptoPlace</h2>

        <div className="home-grid two-columns">
          <div className="feature-card large">
            <div className="feature-icon">🔍</div>
            <h3>Scanner rapidement le marché</h3>
            <p>
              Sur la page Market, tu verras pour chaque coin : variation du prix, market cap,
              mais aussi un bouton <strong>Prédire</strong> qui t'affiche un signal basé
              sur le sentiment et les news.
            </p>
          </div>
          <div className="feature-card large">
            <div className="feature-icon">⏱️</div>
            <h3>Ne pas rater le “momentum social”</h3>
            <p>
              Les mouvements violents commencent souvent sur les réseaux avant d’arriver
              sur les charts. L’objectif de CryptoPlace est de capter ce décalage.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
