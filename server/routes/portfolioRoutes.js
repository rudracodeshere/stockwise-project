const express = require('express');
const router = express.Router();
const Holding = require('../models/Holding');
const yahooFinance = require('yahoo-finance2').default; // Use the working version

// @route   POST /api/portfolio/buy
// @desc    Buy a stock (Add to holdings)
router.post('/buy', async (req, res) => {
  try {
    const { ticker, quantity, price } = req.body;
    
    // Check if we already own this stock
    let holding = await Holding.findOne({ ticker });

    if (holding) {
      // If we own it, update average price and quantity
      const totalCost = (holding.quantity * holding.buyPrice) + (quantity * price);
      const totalQty = holding.quantity + quantity;
      holding.buyPrice = totalCost / totalQty; // New Average Price
      holding.quantity = totalQty;
      await holding.save();
    } else {
      // Create new holding
      holding = new Holding({ ticker, quantity, buyPrice: price });
      await holding.save();
    }
    res.status(201).json(holding);
  } catch (err) {
    res.status(500).json({ message: 'Error buying stock' });
  }
});

// @route   GET /api/portfolio
// @desc    Get portfolio with LIVE P&L calculation
router.get('/', async (req, res) => {
  try {
    const holdings = await Holding.find();
    
    // Fetch live prices for all holdings
    const portfolioWithData = await Promise.all(holdings.map(async (item) => {
      try {
        const quote = await yahooFinance.quote(item.ticker + '.NS');
        const currentPrice = quote.regularMarketPrice;
        const currentValue = currentPrice * item.quantity;
        const investedValue = item.buyPrice * item.quantity;
        const profitLoss = currentValue - investedValue;

        return {
          _id: item._id,
          ticker: item.ticker,
          quantity: item.quantity,
          buyPrice: item.buyPrice,
          currentPrice: currentPrice,
          currentValue: currentValue,
          profitLoss: profitLoss,
          percentChange: ((currentPrice - item.buyPrice) / item.buyPrice) * 100
        };
      } catch (error) {
        return { ...item._doc, currentPrice: 0, profitLoss: 0 };
      }
    }));

    res.json(portfolioWithData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
});
// @route   DELETE /api/portfolio/:id
// @desc    Remove a holding from portfolio
router.delete('/:id', async (req, res) => {
  try {
    await Holding.findByIdAndDelete(req.params.id);
    res.json({ message: 'Holding removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});
module.exports = router;