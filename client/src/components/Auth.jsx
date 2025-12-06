import React, { useState } from 'react';
import axios from 'axios';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, {
        username,
        password
      });

      if (isLogin) {
        // Save token and notify App
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        onLogin();
      } else {
        // Switch to login after register
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg-app)' 
    }}>
      <div className="card" style={{ width: '400px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '50px', height: '50px', background: 'var(--accent)', borderRadius: '12px', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>S</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>StockWise</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Professional Trading Terminal</p>
        </div>

        {/* Error Message */}
        {error && <div style={{ background: 'rgba(255, 59, 48, 0.1)', color: 'var(--down)', padding: '10px', borderRadius: '4px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>USERNAME</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{ 
            background: 'var(--accent)', color: 'white', padding: '12px', 
            borderRadius: '6px', border: 'none', fontWeight: 'bold', 
            cursor: 'pointer', fontSize: '14px', transition: '0.2s',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'PROCESSING...' : (isLogin ? 'LOG IN' : 'CREATE ACCOUNT')}
          </button>
        </form>

        {/* Toggle */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          {isLogin ? "New to StockWise? " : "Already have an account? "}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            style={{ color: 'var(--accent)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isLogin ? 'Register' : 'Log In'}
          </span>
        </div>

      </div>
    </div>
  );
}

export default Auth;