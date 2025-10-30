import fetch from "node-fetch";
import Coin from "../models/currentModel";

const fetchdata = async (req, res) => {
  console.log("✅ Request reached /api/coins controller");

  try {
    // External API URL (Top 10 crypto coins)
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1",
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "crypto-tracker-app (Render Deployment)" // Required header
        },
      }
    );

    // If CoinGecko is down or rate limited
    if (!response.ok) {
      console.error("❌ CoinGecko API failed with status:", response.status);
      return res.status(500).json({ error: "External API error from CoinGecko" });
    }

    // Parse data
    const outcome = await response.json();

    // Filter only required fields
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
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export default fetchdata;
