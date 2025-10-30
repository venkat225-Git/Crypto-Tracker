import fetch from "node-fetch";
import Coin from "../models/currentModel.js";

let cache = null;
let lastFetch = 0;

const fetchdata = async (req, res) => {
  console.log("✅ Request reached /api/coins controller");

  try {
    const now = Date.now();

    
    if (cache && now - lastFetch < 60 * 1000) {
      console.log("⚡ Using cached CoinGecko data");
      return res.status(200).json(cache);
    }

    const url =
      "https://api.coingecko.com/api/v3/coins/markets" +
      "?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "crypto-tracker-app (Render Deployment)"
      },
      signal: AbortSignal.timeout(10000), 
    });

    console.log("🔎 CoinGecko response status:", response.status);

    
    if (response.status === 429) {
      console.log("⚠️ CoinGecko rate-limit hit — using proxy...");
      response = await fetch(
        "https://api.allorigins.win/raw?url=" +
        encodeURIComponent(url),
        { headers: { "Accept": "application/json" } }
      );
      console.log("🌀 Proxy response status:", response.status);
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: `External API error from CoinGecko (Status: ${response.status})`,
      });
    }

    const outcome = await response.json();

 
    const filteredData = outcome.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      last_updated: coin.last_updated,
    }));

    
    cache = filteredData;
    lastFetch = now;

    console.log("✅ Successfully fetched", filteredData.length, "coins");
    res.status(200).json(filteredData);

  } catch (error) {
    console.error("❌ Backend fetch failed:", error.message);
    res.status(500).json({
      error: "Failed to fetch data from CoinGecko",
      details: error.message,
    });
  }
};

export default fetchdata;

