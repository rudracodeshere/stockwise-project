import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GlobalNews() {
  const [marketNews, setMarketNews] = useState([]);
  const [economyNews, setEconomyNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch two categories of news
        const [resMarket, resEco] = await Promise.all([
          axios.get(`https://stockwise-api-hxtg.onrender.com/api/stocks/SENSEX/news`),
          axios.get(`https://stockwise-api-hxtg.onrender.com/api/stocks/NIFTY/news`)
        ]);
        setMarketNews(resMarket.data.news || []);
        setEconomyNews(resEco.data.news || []);
      } catch (error) { console.error(error); }
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading News Terminal...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
        <h2 style={{ fontWeight: '300' }}>Market News Terminal 📰</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Live updates from Indian Financial Markets</p>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Combine both lists */}
        {[...marketNews, ...economyNews].map((item, index) => (
          <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{item.publisher}</span>
                <span style={{ 
                    padding: '2px 6px', borderRadius: '4px', 
                    background: item.score > 0 ? 'rgba(0,179,65,0.1)' : item.score < 0 ? 'rgba(255,59,48,0.1)' : 'transparent',
                    color: item.score > 0 ? 'var(--up)' : item.score < 0 ? 'var(--down)' : 'var(--text-muted)'
                }}>
                    {item.score > 0 ? 'Bullish' : item.score < 0 ? 'Bearish' : 'Neutral'} Signal
                </span>
            </div>
            
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '16px', fontWeight: '600', lineHeight: '1.4' }}>
              {item.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GlobalNews;