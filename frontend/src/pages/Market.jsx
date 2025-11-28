// frontend/src/pages/Market.jsx

import { useEffect, useState } from "react";
import "./Market.css";

function Market() {
  const [globalData, setGlobalData] = useState(null);
  const [cryptos, setCryptos] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("popular"); 

  useEffect(() => {
    fetch("http://localhost:5000/api/market-info")
      .then((res) => res.json())
      .then((data) => {
        if (data.global && Array.isArray(data.coins)) {
          setGlobalData(data.global);
          setCryptos(data.coins);
          setError("");
        } else {
          setError(data.error || "Failed to load market data.");
        }
      })
      .catch(() => {
        setError("Could not reach CryptoPlace backend.");
      });
  }, []);

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  const formatPercent = (v) =>
    `${(v ?? 0).toFixed(2)} %`;

  
  const topByMarketCap = [...cryptos].sort(
    (a, b) => (b.market_cap || 0) - (a.market_cap || 0)
  );
  const trendCoins = topByMarketCap.slice(0, 3); 

  const topGainers = [...cryptos]
    .filter((c) => c.price_change_percentage_24h != null)
    .sort(
      (a, b) =>
        b.price_change_percentage_24h - a.price_change_percentage_24h
    )
    .slice(0, 3); 
  
  let tableCoins = [...cryptos];

  if (activeTab === "trending") {
    tableCoins.sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0));
  } else if (activeTab === "gainers") {
    tableCoins.sort(
      (a, b) =>
        (b.price_change_percentage_24h || 0) -
        (a.price_change_percentage_24h || 0)
    );
  } else if (activeTab === "losers") {
    tableCoins.sort(
      (a, b) =>
        (a.price_change_percentage_24h || 0) -
        (b.price_change_percentage_24h || 0)
    );
  } else {
    
    tableCoins.sort(
      (a, b) => (b.market_cap || 0) - (a.market_cap || 0)
    );
  }

  
  const filteredCoins = tableCoins
    .filter((coin) =>
      (coin.name + " " + coin.symbol)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .slice(0, 50); 
  return (
    
    <div className="market-page">
      
        <section className="title-section">
        <h1 className="market-title">Today’s cryptocurrency prices</h1>
        <p className="market-subtitle">
          The <strong>global cryptocurrency market capitalization</strong>{" "}
          moves in real time. Check live prices, trends and market performance.
        </p>
      </section>
     

      
      <section className="market-cards">
        
    <div className="market-card big-card">
    <div className="big-card-header">
        <span className="card-label">Global market cap</span>
        {globalData && (
        <span className="market-cap-badge">
            {globalData.active_cryptocurrencies?.toLocaleString()} coins
        </span>
        )}
    </div>

    <div className="card-value-highlight">
        <div className="card-value">
        {globalData
            ? currency.format(globalData.total_market_cap?.usd || 0)
            : "—"}
        </div>
        <p className="card-helper-text">
        Total value of all listed cryptocurrencies in USD.
        </p>
    </div>

    <div className="card-footer">
        <span className="card-footer-label">24H change</span>
        <span
        className={
            "card-change-pill " +
            ((globalData?.market_cap_change_percentage_24h_usd || 0) >= 0
            ? "pill-positive"
            : "pill-negative")
        }
        >
        {globalData
            ? formatPercent(globalData.market_cap_change_percentage_24h_usd)
            : "+ ? %"}
        </span>
    </div>
    </div>


      
<div className="market-card">
  <span className="card-label">Trend • 24h</span>
  <ul className="card-list">
    {trendCoins.length > 0 ? (
      trendCoins.map((coin) => (
        <li className="trend-item" key={coin.id}>
          {coin.image && (
            <img
              src={coin.image}
              alt={coin.name}
              className="coin-icon-trend"
            />
          )}
          <div className="trend-info">
            <span className="coin-name">{coin.name}</span>
            <span
              className={
                (coin.price_change_percentage_24h || 0) >= 0
                  ? "trend-positive"
                  : "trend-negative"
              }
            >
              {formatPercent(coin.price_change_percentage_24h || 0)}
            </span>
          </div>
        </li>
      ))
    ) : (
      <li>Loading...</li>
    )}
  </ul>
</div>


<div className="market-card">
  <span className="card-label">Top performers • 24h</span>
  <ul className="card-list">
    {topGainers.length > 0 ? (
      topGainers.map((coin) => (
        <li className="trend-item" key={coin.id}>
            {coin.image && (
            <img
              src={coin.image}
              alt={coin.name}
              className="coin-icon-trend"
            />
          )}
          <span className="coin-name">{coin.name}</span>
          <span className="trend-positive">
            {formatPercent(coin.price_change_percentage_24h || 0)}
          </span>
        </li>
      ))
    ) : (
      <li>Loading...</li>
    )}
  </ul>
</div>
      </section>

      
      <section className="market-toolbar">
       <div className="market-tabs">
  <div className="tabs-group">
    <button
      className={`tab ${activeTab === "popular" ? "active" : ""}`}
      onClick={() => setActiveTab("popular")}
    >
      Most popular
    </button>
    <button
      className={`tab ${activeTab === "trending" ? "active" : ""}`}
      onClick={() => setActiveTab("trending")}
    >
      Trending
    </button>
    <button
      className={`tab ${activeTab === "gainers" ? "active" : ""}`}
      onClick={() => setActiveTab("gainers")}
    >
      Top gainers
    </button>
    <button
      className={`tab ${activeTab === "losers" ? "active" : ""}`}
      onClick={() => setActiveTab("losers")}
    >
      Top losers
    </button>
  </div>

  <div className="search-container">
    <i className="fa-solid fa-magnifying-glass search-icon"></i>
    <input
      type="text"
      placeholder="Search"
      className="search-input"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
</div>

        <div className="market-filters">
          
          <div className="time-buttons">
           
            <button className="active">24H</button>
            
          </div>
          <select className="currency-select" defaultValue="USD">
            <option selected>USD</option>
            <option disabled>CAD</option>
            <option disabled>EUR</option>
          </select>
        </div>
      </section>

      
      {error && <p className="market-error">🚨 {error}</p>}

      
      <section className="market-table-wrapper">
        <table className="market-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Change (24h)</th>
              <th>Market cap</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.length > 0 ? (
              filteredCoins.map((coin, index) => (
                <tr key={coin.id}>
                  <td>{index + 1}</td>
                  <td className="coin-cell">
                    {coin.image && (
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="coin-icon"
                      />
                    )}
                    <div className="coin-text">
                      <span className="coin-name">{coin.name}</span>
                      <span className="coin-symbol">
                        {coin.symbol?.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td>{currency.format(coin.current_price || 0)}</td>
                  <td
                    className={
                      "change " +
                      ((coin.price_change_percentage_24h || 0) >= 0
                        ? "positive"
                        : "negative")
                    }
                  >
                    {formatPercent(coin.price_change_percentage_24h || 0)}
                  </td>
                  <td>
                    {coin.market_cap
                      ? currency.format(coin.market_cap)
                      : "—"}
                  </td>
                  <td className="action-buttons">
                    <button className="btn-buy">Buy</button>
                    <button className="btn-predict">See Prediction</button>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-cell">
                  {error
                    ? "Unable to display market data right now."
                    : "Loading..."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Market;
