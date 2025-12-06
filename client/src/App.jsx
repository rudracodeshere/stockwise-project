import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Watchlist from './components/Watchlist';
import StockChart from './components/StockChart';
import StockNews from './components/StockNews';
import StockFundamentals from './components/StockFundamentals';
import Portfolio from './components/Portfolio';
import MarketOverview from './components/MarketOverview';
import GlobalNews from './components/GlobalNews';    
import MarketScanner from './components/MarketScanner'; 
import AIForecast from './components/AIForecast'; 
import Auth from './components/Auth'; // New Import

// --- SVG ICONS ---
const IconChart = () => <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IconNews = () => <svg viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>;
const IconBrain = () => <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2a8 8 0 0 0-8 8c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-8 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>;
const IconScanner = () => <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const IconMoon = () => <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconBack = () => <svg viewBox="0 0 24 24" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const IconLogOut = () => <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [marketStatus, setMarketStatus] = useState([]);

  // Check Login Status on Mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  // Theme Logic
  useEffect(() => {
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  // Load Market Data
  useEffect(() => {
    if (!isAuthenticated) return; // Don't fetch if not logged in
    const loadMarket = async () => { try { const res = await axios.get('http://localhost:5000/api/stocks/market/status'); setMarketStatus(res.data); } catch(e) {} };
    loadMarket();
    const interval = setInterval(loadMarket, 30000); 
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleStockSelect = (ticker) => {
    setSelectedTicker(ticker);
    setActiveTab('DASHBOARD');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setSelectedTicker(null);
    setActiveTab('DASHBOARD');
  };

  // --- RENDER AUTH SCREEN IF NOT LOGGED IN ---
  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  // --- RENDER MAIN APP IF LOGGED IN ---
  return (
    <div className="app-layout">
      {/* 1. NAV SIDEBAR */}
      <div className="nav-sidebar">
        
        {/* CENTERED GROUP */}
        <div className="nav-menu-group">
            <div className={`nav-item ${activeTab === 'DASHBOARD' ? 'active' : ''}`} onClick={() => setActiveTab('DASHBOARD')} title="Terminal">
              <IconChart />
            </div>
            
            <div className={`nav-item ${activeTab === 'AI' ? 'active' : ''}`} onClick={() => setActiveTab('AI')} title="AI Forecast">
              <IconBrain />
            </div>

            <div className={`nav-item ${activeTab === 'SCANNER' ? 'active' : ''}`} onClick={() => setActiveTab('SCANNER')} title="Market Scanner">
              <IconScanner />
            </div>
            
            <div className={`nav-item ${activeTab === 'NEWS' ? 'active' : ''}`} onClick={() => setActiveTab('NEWS')} title="News Feed">
              <IconNews />
            </div>
            
            <div className={`nav-item ${activeTab === 'PORTFOLIO' ? 'active' : ''}`} onClick={() => setActiveTab('PORTFOLIO')} title="My Portfolio">
              <IconBriefcase />
            </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="nav-bottom-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="nav-item" onClick={() => setDarkMode(!darkMode)} title="Theme Toggle">
                <IconMoon />
            </div>
            <div className="nav-item" onClick={handleLogout} title="Sign Out" style={{ color: 'var(--down)' }}>
                <IconLogOut />
            </div>
        </div>
      </div>

      {/* 2. WATCHLIST PANEL */}
      <div className="side-panel">
        <div className="panel-header"><span>WATCHLIST</span><span style={{fontSize:'10px', color:'var(--text-muted)'}}>NSE/BSE</span></div>
        <Watchlist onSelectStock={handleStockSelect} />
      </div>

      {/* 3. MAIN STAGE */}
      <div className="main-stage">
        <div className="top-ticker-bar">
            {marketStatus.map(idx => (
                <div key={idx.symbol} style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                    <span style={{ fontWeight: 'bold' }}>{idx.name}</span>
                    <span className={idx.percentChange >= 0 ? 'text-up' : 'text-down'}>{idx.price.toLocaleString('en-IN')} ({idx.percentChange > 0 ? '+' : ''}{idx.percentChange.toFixed(2)}%)</span>
                </div>
            ))}
        </div>

        <div className="content-area">
            {activeTab === 'DASHBOARD' && (
                <>
                    {!selectedTicker ? (
                        <MarketOverview onSelectStock={handleStockSelect} />
                    ) : (
                        <>
                            <button className="back-btn" onClick={() => setSelectedTicker(null)}>
                                <IconBack /> Back to Market Overview
                            </button>
                            <StockChart ticker={selectedTicker} />
                            <StockFundamentals ticker={selectedTicker} /> 
                            <StockNews ticker={selectedTicker} />
                        </>
                    )}
                </>
            )}

            {activeTab === 'AI' && <AIForecast />}
            {activeTab === 'SCANNER' && <MarketScanner />}
            {activeTab === 'NEWS' && <GlobalNews />}
            {activeTab === 'PORTFOLIO' && <Portfolio />}
        </div>
      </div>
    </div>
  );
}
export default App;