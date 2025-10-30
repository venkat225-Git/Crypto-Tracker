import fetch from "node-fetch";
import Coin from "../models/currentModel.js";

export const fetchdata = async (req, res) => {
  try {
    console.log("🛰️ Fetching data from CoinGecko via proxy...");

    // ✅ Working proxy (Render-safe)
    const proxyUrl = "https://proxy.cors.sh/";
    const coingeckoUrl =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

    // ✅ Fetch data through proxy
    const response = await fetch(proxyUrl + coingeckoUrl, {
      headers: {
        "x-cors-api-key": "temp_8f7b9a7df6d7d7e7", // free key for testing
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Empty data received from CoinGecko");
    }

    console.log(`✅ Received ${data.length} coins from CoinGecko`);

    // ✅ Clear old data and insert new data
    await Coin.deleteMany({});
    await Coin.insertMany(
      data.map((coin) => ({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        last_updated: new Date(coin.last_updated),
      }))
    );

    console.log("💾 Coins saved successfully to MongoDB");

    res.status(200).json({
      message: "Coins fetched and stored successfully",
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("❌ Error fetching coins:", error.message);

    // 🧠 Fallback — return cached DB data if API fails
    try {
      const localCoins = await Coin.find();
      if (localCoins.length > 0) {
        console.log("⚙️ Serving cached data from MongoDB");
        return res.status(200).json({
          message: "CoinGecko failed, serving cached data",
          count: localCoins.length,
          data: localCoins,
        });
      }
    } catch (dbError) {
      console.error("❌ DB Fallback Error:", dbError.message);
    }

    // If both fail
    res.status(500).json({
      message: "Failed to fetch coins",
      error: error.message,
    });
  }
};
