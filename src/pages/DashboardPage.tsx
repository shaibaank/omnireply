import React from 'react';
import {
  MessageSquare, UserCheck, Clock, TrendingUp, ChevronRight,
  TrendingDown, RefreshCw, Calendar, ArrowRight, Smartphone, Activity
} from 'lucide-react';
import { aiAgents, dashboardStats as mockDashboardStats } from '../data/mockData';
import { api } from '../services/api';
import './DashboardPage.css';

export default function DashboardPage() {
  const [stats, setStats] = React.useState<any>(mockDashboardStats);

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getAnalyticsSummary();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
        setStats(mockDashboardStats);
      }
    };
    loadStats();
  }, []);

  const handleSimulateWhatsApp = async () => {
    try {
      await api.triggerInboundWhatsapp('+919000371602', 'Hi, I need an appointment for tomorrow.');
      alert('Simulated inbound WhatsApp message successfully!');
    } catch (e) {
      alert('Failed to simulate');
    }
  };

  const handleSimulateCall = async () => {
    try {
      await api.makeOutboundCall('+1234567890');
      alert('Initiated outbound call successfully!');
    } catch (e) {
      alert('Failed to initiate call');
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'WhatsApp': return '#25D366';
      case 'Facebook': return '#1877F2';
      case 'Instagram': return '#E1306C';
      case 'LinkedIn': return '#0A66C2';
      case 'Phone': return '#3B82F6';
      default: return '#9CA3AF';
    }
  };

  const getChannelIconClass = (channel: string) => {
    switch (channel) {
      case 'WhatsApp': return 'ri-whatsapp-fill';
      case 'Facebook': return 'ri-facebook-box-fill';
      case 'Instagram': return 'ri-instagram-fill';
      case 'LinkedIn': return 'ri-linkedin-box-fill';
      default: return 'ri-chat-3-fill';
    }
  };

  return (
    <div className="dashboard-page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Good evening, Manager 👋 Here's your multi-channel automation summary.</p>
        </div>

        <div className="page-header-actions">
          <div className="date-picker-trigger">
            <Calendar size={16} />
            <span>Last 7 Days</span>
          </div>
          <button className="icon-btn refresh-btn">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* DEMO CONTROLS PANEL */}
      <div className="demo-controls-panel" style={{ background: '#1F2937', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #374151' }}>
        <h3 style={{ color: '#F3F4F6', marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#10B981' }}>●</span> Live Demo Controls
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={handleSimulateWhatsApp} className="btn btn-primary btn-sm" style={{ backgroundColor: '#25D366' }}>
            Simulate WhatsApp Inbound
          </button>
          <button onClick={handleSimulateCall} className="btn btn-primary btn-sm" style={{ backgroundColor: '#F43F5E' }}>
            Initiate VAPI Call
          </button>
        </div>
      </div>

      <div className="dashboard-content-scroll page-scroll">
        {/* STATS ROW */}
        <div className="stats-grid-row">
          <div className="stat-card">
            <div className="stat-card-title">
              <span className="stat-lbl-txt">Total Conversations</span>
              <MessageSquare size={18} className="dashboard-stat-icon color-blue-icon" />
            </div>
            <div className="stat-value">{stats.totalConversations.toLocaleString()}</div>
            <span className="stat-change positive">
              <TrendingUp size={14} /> +12.5%
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-title">
              <span className="stat-lbl-txt">Active Conversations</span>
              <Activity size={18} className="dashboard-stat-icon color-green-icon" />
            </div>
            <div className="stat-value">{stats.activeConversations}</div>
            <span className="stat-change positive">
              <TrendingUp size={14} /> +8.2%
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-title">
              <span className="stat-lbl-txt">Avg Response Time</span>
              <Clock size={18} className="dashboard-stat-icon color-purple-icon" />
            </div>
            <div className="stat-value">{stats.avgResponseTime}</div>
            <span className="stat-change negative">
              <TrendingDown size={14} /> -15.3%
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-title">
              <span className="stat-lbl-txt">Lead Conversion</span>
              <TrendingUp size={18} className="dashboard-stat-icon color-orange-icon" />
            </div>
            <div className="stat-value">{stats.conversionRate}%</div>
            <span className="stat-change positive">
              <TrendingUp size={14} /> +3.1%
            </span>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="charts-grid-row">
          <div className="dashboard-chart-card">
            <div className="card-title-row">
              <h3>Weekly Conversations</h3>
              <span className="card-subtitle-txt">Incoming conversations volume</span>
            </div>
            <div className="chart-bars-container">
              {stats.weeklyConversations.map((item: any) => (
                <div key={item.day} className="chart-bar-group">
                  <div className="bar-wrapper">
                    <div className="bar-fill" style={{ height: `${(item.count / 250) * 100}%` }}>
                      <div className="bar-tooltip">{item.count}</div>
                    </div>
                  </div>
                  <span className="bar-label">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-chart-card">
            <div className="card-title-row">
              <h3>Channel Distribution</h3>
              <span className="card-subtitle-txt">Performance across platforms</span>
            </div>
            <div className="channel-distribution-list">
              {stats.channelBreakdown.map((item: any) => (
                <div key={item.channel} className="channel-prog-item">
                  <div className="channel-prog-lbl">
                    <span>{item.channel}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="prog-bar-bg">
                    <div className={`prog-bar-fill channel-color-${item.channel.toLowerCase()}`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILS ROW */}
        <div className="details-grid-row">
          <div className="details-panel-card">
            <div className="panel-card-header">
              <h3>Recent Activity</h3>
              <button className="text-link-btn">
                <span>View all</span>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="activity-list">
              {stats.recentActivity.map((activity: any, idx: number) => (
                <div key={idx} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <span className="activity-action">{activity.action}</span> for <span className="activity-contact">{activity.contact}</span>
                    </div>
                    <div className="activity-meta">
                      <span className="activity-channel">{activity.channel}</span> • <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="details-panel-card">
            <div className="panel-card-header">
              <h3>AI Agent Status</h3>
              <button className="text-link-btn">
                <span>Manage</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="ai-status-list">
              {aiAgents.map(agent => (
                <div key={agent.id} className="ai-status-row">
                  <div className="ai-agent-identity">
                    <span className="ai-emoji-bubble">{agent.emoji}</span>
                    <div className="ai-meta-txt">
                      <h4>{agent.name}</h4>
                      <p>{agent.description}</p>
                    </div>
                  </div>

                  <div className="ai-metrics-status">
                    <div className="ai-metric-col">
                      <span className="metric-lbl">Conversations</span>
                      <span className="metric-val">{agent.conversations}</span>
                    </div>
                    <div className="ai-metric-col">
                      <span className="metric-lbl">Resolution</span>
                      <span className="metric-val">{agent.resolution}%</span>
                    </div>
                    <div className="ai-status-badge">
                      <span className={`status-badge-dot ${agent.status === 'active' ? 'dot-active' : 'dot-draft'}`}></span>
                      <span>{agent.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
