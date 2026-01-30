// frontend/src/pages/Market.jsx

import { useEffect, useState } from "react";
import "./Market.css";

import { useNavigate } from "react-router-dom";

function Market() {
  const [cryptos, setCryptos] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("popular"); 
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/api/market-info")
      .then((res) => res.json())
      .then((data) => {
        if (data.global && Array.isArray(data.coins)) {
         
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

  const goToPrediction = (coin) => {
  navigate(`/predict/${coin.id}`, { state: { coin } });
  };


  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  const formatPercent = (v) =>
    `${(v ?? 0).toFixed(2)} %`;

  
  
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
       <>
      <>
      
      </>
      <div className="market-page">...</div>
    </>
      
        <section className="title-section">
        <h1 className="market-title">Today’s cryptocurrency prices</h1>
        <p className="market-subtitle">
          The <strong>global cryptocurrency market capitalization</strong>{" "}
          moves in real time. Check live prices, trends and market performance.
        </p>
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
                    <button className="btn-predict" onClick={() => goToPrediction(coin)}>
                      See Prediction
                    </button>
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
