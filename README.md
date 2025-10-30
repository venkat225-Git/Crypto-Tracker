#  Crypto Tracker

A responsive web application that displays live cryptocurrency data including current price, market cap, and 24-hour price change percentage using the CoinGecko API.

---

##  Live Links
- **Frontend:** [https://crypto-tracker-dusky-theta.vercel.app/](https://crypto-tracker-dusky-theta.vercel.app/)
- **Backend:** [https://crypto-tracker-ngqq.onrender.com/api/coins](https://crypto-tracker-ngqq.onrender.com/api/coins)
- **GitHub:** [https://github.com/venkat225-Git](https://github.com/venkat225-Git)

---

##  Tech Stack
- **Frontend:** React.js, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **API Source:** CoinGecko API
- **Hosting:** Vercel (Frontend), Render (Backend)

---

## ⚙️ Features
✅ Fetches live cryptocurrency data using CoinGecko API  
✅ Search and filter functionality for coins  
✅ Responsive user interface  
✅ MongoDB integration  
✅ Backend API hosted on Render  
✅ Frontend deployed on Vercel  


## 🌐 API Used
- **CoinGecko API:** Provides live cryptocurrency data  

https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1



## 📁 Folder Structure

crypto-tracker/
│
├── client/ # React frontend
│ ├── src/
│ ├── public/
│ └── package.json
│
├── server/ # Node.js + Express backend
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ ├── utils/
│ └── server.js
│
├── .env
├── package.json
├── README.md
└── vite.config.js

## 🔄 How It Works

1. The backend (Node + Express) fetches cryptocurrency data from the CoinGecko API.
2. The data is stored and managed using MongoDB via Mongoose models.
3. The frontend (React) makes API requests to the backend.
4. The UI displays live data with search and filter options.
5. The entire project is deployed — backend on Render, frontend on Vercel.



---

##  Author
**Saka Venkata Sai**  
📧 [sakavenkatasai@gmail.com](mailto:sakavenkatasai@gmail.com)

---

## 📜 License
This project is created for educational and assignment purposes only.


---
