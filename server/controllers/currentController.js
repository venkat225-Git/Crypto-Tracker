import Coin from "../models/currentModel.js";
import fetch from "node-fetch";

const fetchdata = async (req, res) => {
  try {
    const proxyUrl =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"


    const data = await fetch(proxyUrl);


    res.status(200).json(data);
  } catch (error) {
    console.error("Render fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch api" });
  }
};

export default fetchdata
