import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  name: { type: String },
  symbol: { type: String },
  image: { type: String },
  current_price: { type: Number },
  market_cap: { type: Number },
  price_change_percentage_24h: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

const History = mongoose.model("History", historySchema);
export default History;

