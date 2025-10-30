import History from "../models/historyModel.js";
import fetch from "node-fetch";
import cron from "node-cron"

const fetchhistory = async () =>{
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1") 
        const data = await response.json()
   
        console.log(" Data inserted successfully!");

        const formattedData = data.map((coin) => ({
          name: coin.name,
          symbol: coin.symbol,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          last_updated: new Date(),
        }));
    await History.insertMany(formattedData);              
    } catch (error) {
        console.error(" Error inserting data:", error.message);
        

    }
}

cron.schedule("0 * * * *", fetchhistory);
export default fetchhistory 