import fetch from "node-fetch";
import Coin from "../models/currentModel.js";

// ✅ Controller: Fetch and save top 10 coins
export const fetchdata = async (req, res) => {
  try {
    console.log("Fetching data from CoinGecko via proxy...");

    const coingeckoUrl =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

    // 🧩 Use proxy to bypass rate limit (Render safe)
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(coingeckoUrl)}`;

    const response = await fetch(proxyUrl, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Empty data received from CoinGecko");
    }

    // 🧹 Clear old data
    await Coin.deleteMany({});

    // 💾 Insert new data
    const coins = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      last_updated: new Date(coin.last_updated),
    }));

    await Coin.insertMany(coins);
    console.log("✅ Coins saved successfully to MongoDB");

    res.status(200).json({
      message: "Coins fetched and stored successfully",
      count: coins.length,
      coins,
    });
  } catch (error) {
    console.error("❌ Error fetching coins:", error.message);

    // 🧠 If CoinGecko fails, fallback to database data
    try {
      const localCoins = await Coin.find();
      if (localCoins.length > 0) {
        console.log("⚙️ Using cached DB data as fallback");
        return res.status(200).json({
          message: "Fetched from database (CoinGecko unavailable)",
          count: localCoins.length,
          coins: localCoins,
        });
      }
    } catch (dbError) {
      console.error("DB fallback failed:", dbError.message);
    }

    res.status(500).json({
      message: "Failed to fetch coins",
      error: error.message,
    });
  }
};
