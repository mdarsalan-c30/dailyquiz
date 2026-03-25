import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, 
    User, 
    Zap, 
    Target, 
    History,
    Calendar,
    Mail,
    Award
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:3000/api/admin';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`${API_BASE}/users/${id}/details`);
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="loading-view"><div className="spinner"></div></div>;
    if (!data) return <div className="error-view">User not found</div>;

    const { profile, stats, history } = data;

    return (
        <div style={{ padding: '0 8px' }}>
            <div style={{ marginBottom: '32px' }}>
                <button 
                    onClick={() => navigate('/users')}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--text-muted)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        padding: '0'
                    }}
                >
                    <ArrowLeft size={18} /> Back to Ecosystem
                </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                {/* Profile Header Card */}
                <div className="table-box" style={{ flex: 1, margin: 0, padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '24px', 
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', 
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        fontWeight: '800'
                    }}>
                        {profile.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '850', marginBottom: '4px' }}>{profile.name || 'Anonymous'}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14}/> {profile.email}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                    <div className="stat-box" style={{ flex: 1, margin: 0 }}>
                        <div className="stat-label">Total Points</div>
                        <div className="stat-val" style={{ color: 'var(--accent)' }}>{profile.points || 0}</div>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#22C55E', fontWeight: 'bold' }}>
                            <Award size={14} style={{ verticalAlign: 'middle' }} /> Global Rank: #12
                        </div>
                    </div>
                    <div className="stat-box" style={{ flex: 1, margin: 0 }}>
                        <div className="stat-label">Current Streak</div>
                        <div className="stat-val" style={{ color: '#F97316' }}>🔥 {profile.streak || 0}</div>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                            Personal Best: {profile.streak || 0}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-box">
                    <div className="stat-label">Accuracy Rate</div>
                    <div className="stat-val">{stats.accuracy}%</div>
                    <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${stats.accuracy}%`, background: 'var(--accent)' }}></div>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Quizzes Played</div>
                    <div className="stat-val">{stats.totalQuizzes}</div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Correct Answers</div>
                    <div className="stat-val">{stats.correct}</div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Reward Status</div>
                    <div className="stat-val" style={{ fontSize: '18px', color: '#22C55E' }}>ELITE</div>
                </div>
            </div>

            <div className="table-box">
                <div className="table-head-strip">
                    <h3>Recent Quiz Performance</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing last 50 attempts</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Question Preview</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Points</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length > 0 ? history.map((item, i) => (
                            <tr key={i}>
                                <td style={{ maxWidth: '400px', fontWeight: '500' }}>{item.question.substring(0, 80)}...</td>
                                <td>
                                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', background: '#F1F5F9', color: '#475569' }}>
                                        {item.category.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '6px', 
                                        fontSize: '11px', 
                                        fontWeight: '800',
                                        background: item.is_correct ? '#DCFCE7' : '#FEE2E2',
                                        color: item.is_correct ? '#166534' : '#991B1B'
                                    }}>
                                        {item.is_correct ? 'CORRECT' : 'INCORRECT'}
                                    </span>
                                </td>
                                <td style={{ fontWeight: '700' }}>{item.is_correct ? '+10' : '0'}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                    {new Date(item.answered_at).toLocaleString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                                    No activity records found for this user.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserDetail;
