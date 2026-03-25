import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, FileText, Info, ShieldCheck, HelpCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:3000/api/admin';

const ContentSettings = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeKey, setActiveKey] = useState('privacy-policy');
    const [editData, setEditData] = useState({ title: '', content: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await axios.get(`${API_BASE}/content`);
            setContents(res.data);
            const active = res.data.find(c => c.key === activeKey);
            if (active) setEditData({ title: active.title, content: active.content });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSwitch = (key) => {
        setActiveKey(key);
        const active = contents.find(c => c.key === key);
        if (active) setEditData({ title: active.title, content: active.content });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`${API_BASE}/content`, { 
                key: activeKey, 
                title: editData.title, 
                content: editData.content 
            });
            alert('Content updated successfully! Changes are live in the app.');
            fetchContent();
        } catch (err) {
            alert('Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-view"><div className="spinner"></div></div>;

    const iconMap = {
        'privacy-policy': <ShieldCheck size={20} />,
        'terms-conditions': <FileText size={20} />,
        'help-support': <HelpCircle size={20} />
    };

    return (
        <div style={{ padding: '0 8px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>App Documentation (CMS)</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Real-time updates for Privacy Policy, Terms, and Help pages within the mobile app.</p>
            </div>

            <div style={{ display: 'flex', gap: '32px' }}>
                {/* Navigation Sidebar */}
                <div style={{ width: '280px' }}>
                    {contents.map(item => (
                        <div 
                            key={item.key}
                            onClick={() => handleSwitch(item.key)}
                            style={{ 
                                padding: '16px 20px',
                                borderRadius: '12px',
                                marginBottom: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontWeight: '600',
                                fontSize: '14px',
                                background: activeKey === item.key ? 'var(--accent)' : 'transparent',
                                color: activeKey === item.key ? '#fff' : 'var(--text-main)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {iconMap[item.key] || <Info size={20} />}
                            {item.title}
                        </div>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="table-box" style={{ flex: 1, margin: 0, padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Editing: {editData.title}</h3>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleSave} 
                            disabled={saving}
                            style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Save size={18} /> {saving ? 'Saving...' : 'Publish Changes'}
                        </button>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)' }}>Page Title</label>
                        <input 
                            type="text" 
                            value={editData.title}
                            onChange={(e) => setEditData({...editData, title: e.target.value})}
                            style={{ 
                                width: '100%', 
                                padding: '12px 16px', 
                                borderRadius: '10px', 
                                border: '1px solid #E2E8F0',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)' }}>Content (Standard Text)</label>
                        <textarea 
                            value={editData.content}
                            onChange={(e) => setEditData({...editData, content: e.target.value})}
                            style={{ 
                                width: '100%', 
                                height: '400px', 
                                padding: '20px', 
                                borderRadius: '12px', 
                                border: '1px solid #E2E8F0',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                resize: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentSettings;
