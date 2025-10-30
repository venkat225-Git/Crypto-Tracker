import fetch from "node-fetch";
import Coin from "../models/currentModel.js";

const fetchdata = async (req, res) => {
  console.log("✅ Request reached /api/coins controller");

  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets" +
      "?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "crypto-tracker-app (Render Deployment)",
      },
      // Prevent hanging request
      signal: AbortSignal.timeout(10000), // timeout in 10s
    });

    // Log status to understand what happens
    console.log("🔎 CoinGecko response status:", response.status);

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

