import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Brain, 
  IndianRupee, 
  Activity,
  ArrowUp,
  ArrowDown,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const API_BASE = 'http://127.0.0.1:3000/api/admin';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_BASE}/stats`);
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Stats fetch error:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="loading-view">
            <div className="spinner"></div>
            <p>Syncing ecosystem data...</p>
        </div>
    );

    if (error) return (
        <div className="loader-overlay">
            <Zap size={48} color="var(--accent)" />
            <h2 style={{ marginTop: '20px' }}>Sync Failed</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error}</p>
            <p style={{ fontSize: '12px', color: '#EF4444' }}>Terminal mein dekhein: "npm run dev" backend mein chal raha hai?</p>
            <button onClick={() => window.location.reload()} className="nav-btn active" style={{ border: 'none', cursor: 'pointer', marginTop: '16px' }}>
                Retry Sync
            </button>
        </div>
    );

    const chartData = data?.history || [];

    return (
        <div style={{ width: '100%', padding: '0 8px' }}>
            <div className="card-grid">
                <div className="stat-box">
                    <div className="stat-label">Daily Active Users</div>
                    <div className="stat-val">{data?.stats?.activeToday || 0}</div>
                    <div style={{ color: (data?.stats?.activeToday > 0) ? '#22C55E' : '#94A3B8', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
                        {data?.stats?.activeToday > 0 ? <><ArrowUp size={14} /> Trending Up</> : 'No activity yet'}
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Total Questions</div>
                    <div className="stat-val">{data?.stats?.totalQuestions || 0}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '12px' }}>
                        Active in Quiz Bank
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Total Points Awarded</div>
                    <div className="stat-val">{data?.stats?.totalPoints || 0}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '12px' }}>
                        Across all users
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Est. Revenue (Today)</div>
                    <div className="stat-val">₹0</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '12px' }}>
                        Syncing with Payment Gateway...
                    </div>
                </div>
            </div>

            <div className="table-box" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                   <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Engagement & Revenue</h3>
                   <select style={{ padding: '8px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '12px' }}>
                       <option>Last 7 days</option>
                       <option>Last 30 days</option>
                   </select>
                </div>
                <div style={{ width: '100%', height: '320px' }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} 
                            />
                            <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#glow)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="table-box">
                <div className="table-head-strip">
                    <h3>Recent User Activity</h3>
                    <button className="btn btn-outline">View All</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Question</th>
                            <th>Status</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.recentActivity?.map((act, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: '600' }}>{act.name}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{act.question.substring(0, 45)}...</td>
                                <td>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '6px', 
                                        fontSize: '11px', 
                                        fontWeight: '800',
                                        background: act.is_correct ? '#DCFCE7' : '#FEE2E2',
                                        color: act.is_correct ? '#166534' : '#991B1B'
                                    }}>
                                        {act.is_correct ? 'CORRECT' : 'INCORRECT'}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)' }}>{new Date(act.answered_at).toLocaleTimeString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
