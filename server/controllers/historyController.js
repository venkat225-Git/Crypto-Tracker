import History from "../models/historyModel.js";
import fetch from "node-fetch";
import cron from "node-cron"

const fetchhistory = async () =>{
    try {
        const data = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1") 
        const outcome = await data.json()
        //await History.insertMany(outcome); 
        console.log(" Data inserted successfully!");
        
        

                
    } catch (error) {
        console.error(" Error inserting data:", error.message);
        

    }
}


cron.schedule("0 * * * *", fetchhistory);

export default fetchhistory 