import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Chargement...");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Erreur de connexion au backend"));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🚀 CryptoPlace – Phase 0</h1>
      <p>Message provenant du backend :</p>
      <pre>{message}</pre>
    </div>
  );
}

export default App;
