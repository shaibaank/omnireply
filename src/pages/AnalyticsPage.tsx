import React from 'react';
import {
  BarChart3, Calendar, FileDown, MessageSquare, TrendingUp,
  Clock, ShieldAlert, CheckCircle, Sparkles
} from 'lucide-react';
import { dashboardStats, aiAgents } from '../data/mockData';
import './AnalyticsPage.css';

export default function AnalyticsPage() {
  return (
    <div className="analytics-page-container">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="subtitle">Track metrics, AI performance, resolution speeds, and customer CSAT satisfaction scores.</p>
        </div>

        <div className="page-header-actions">
          <div className="date-picker-trigger">
            <Calendar size={16} />
            <span>Last 30 Days</span>
          </div>
          <button className="btn btn-secondary">
            <FileDown size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="analytics-content-scroll page-scroll">
        {/* Metric Cards */}
        <div className="analytics-stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-lbl-txt">Total Messages</span>
              <MessageSquare size={18} className="analytics-stat-icon color-blue-icon" />
            </div>
            <div className="stat-value">12,456</div>
            <span className="stat-change positive">
              <TrendingUp size={12} /> +14.2% from last month
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-lbl-txt">Response Rate</span>
              <CheckCircle size={18} className="analytics-stat-icon color-green-icon" />
            </div>
            <div className="stat-value">98.2%</div>
            <span className="stat-change positive">
              <TrendingUp size={12} /> +1.5% from last month
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-lbl-txt">Avg Resolution Time</span>
              <Clock size={18} className="analytics-stat-icon color-purple-icon" />
            </div>
            <div className="stat-value">4.2 min</div>
            <span className="stat-change negative">
              -0.8 min from last month
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-lbl-txt">CSAT Rating</span>
              <Sparkles size={18} className="analytics-stat-icon color-orange-icon" />
            </div>
            <div className="stat-value">4.7 / 5</div>
            <span className="stat-change positive">
              <TrendingUp size={12} /> +0.2% from last month
            </span>
          </div>
        </div>

        {/* Charts Row */}
        <div className="analytics-charts-row">
          {/* Conversation performance (gradient chart CSS) */}
          <div className="analytics-chart-card">
            <h3>Conversations Volume Over Time</h3>
            <span className="card-subtitle-txt">Daily breakdown of incoming messages</span>

            <div className="css-area-chart-approx">
              <div className="chart-grid-bg">
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
              </div>

              {/* Area path */}
              <div className="approx-area-gradient"></div>

              <div className="chart-x-axis">
                <span>May 1</span>
                <span>May 8</span>
                <span>May 15</span>
                <span>May 22</span>
                <span>May 29</span>
              </div>
            </div>
          </div>

          {/* Platforms performance */}
          <div className="analytics-chart-card">
            <h3>Platform Performance</h3>
            <span className="card-subtitle-txt">Resolution rate and volume by platform</span>

            <div className="platform-bars-list">
              <div className="platform-bar-item">
                <div className="lbl-row">
                  <span>WhatsApp</span>
                  <strong>88% resolved</strong>
                </div>
                <div className="prog-bar"><div className="prog-fill bg-green" style={{ width: '88%' }}></div></div>
              </div>
              <div className="platform-bar-item">
                <div className="lbl-row">
                  <span>Facebook</span>
                  <strong>79% resolved</strong>
                </div>
                <div className="prog-bar"><div className="prog-fill bg-blue" style={{ width: '79%' }}></div></div>
              </div>
              <div className="platform-bar-item">
                <div className="lbl-row">
                  <span>Instagram</span>
                  <strong>85% resolved</strong>
                </div>
                <div className="prog-bar"><div className="prog-fill bg-instagram" style={{ width: '85%' }}></div></div>
              </div>
              <div className="platform-bar-item">
                <div className="lbl-row">
                  <span>LinkedIn</span>
                  <strong>72% resolved</strong>
                </div>
                <div className="prog-bar"><div className="prog-fill bg-purple" style={{ width: '72%' }}></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Performance details */}
        <div className="analytics-ai-leaderboard-card">
          <h3>AI Agent Efficiency Rankings</h3>
          <p className="card-subtitle-txt">Overall resolution percentage and average answer speeds.</p>

          <table className="data-table mt-4">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Conversations Handled</th>
                <th>Avg Resolution Time</th>
                <th>Deflection Rate</th>
                <th>CSAT Score</th>
                <th>Overall Status</th>
              </tr>
            </thead>
            <tbody>
              {aiAgents.map(ag => (
                <tr key={ag.id}>
                  <td>
                    <div className="agent-identity-cell">
                      <span className="avatar-bubble">{ag.emoji}</span>
                      <span className="agent-name-bold">{ag.name}</span>
                    </div>
                  </td>
                  <td>{ag.conversations.toLocaleString()}</td>
                  <td>{ag.name === 'Support Agent' ? '2.8 min' : '1.4 min'}</td>
                  <td>{ag.resolution}%</td>
                  <td>{ag.name === 'Support Agent' ? '4.8 / 5' : '4.6 / 5'}</td>
                  <td>
                    <span className={`tag ${ag.status === 'active' ? 'tag-green' : 'tag-gray'}`}>
                      {ag.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
