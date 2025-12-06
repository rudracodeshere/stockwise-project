import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StockNews({ ticker }) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ticker) {
      setNews(null); // CRITICAL: Clear old news immediately
      setLoading(true);
      
      axios.get(`https://stockwise-api-hxtg.onrender.com/api/stocks/${ticker}/news`)
        .then(res => {
            setNews(res.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error loading news:', error);
            setLoading(false);
        });
    }
  }, [ticker]);

  if (!ticker) return null; // Or return placeholder if you prefer

  if (loading) return (
    <div className="card" style={{ marginTop: '20px', padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Fetching latest news for {ticker}...
    </div>
  );

  if (!news || !news.news || news.news.length === 0) return (
    <div className="card" style={{ marginTop: '20px', padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No specific news found for {ticker}.
    </div>
  );

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
        <h3>Latest News: {ticker.replace('.NS','')}</h3>
        <span style={{ 
          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
          background: news.verdict === 'BULLISH' ? 'rgba(0, 179, 65, 0.1)' : news.verdict === 'BEARISH' ? 'rgba(255, 59, 48, 0.1)' : 'var(--bg-app)',
          color: news.verdict === 'BULLISH' ? 'var(--up)' : news.verdict === 'BEARISH' ? 'var(--down)' : 'var(--text-muted)'
        }}>
          {news.verdict} SENTIMENT
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {news.news.map((n, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>{n.publisher}</span>
              <span style={{ color: n.score > 0 ? 'var(--up)' : n.score < 0 ? 'var(--down)' : 'inherit' }}>
                Score: {n.score}
              </span>
            </div>
            <a href={n.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500', fontSize: '14px', lineHeight: '1.4' }}>
                {n.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockNews;