import Coin from "../models/currentModel.js"
import fetch from "node-fetch"


const fetchdata = async (req,res)=>{
    try {
        const data = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1") 
        const outcome = await data.json()
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
        res.status(200).json(filteredData)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
}
export default fetchdata 