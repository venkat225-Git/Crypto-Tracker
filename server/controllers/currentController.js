import fetch from "node-fetch";
import Coin from "../models/currentModel.js";

export const fetchdata = async (req, res) => {
  try {
    
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
    );
    const data = await response.json();

    
    await Coin.deleteMany({});

    
    await Coin.insertMany(
      data.map((coin) => ({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.current_price,
        marketCap: coin.market_cap,
        change24h: coin.price_change_percentage_24h,
        lastUpdated: coin.last_updated,
      }))
    );

    
    const coins = await Coin.find();
    res.json(coins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch coins" });
  }
};

export default fetchdata