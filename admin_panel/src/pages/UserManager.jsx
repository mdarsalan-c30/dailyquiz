import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, UserMinus, UserCheck, ShieldOff } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:3000/api/admin';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const url = `${API_BASE}/users`;
            console.log('Fetching users from:', url);
            try {
                const res = await axios.get(url);
                console.log('Users received:', res.data);
                setUsers(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Users sync error:', err);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="loading-view"><div className="spinner"></div></div>;

    return (
        <div style={{ padding: '0 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800' }}>User Ecosystem</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Monitor profiles, streaks, and engagement metrics.</p>
                </div>
            </div>
            {/* ... rest of the component ... */}
            <div className="table-box">
                <div className="table-head-strip">
                    <div className="search-bar" style={{ width: '350px' }}>
                        <Search size={18} color="var(--text-muted)" />
                        <input type="text" placeholder="Search by name or email..." />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>User Profile</th>
                            <th>Points</th>
                            <th>Streak</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? users.map((u, i) => (
                            <tr key={i}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#F1F5F9', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px' }}>
                                            {u.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <Link to={`/users/${u.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <div style={{ fontWeight: '700', cursor: 'pointer' }} className="user-name-link">{u.name || 'Anonymous User'}</div>
                                            </Link>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email || 'no-email'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ fontWeight: '800', color: 'var(--accent)' }}>{u.points || 0}</td>
                                <td>
                                   <span style={{ fontWeight: '700', color: '#F97316', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                       🔥 {u.streak || 0}
                                   </span>
                                </td>
                                <td>
                                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', background: '#DCFCE7', color: '#166534' }}>ACTIVE</span>
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Unknown'}
                                </td>
                                <td>
                                    <button className="btn btn-outline" style={{ padding: '8px', color: '#EF4444' }}><ShieldOff size={16} /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                                    No users found in database. Verify backend connection.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;
