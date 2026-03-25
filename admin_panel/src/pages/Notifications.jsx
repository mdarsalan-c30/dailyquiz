import React from 'react';
import { Bell, Send, Clock, History } from 'lucide-react';

const Notifications = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Engagement Broadcasts</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Send push notifications to re-engage users and announce quizzes.</p>
      </div>
    </div>

    <div className="card-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
      <div className="table-box" style={{ padding: '32px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '700' }}>Compose Notification</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Title</label>
            <input type="text" placeholder="Today's Quiz is Live!" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Message Body</label>
            <textarea placeholder="Don't break your streak! Play now 🔥" style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', resize: 'none' }}></textarea>
          </div>
          <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <Send size={18} /> Send to All Users
          </button>
        </div>
      </div>

      <div className="table-box">
        <div className="table-head-strip">
          <h3>Broadcast History</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Sent To</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: '600' }}>Daily Streak Reminder</td>
              <td><span className="badge badge-success">DELIVERED</span></td>
              <td>1,240 users</td>
              <td style={{ color: 'var(--text-muted)' }}>2 hours ago</td>
            </tr>
            <tr>
              <td style={{ fontWeight: '600' }}>New Finance Quiz</td>
              <td><span className="badge badge-success">DELIVERED</span></td>
              <td>1,190 users</td>
              <td style={{ color: 'var(--text-muted)' }}>Yesterday</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Notifications;
