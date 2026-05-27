import React, { useState } from 'react';
import {
  Settings, User, Bell, Shield, Key, Users, Globe, Database,
  Check, Info, Mail, Phone, Lock, Save
} from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'hours'>('profile');
  const [workspaceName, setWorkspaceName] = useState('OmniReply Workspace');
  const [timezone, setTimezone] = useState('(UTC+05:30) Asia/Kolkata');
  
  // Notification Preferences
  const [notifyNew, setNotifyNew] = useState(true);
  const [notifyAssign, setNotifyAssign] = useState(true);
  const [notifyMention, setNotifyMention] = useState(true);
  const [notifySummary, setNotifySummary] = useState(false);

  return (
    <div className="settings-page-container">
      {/* Settings Navigation Sidebar */}
      <div className="settings-nav-sidebar">
        <div className="settings-sidebar-header">
          <h3>Settings</h3>
        </div>

        <div className="settings-nav-links">
          <button 
            className={`settings-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} />
            <span>Profile &amp; Workspace</span>
          </button>

          <button 
            className={`settings-link ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            <span>Notification Settings</span>
          </button>

          <button 
            className={`settings-link ${activeTab === 'hours' ? 'active' : ''}`}
            onClick={() => setActiveTab('hours')}
          >
            <Globe size={16} />
            <span>Business Hours</span>
          </button>
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="settings-content-pane page-scroll">
        {activeTab === 'profile' && (
          <div className="settings-view-panel animate-fade-in">
            <h2>Profile &amp; Workspace Info</h2>
            <p className="section-desc">Manage your workspace details and agent personal account credentials.</p>

            <div className="settings-form-layout">
              {/* Profile Card */}
              <div className="settings-card">
                <h3>Personal Profile</h3>
                <div className="profile-edit-avatar-row">
                  <div className="edit-avatar-circle">M</div>
                  <div>
                    <button className="btn btn-secondary btn-sm">Upload Photo</button>
                    <span className="info-tip-txt block mt-1">PNG, JPG up to 2MB.</span>
                  </div>
                </div>

                <div className="form-fields-grid">
                  <div className="form-item">
                    <label>Full Name</label>
                    <input type="text" defaultValue="Manager Admin" />
                  </div>
                  <div className="form-item">
                    <label>Email Address</label>
                    <input type="email" defaultValue="admin@omnireply.com" />
                  </div>
                </div>
              </div>

              {/* Workspace Card */}
              <div className="settings-card">
                <h3>Workspace Details</h3>
                <div className="form-fields-grid">
                  <div className="form-item">
                    <label>Workspace Name</label>
                    <input 
                      type="text" 
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                    />
                  </div>
                  <div className="form-item">
                    <label>Workspace ID</label>
                    <input type="text" value="ws_abc123xyz" disabled className="bg-disabled" />
                  </div>
                </div>
              </div>

              <div className="form-action-footer">
                <button className="btn btn-primary">
                  <Save size={14} />
                  <span>Save Workspace Info</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="settings-view-panel animate-fade-in">
            <h2>Notification Settings</h2>
            <p className="section-desc">Specify what notifications you want to receive across email, browser and mobile app.</p>

            <div className="settings-form-layout">
              <div className="settings-card">
                <h3>System Event Notifications</h3>
                
                <div className="preferences-toggles-list">
                  <div className="preference-item">
                    <div>
                      <h4>New incoming conversation</h4>
                      <p>Alert me immediately when a client opens a chat on WhatsApp, Facebook, or Instagram.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifyNew}
                        onChange={() => setNotifyNew(!notifyNew)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <div>
                      <h4>Assigned to me</h4>
                      <p>Notify me when a conversation is assigned to me by the AI or another manager.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifyAssign}
                        onChange={() => setNotifyAssign(!notifyAssign)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <div>
                      <h4>Mentioned in internal comment</h4>
                      <p>Send browser push alerts when another teammate mentions me in chat commentary.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifyMention}
                        onChange={() => setNotifyMention(!notifyMention)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <div>
                      <h4>Daily metric summary email</h4>
                      <p>Receive an email summary of resolution rates, average reply speeds, and lead counts at 8:00 AM.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifySummary}
                        onChange={() => setNotifySummary(!notifySummary)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-action-footer">
                <button className="btn btn-primary">
                  <Save size={14} />
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="settings-view-panel animate-fade-in">
            <h2>Business Hours</h2>
            <p className="section-desc">Set operational hours. Outside business hours, AI auto-replies or out-of-hours messages can trigger.</p>

            <div className="settings-form-layout">
              <div className="settings-card">
                <h3>Operational Hours</h3>

                <div className="form-item mt-2">
                  <label>Workspace Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    <option>(UTC+05:30) Asia/Kolkata</option>
                    <option>(UTC-05:00) Eastern Time (US &amp; Canada)</option>
                    <option>(UTC+00:00) London, Dublin</option>
                    <option>(UTC+08:00) Singapore, Hong Kong</option>
                  </select>
                </div>

                <div className="business-days-hours-grid mt-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <div key={day} className="day-hours-row">
                      <span className="day-name">{day}</span>
                      <div className="hours-inputs-pair">
                        <input type="text" defaultValue="09:00 AM" className="hour-input" />
                        <span>to</span>
                        <input type="text" defaultValue="06:00 PM" className="hour-input" />
                      </div>
                      <span className="status-label-txt font-semibold text-green">Active</span>
                    </div>
                  ))}
                  {['Saturday', 'Sunday'].map(day => (
                    <div key={day} className="day-hours-row disabled-day">
                      <span className="day-name">{day}</span>
                      <div className="hours-inputs-pair">
                        <input type="text" defaultValue="Closed" className="hour-input bg-disabled" disabled />
                      </div>
                      <span className="status-label-txt font-semibold text-gray">Closed</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-action-footer">
                <button className="btn btn-primary">
                  <Save size={14} />
                  <span>Save Business Hours</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
