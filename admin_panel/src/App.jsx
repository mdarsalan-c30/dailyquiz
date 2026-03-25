import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Brain, 
  Users, 
  IndianRupee, 
  Bell, 
  Search,
  LogOut,
  Flame,
  Layout,
  BarChart4,
  FileText
} from 'lucide-react';
import './App.css';

import Dashboard from './pages/Dashboard';
import QuizManager from './pages/QuizManager';
import UserManager from './pages/UserManager';
import UserDetail from './pages/UserDetail';
import ContentSettings from './pages/ContentSettings';
import Monetization from './pages/Monetization';
import Notifications from './pages/Notifications';
import Login from './pages/Login';

const Placeholder = ({ title }) => (
  <div className="loading-view">
    <div style={{ fontSize: '48px' }}>📊</div>
    <h2 style={{ marginTop: '20px' }}>{title} Analytics</h2>
    <p style={{ color: 'var(--text-muted)' }}>Data modeling in progress. Stay tuned!</p>
  </div>
);

const Sidebar = ({ onLogout }) => (
  <aside className="sidebar">
    <div className="sidebar-logo">
      <Layout color="var(--accent)" />
      <span>QWIZO - Insurance Hub</span>
    </div>
    
    <nav className="sidebar-nav">
      <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <LayoutDashboard /> Dashboard
      </NavLink>
      <NavLink to="/quizzes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <Brain /> Quiz Manager
      </NavLink>
      <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <Users /> Users
      </NavLink>
      <NavLink to="/streaks" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <Flame /> Streak
      </NavLink>
      <NavLink to="/monetization" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <IndianRupee /> Monetization
      </NavLink>
      <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <BarChart4 /> Analytics
      </NavLink>
      <NavLink to="/notifications" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <Bell /> Notifications
      </NavLink>
      <NavLink to="/cms" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <FileText /> App Content
      </NavLink>
    </nav>
    
    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
      <button onClick={onLogout} className="btn btn-outline" style={{ width: '100%' }}>
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  </aside>
);

const Topbar = () => {
  const [isOnline, setIsOnline] = useState(false);
  
  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        await fetch('http://127.0.0.1:3000/api/test');
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar">
      <div className="search-bar">
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Global search..." />
      </div>
      
      <div className="admin-profile" style={{ gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', padding: '4px 10px', background: isOnline ? '#DCFCE7' : '#FEE2E2', color: isOnline ? '#166534' : '#991B1B', borderRadius: '20px' }}>
          <div style={{ width: '6px', height: '6px', background: isOnline ? '#22C55E' : '#EF4444', borderRadius: '50%' }}></div>
          {isOnline ? 'NETWORK ONLINE' : 'NETWORK OFFLINE'}
        </div>
        <div style={{ position: 'relative' }}>
          <Bell size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></div>
        </div>
        <div className="profile-img">A</div>
      </div>
    </header>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('adminAuth') === 'true'
  );

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) return <Login onLogin={setIsAuthenticated} />;

  return (
    <Router>
      <div className="admin-layout" style={{ width: '100vw', maxWidth: '100%' }}>
        <Sidebar onLogout={handleLogout} />
        <main className="workspace" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-app)' }}>
          <Topbar />
          <div className="page-body" style={{ width: '100%' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/quizzes" element={<QuizManager />} />
              <Route path="/users" element={<UserManager />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/streaks" element={<Placeholder title="Streak" />} />
              <Route path="/monetization" element={<Monetization />} />
              <Route path="/cms" element={<ContentSettings />} />
              <Route path="/analytics" element={<Placeholder title="Detailed" />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
