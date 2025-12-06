const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const stockRoutes = require('./routes/stockRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const authRoutes = require('./routes/authRoutes'); // NEW IMPORT

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/auth', authRoutes); 

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});