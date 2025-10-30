import fetch from "node-fetch";
import Coin from "../models/currentModel.js";

export const fetchdata = async (req, res) => {
  try {
    console.log("🌍 Fetching live data from CoinGecko (via proxy)...");

    // ✅ Use proxy to bypass Render rate limit
    const proxyUrl = "https://proxy.cors.sh/";
    const targetUrl =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

    const response = await fetch(proxyUrl + targetUrl, {
      headers: {
        "x-cors-api-key": "temp_8f7b9a7df6d7d7e7", // free proxy key
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`CoinGecko API failed with status ${response.status}`);
    }

    const outcome = await response.json();
    console.log("✅ Live data received:", outcome.length, "coins");

    // 🧩 Filter and format data
    const filteredData = outcome.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      last_updated: coin.last_updated,
    }));

    // 💾 Optional: Save latest snapshot to DB
    await Coin.deleteMany({});
    await Coin.insertMany(filteredData);
    console.log("✅ Coins updated in MongoDB Atlas");

    // 🚀 Send to frontend
    res.status(200).json({
      message: "✅ Live CoinGecko data fetched successfully",
      count: filteredData.length,
      data: filteredData,
    });
  } catch (error) {
    console.error("❌ Error fetching live data:", error.message);

    // 🧠 Fallback: serve cached MongoDB data if API fails
    try {
      const localCoins = await Coin.find();
      if (localCoins.length > 0) {
        console.log("⚙️ Fallback to DB data (CoinGecko unavailable)");
        return res.status(200).json({
          message: "⚠️ Live API failed, showing cached MongoDB data",
          count: localCoins.length,
          data: localCoins,
        });
      }
    } catch (dbError) {
      console.error("DB fallback error:", dbError.message);
    }

    res.status(500).json({ error: "Failed to fetch live data" });
  }
};
