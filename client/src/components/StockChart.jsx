import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function StockChart({ ticker }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://stockwise-api-hxtg.onrender.com/api/stocks/${ticker}/history`);
        setChartData(response.data);
      } catch (error) {
        console.error('Error loading chart:', error);
      }
      setLoading(false);
    };

    if (ticker) {
      fetchHistory();
    }
  }, [ticker]);

  // FIX: Better Empty State (No more blank white box)
  if (!ticker) return (
    <div style={{ 
      height: '400px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: 'var(--text-muted)',
      textAlign: 'center',
      border: '2px dashed var(--border)',
      borderRadius: 'var(--radius)',
      background: 'var(--bg-input)'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📊</div>
      <h3 style={{ marginBottom: '0.5rem' }}>Market Analysis</h3>
      <p>Select a stock from your Watchlist to view live charts.</p>
    </div>
  );

  if (loading) return (
    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading Chart...
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>{ticker} - 30 Day Trend</h3>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Daily Interval</span>
      </div>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{fontSize: 12}} minTickGap={30} stroke="var(--text-muted)" />
            <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-main)' }}
            />
            <Line type="monotone" dataKey="price" stroke="var(--accent)" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StockChart;