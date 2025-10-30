import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import cors from 'cors'
import currentroute from './routes/currentRoute.js'
import historyroute from './routes/historyRoute.js'



dotenv.config();
const app = express();

connectDB()

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST"]
}));
app.use(express.json())


app.use('/api',currentroute)
app.use("/api",historyroute)

app.get("/",(req,res)=>{
    console.log("router is getting")
    res.send("route is workin")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});