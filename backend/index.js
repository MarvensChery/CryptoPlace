

// backend/index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route de test
app.get("/api/hello", (req, res) => {
	res.json({ message: "Hello from CryptoPlace backend 👋" });
});

app.listen(PORT, () => {
	console.log(`CryptoPlace backend running at http://localhost:${PORT}`);
});
