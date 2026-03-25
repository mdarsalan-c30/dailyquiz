import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, MousePointer2, TrendingUp, Plus, Trash2 } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:3000/api/admin';

const Monetization = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await axios.get(`${API_BASE}/offers`);
                setOffers(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    if (loading) return <div className="loading-view"><div className="spinner"></div></div>;

    return (
        <div style={{ padding: '0 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Monetization Hub</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage financial offers, CTR, and revenue streams.</p>
                </div>
            </div>

            <div className="card-grid">
                <div className="stat-box">
                    <div className="stat-label">TOTAL REVENUE (MTD)</div>
                    <div className="stat-val">₹0</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '12px' }}>
                        No active payment logs
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">OFFER CTR</div>
                    <div className="stat-val">0%</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '12px' }}>
                        Awaiting interaction data
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">CONVERSIONS</div>
                    <div className="stat-val">0</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '12px' }}>
                        Last 30 days
                    </div>
                </div>
            </div>

            <div className="table-box">
                <div className="table-head-strip">
                    <h3>Active Finance Offers</h3>
                    <button className="btn btn-primary" style={{ padding: '10px 20px' }}><Plus size={18} /> Add New Offer</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Offer Title</th>
                            <th>Category</th>
                            <th>Destination</th>
                            <th>Clicks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.length > 0 ? offers.map((o, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: '700' }}>{o.title}</td>
                                <td><span className="badge badge-success">{o.category}</span></td>
                                <td style={{ color: 'var(--accent)', fontSize: '13px' }}>{o.link.substring(0, 30)}...</td>
                                <td style={{ fontWeight: '700' }}>0</td>
                                <td>
                                    <button className="btn btn-outline" style={{ padding: '8px', color: '#EF4444' }}><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        )) : (
                           <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                                    No active offers in database.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Monetization;
