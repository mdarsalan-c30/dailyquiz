import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash, Wand2 } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:3000/api/admin';

const QuizManager = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:3000/api/quiz/random?count=20');
            setQuizzes(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleBulkSeed = async () => {
        if (!window.confirm('AI will generate 10 new finance questions. Connect?')) return;
        setIsSeeding(true);
        try {
            await axios.get('http://127.0.0.1:3000/api/quiz/seed-bulk?count=10&secret=DAILYQ_BULK_SEED_2026');
            alert('AI Generation Successful!');
            fetchQuizzes();
        } catch (err) {
            alert('Seeding failed. Verify GEMINI_API_KEY.');
        } finally {
            setIsSeeding(false);
        }
    };

    if (loading) return <div className="loading-view"><div className="spinner"></div></div>;

    return (
        <div style={{ padding: '0 8px' }}>
            {/* ... rest unchanged ... */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Quiz Management</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Configure daily challenges and infinite quiz pools.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline" onClick={handleBulkSeed} disabled={isSeeding}>
                        <Wand2 size={18} /> {isSeeding ? 'Generating...' : 'AI Bulk Seed'}
                    </button>
                    <button className="btn btn-primary">
                        <Plus size={18} /> New Question
                    </button>
                </div>
            </div>

            <div className="table-box">
                <div className="table-head-strip">
                    <div className="search-bar" style={{ width: '400px' }}>
                        <Search size={18} color="var(--text-muted)" />
                        <input type="text" placeholder="Filter questions by content or category..." />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Question Preview</th>
                            <th>Category</th>
                            <th>Date/Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((q, i) => (
                            <tr key={i}>
                                <td style={{ maxWidth: '400px', fontWeight: '500' }}>{q.question.substring(0, 80)}...</td>
                                <td>
                                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', background: '#F1F5F9', color: '#475569' }}>
                                        {q.category.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        {q.date ? new Date(q.date).toLocaleDateString() : 'Infinite Mode'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-outline" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                                        <button className="btn btn-outline" style={{ padding: '8px', color: 'var(--danger)' }}><Trash size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuizManager;
