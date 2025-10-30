import fetch from "node-fetch";
import Coin from "../models/currentModel.js";

export const fetchdata = async (req, res) => {
  try {
    console.log("Fetching live data from CoinGecko...");

    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No data returned from CoinGecko");
    }

    // Clear old data
    await Coin.deleteMany({});

    // Save new data
    const mapped = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      last_updated: coin.last_updated,
    }));

    await Coin.insertMany(mapped);
    console.log("✅ Coins updated successfully");

    res.json({ message: "Data fetched and saved", count: mapped.length });
  } catch (error) {
    console.error("Error fetching coins:", error.message);
    res.status(500).json({ message: "Failed to fetch coins", error: error.message });
  }
};
