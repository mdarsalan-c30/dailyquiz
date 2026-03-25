import React, { useState } from 'react';
import { Layout, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'mdarsalan@gmail.com' && password === '123@Arsalan') {
      localStorage.setItem('adminAuth', 'true');
      onLogin(true);
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#F8FAFC' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '48px', 
        background: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--accent-light)', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Layout size={32} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>Core Control</h1>
          <p style={{ color: '#64748B', marginTop: '8px' }}>Secure access for DailyQ Administrators.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94A3B8' }} />
              <input 
                type="email" 
                placeholder="admin@dailyq.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 14px 14px 48px', 
                  borderRadius: '12px', 
                  border: '1px solid #E2E8F0', 
                  outline: 'none',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94A3B8' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 14px 14px 48px', 
                  borderRadius: '12px', 
                  border: '1px solid #E2E8F0', 
                  outline: 'none',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          {error && <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: '600', textAlign: 'center' }}>{error}</p>}

          <button className="btn btn-primary" style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: '16px', marginTop: '12px' }}>
            Enter Workspace <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
