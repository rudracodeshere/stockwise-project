import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GeneralNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch news for a general term like 'SENSEX' to get market news
        const response = await axios.get(`http://localhost:5000/api/stocks/SENSEX/news`);
        if (response.data && response.data.news) {
            setNews(response.data.news);
        }
      } catch (error) {
        console.error('Error loading news:', error);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) return <div>Loading Market Headlines...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '20px' }}>Top Market Headlines 📢</h3>
      {news.map((item, index) => (
        <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '600' }}>
              {item.title}
            </a>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                <span>{item.publisher}</span>
                <span style={{ color: item.score > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {item.score > 0 ? 'Bullish' : (item.score < 0 ? 'Bearish' : 'Neutral')} Signal
                </span>
            </div>
        </div>
      ))}
    </div>
  );
}

export default GeneralNews;