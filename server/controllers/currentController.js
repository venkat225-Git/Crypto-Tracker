import Coin from "../models/currentModel.js";
import fetch from "node-fetch";

let cache = null;
let lastFetch = 0;

const getCoins = async (req, res) => {
  try {
    const now = Date.now();

    // 🧠 Use cached data if fetched recently (less than 1 min ago)
    if (cache && now - lastFetch < 60 * 1000) {
      console.log("✅ Using cached data");
      return res.json(cache);
    }

    // 🌐 Try fetching from CoinGecko API
    let response;
    try {
      response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd",
        {
          headers: {
            "Accept": "application/json",
            "User-Agent": "crypto-tracker-app",
          },
          timeout: 10000, // 10 sec timeout
        }
      );
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      response = null;
    }

    // ⚠️ If CoinGecko fails (500, 429, or network), use public proxy
    if (!response || !response.ok) {
      console.log(
        `⚠️ CoinGecko API failed (status: ${response?.status || "no response"}) → Using proxy`
      );
      response = await fetch(
        "https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
      );
    }

    const data = await response.json();
    cache = data;
    lastFetch = now;

    console.log("✅ Data fetched successfully from:", response.url.includes("allorigins") ? "Proxy" : "CoinGecko");
    res.json(data);

  } catch (error) {
    console.error("💥 Controller Error:", error.message);
    res.status(500).json({ error: "Failed to fetch crypto data" });
  }
};

export default getCoins

