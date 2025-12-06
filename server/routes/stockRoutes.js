const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const yahooFinance = require('yahoo-finance2').default;

// 1. WATCHLIST ROUTE (FIXED & LOGGING ADDED)
router.get('/', async (req, res) => {
  try {
    const savedStocks = await Stock.find();
    
    // We use Promise.all to fetch data for all stocks
    const stocksWithData = await Promise.all(savedStocks.map(async (stock) => {
      let symbol = stock.ticker.trim().toUpperCase(); // Clean whitespace
      
      // Ensure .NS extension for NSE stocks if missing
      if (!symbol.includes('.') && !symbol.includes('^')) {
        symbol = symbol + '.NS';
      }

      try {
        // Log what we are trying to fetch (Check your terminal for this!)
        // console.log(`Fetching: ${symbol}`); 
        
        const quote = await yahooFinance.quote(symbol);
        
        if (!quote) throw new Error("Empty quote");

        return {
          _id: stock._id,
          ticker: stock.ticker, // Display the original name
          price: quote.regularMarketPrice || quote.postMarketPrice || 0,
          changePercent: quote.regularMarketChangePercent || 0,
          companyName: quote.longName || quote.shortName || 'N/A'
        };
      } catch (error) {
        console.error(`❌ Failed to fetch ${symbol}:`, error.message);
        return {
          _id: stock._id,
          ticker: stock.ticker,
          price: 0,
          changePercent: 0,
          companyName: 'Data Unavailable'
        };
      }
    }));

    res.json(stocksWithData);
  } catch (err) {
    console.error("Watchlist Error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. ADD STOCK ROUTE
router.post('/', async (req, res) => {
  try {
    const rawTicker = req.body.ticker.trim().toUpperCase();
    const exists = await Stock.findOne({ ticker: rawTicker });
    if (exists) return res.status(400).json({ message: 'Stock already in watchlist' });
    
    const newStock = new Stock({ ticker: rawTicker });
    await newStock.save();
    res.status(201).json(newStock);
  } catch (err) { res.status(500).json({ message: 'Error adding stock' }); }
});

// 3. REMOVE STOCK ROUTE
router.delete('/:id', async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed' });
  } catch (err) { res.status(500).json({ message: 'Error deleting' }); }
});

// 4. MARKET STATUS ROUTE
router.get('/market/status', async (req, res) => {
  try {
    const results = await Promise.all(['^NSEI', '^BSESN'].map(async sym => { 
        try{ return await yahooFinance.quote(sym); }catch{ return null; } 
    }));
    const valid = results.filter(q=>q);
    res.json(valid.map(q => ({ 
        symbol: q.symbol, 
        name: q.symbol === '^NSEI' ? 'NIFTY 50' : 'SENSEX', 
        price: q.regularMarketPrice, 
        change: q.regularMarketChange, 
        percentChange: q.regularMarketChangePercent 
    })));
  } catch (err) { res.status(500).json({ message: 'Error' }); }
});

// 5. SEARCH ROUTE
router.get('/search/:query', async (req, res) => {
  try {
    const result = await yahooFinance.search(req.params.query, { region: 'IN', lang: 'en' });
    const indianStocks = result.quotes.filter(q => q.symbol && (q.symbol.endsWith('.NS') || q.symbol.endsWith('.BO')));
    res.json(indianStocks);
  } catch (err) { res.status(500).json({ message: 'Error' }); }
});

// 6. CHART ROUTE
router.get('/:symbol/history', async (req, res) => {
  try {
    let symbol = req.params.symbol.trim().toUpperCase();
    if (!symbol.includes('.')) symbol += '.NS';
    
    const past = new Date(); past.setDate(new Date().getDate() - 100);
    const result = await yahooFinance.chart(symbol, { period1: past.toISOString().split('T')[0], interval: '1d' });
    res.json(result.quotes.map(item => ({ date: item.date.toISOString().split('T')[0], price: item.close })));
  } catch (err) { res.status(500).json({ message: 'Chart Error' }); }
});

// 7. NEWS ROUTE
router.get('/:symbol/news', async (req, res) => {
  try {
    const cleanSymbol = req.params.symbol.replace('.NS', '').replace('.BO', '');
    const result = await yahooFinance.search(cleanSymbol, { newsCount: 5 });
    
    if (!result.news) return res.json({ verdict: 'NEUTRAL', score: 0, news: [] });

    let totalScore = 0;
    const analyzedNews = result.news.map(article => {
      const analysis = sentiment.analyze(article.title);
      totalScore += analysis.score;
      return { title: article.title, link: article.link, publisher: article.publisher, score: analysis.score };
    });

    res.json({ 
        verdict: totalScore > 1 ? 'BULLISH' : totalScore < -1 ? 'BEARISH' : 'NEUTRAL', 
        totalScore, 
        news: analyzedNews 
    });
  } catch (err) { res.status(500).json({ message: 'News Error' }); }
});

// 8. MOVERS ROUTE
router.get('/market/movers', async (req, res) => {
    try {
        const popularTickers = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'TATAMOTORS.NS', 'SBIN.NS', 'ZOMATO.NS', 'WIPRO.NS', 'ITC.NS'];
        const quotes = await Promise.all(popularTickers.map(async sym => { 
            try { return await yahooFinance.quote(sym); } catch { return null; } 
        }));
        const valid = quotes.filter(q => q && q.regularMarketChangePercent !== undefined);
        const sorted = valid.sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent);
        res.json({ gainers: sorted.slice(0, 5), losers: sorted.slice(Math.max(sorted.length - 5, 0)).reverse() });
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

// 9. FUNDAMENTALS ROUTE
router.get('/:symbol/fundamentals', async (req, res) => {
    try {
      let symbol = req.params.symbol.trim().toUpperCase();
      if (!symbol.includes('.')) symbol += '.NS';
      
      const quote = await yahooFinance.quote(symbol);
      res.json({ 
          marketCap: quote.marketCap, 
          peRatio: quote.trailingPE, 
          high52: quote.fiftyTwoWeekHigh, 
          low52: quote.fiftyTwoWeekLow, 
          volume: quote.regularMarketVolume, 
          eps: quote.epsTrailingTwelveMonths, 
          bookValue: quote.bookValue 
      });
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

// 10. AI FORECAST ROUTE
router.get('/:symbol/forecast', async (req, res) => {
    try {
      let symbol = req.params.symbol.trim().toUpperCase();
      let searchSymbol = symbol;
      if (!symbol.includes('.')) symbol += '.NS';
      
      const today = new Date();
      const past = new Date(); past.setDate(today.getDate() - 200); 
      
      const [chartRes, newsRes] = await Promise.all([
          yahooFinance.chart(symbol, { period1: past.toISOString().split('T')[0], interval: '1d' }),
          yahooFinance.search(searchSymbol.replace('.NS',''), { newsCount: 5 })
      ]);
  
      const closes = chartRes.quotes.map(q => q.close).filter(c => c);
      const currentPrice = closes[closes.length - 1];
  
      // RSI Calc
      let gains = 0, losses = 0;
      for (let i = 1; i <= 14; i++) {
        const diff = closes[closes.length - i] - closes[closes.length - i - 1];
        if (diff >= 0) gains += diff; else losses -= diff;
      }
      const rsi = 100 - (100 / (1 + (gains/14)/(losses/14)));
      
      const sma50 = closes.slice(-50).reduce((a,b) => a + b, 0) / 50;
      const sma200 = closes.slice(-200).reduce((a,b) => a + b, 0) / 200;
  
      let score = 0;
      if (rsi < 30) score += 2; else if (rsi > 70) score -= 2; 
      if (currentPrice > sma50) score += 1; else score -= 1;   
      
      let sentimentScore = 0;
      if (newsRes.news) {
          newsRes.news.forEach(article => { sentimentScore += sentiment.analyze(article.title).score; });
      }
  
      const totalScore = score + (sentimentScore * 0.5);
      let signal = 'NEUTRAL';
      let color = 'var(--text-muted)';
      if (totalScore >= 2) { signal = 'STRONG BUY'; color = 'var(--up)'; }
      else if (totalScore <= -2) { signal = 'STRONG SELL'; color = 'var(--down)'; }
  
      res.json({
        symbol, currentPrice, signal, color, totalScore,
        details: { rsi: rsi.toFixed(2), sma50: sma50.toFixed(2), sma200: sma200.toFixed(2), newsSentiment: sentimentScore, techScore: score }
      });
    } catch (err) { res.status(500).json({ message: 'AI Failed' }); }
  });

module.exports = router;