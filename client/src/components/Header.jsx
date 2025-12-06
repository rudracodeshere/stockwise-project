import React from 'react';

function Header({ isDarkMode, toggleTheme, activeTab, setActiveTab }) {
  const navStyle = {
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100, padding: 0
  };

  const containerStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', height: '70px'
  };

  const getLinkStyle = (tabName) => ({
    color: activeTab === tabName ? 'var(--accent)' : 'var(--text-muted)',
    background: activeTab === tabName ? 'rgba(37,99,235,0.1)' : 'transparent',
    textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer',
    padding: '8px 16px', borderRadius: '8px', transition: '0.2s'
  });

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>S</div>
          <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)' }}>StockWise</span>
        </div>

        <div style={{ display: 'flex', gap: '5px' }}>
          <span style={getLinkStyle('dashboard')} onClick={() => setActiveTab('dashboard')}>Dashboard</span>
          <span style={getLinkStyle('market')} onClick={() => setActiveTab('market')}>Market</span>
          <span style={getLinkStyle('portfolio')} onClick={() => setActiveTab('portfolio')}>Portfolio</span>
          <span style={getLinkStyle('news')} onClick={() => setActiveTab('news')}>News</span>
          <span style={getLinkStyle('tools')} onClick={() => setActiveTab('tools')}>Tools</span>
        </div>

        <button onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '8px 12px', fontSize: '1.2rem', borderRadius: '8px' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default Header;