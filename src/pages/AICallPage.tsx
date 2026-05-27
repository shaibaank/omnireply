import React, { useState } from 'react';
import {
  Phone, Play, Check, X, Shield, Plus, Info, Clock, PlayCircle,
  Pause, Headphones, ArrowUpRight, ArrowDownLeft, AlertCircle, Sparkles, Mic, Square
} from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { callLogs as initialCallLogs, CallLog } from '../data/mockData';
import './AICallPage.css';

export default function AICallPage() {
  const [logsList, setLogsList] = useState<CallLog[]>(initialCallLogs);
  const [activeTab, setActiveTab] = useState<'logs' | 'config'>('logs');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  
  // VAPI Web Call State
  const [callStatus, setCallStatus] = useState<'idle' | 'loading' | 'active'>('idle');
  const vapiRef = React.useRef<any>(null);
  const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
  const [callError, setCallError] = useState<string | null>(null);
  const [callStage, setCallStage] = useState<string>('idle');
  const [transcript, setTranscript] = useState<Array<{ role: 'assistant' | 'user'; text: string; partial?: boolean }>>([]);

  React.useEffect(() => {
    // Initialize VAPI with Public Key
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      console.error('Missing VITE_VAPI_PUBLIC_KEY');
      return;
    }
    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setCallStatus('active');
      setCallError(null);
      setCallStage('in-call');
    });
    vapi.on('call-end', () => {
      setCallStatus('idle');
      setCallStage('ended');
    });
    vapi.on('call-start-failed', (event: any) => {
      setCallStatus('idle');
      setCallError(event?.error || 'Call failed to start');
      setCallStage('failed');
    });
    vapi.on('message', (message: any) => {
      if (!message) return;
      if (message.type === 'status-update' && message.status) {
        setCallStage(message.status);
        return;
      }
      if (message.type === 'transcript') {
        const role = message.role === 'assistant' ? 'assistant' : 'user';
        const text = String(message.transcript || '').trim();
        if (!text) return;
        const isPartial = message.transcriptType === 'partial';
        setTranscript((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === role) {
            if (isPartial && last.partial) {
              last.text = text;
              return [...next];
            }
            if (!isPartial && last.partial) {
              last.text = text;
              last.partial = false;
              return [...next];
            }
            if (!isPartial && last.text === text) {
              return next;
            }
          }
          return [...next, { role, text, partial: isPartial }];
        });
      }
    });
    vapi.on('speech-start', () => setCallStage('speaking'));
    vapi.on('speech-end', () => setCallStage('listening'));
    vapi.on('error', (e: any) => {
      console.error(e);
      setCallError(e?.message || 'Vapi error');
      setCallStatus('idle');
      setCallStage('error');
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const handleStartBrowserCall = async () => {
    if (callStatus !== 'idle') return;
    if (!assistantId) {
      console.error('Missing VITE_VAPI_ASSISTANT_ID');
      setCallError('Missing VITE_VAPI_ASSISTANT_ID');
      return;
    }
    if (!vapiRef.current) {
      setCallError('Vapi client not initialized');
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.error(err);
      setCallError('Microphone access denied. السماح بالمايك مطلوب.');
      return;
    }
    setCallStatus('loading');
    setCallError(null);
    setCallStage('connecting');
    setTranscript([]);
    
    vapiRef.current.start(assistantId).then(() => {
      vapiRef.current.send({ type: 'control', control: 'say-first-message' });
    }).catch((e: any) => {
      console.error('Failed to start VAPI call:', e);
      setCallError(e?.message || 'Failed to start Vapi call');
      setCallStatus('idle');
      setCallStage('failed');
    });
  };

  const handleStopCall = () => {
    vapiRef.current?.stop();
    setCallStatus('idle');
  };
  
  // Call Configuration Form State
  const [enableCalls, setEnableCalls] = useState(true);
  const [autoAnswer, setAutoAnswer] = useState('3 rings');
  const [voiceType, setVoiceType] = useState('Female - Natural');
  const [speakingRate, setSpeakingRate] = useState(1);
  const [callPersonality, setCallPersonality] = useState('Helpful, friendly, and professional receptionist assistant.');

  const handlePlayAudio = (id: string) => {
    if (isPlaying === id) {
      setIsPlaying(null);
    } else {
      setIsPlaying(id);
      // Automatically stop after 3s to simulate playback
      setTimeout(() => {
        setIsPlaying(prev => prev === id ? null : prev);
      }, 4000);
    }
  };

  return (
    <div className="ai-call-page-container">
      <div className="page-header">
        <div>
          <h1>AI Voice Calls</h1>
          <p className="subtitle">Deploy automated conversational AI voice agents to answer client calls, qualify leads, and book slots.</p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary">
            <Phone size={16} />
            <span>Configure Voice API</span>
          </button>
          
          {callStatus === 'idle' ? (
            <button className="btn btn-primary" onClick={handleStartBrowserCall} style={{ backgroundColor: '#10B981' }}>
              <Mic size={16} />
              <span>Start Browser Call (Demo)</span>
            </button>
          ) : callStatus === 'loading' ? (
            <button className="btn btn-primary" disabled style={{ backgroundColor: '#6B7280' }}>
              <Clock size={16} className="animate-spin" />
              <span>Connecting...</span>
            </button>
          ) : (
            <button className="btn btn-primary pulse-row" onClick={handleStopCall} style={{ backgroundColor: '#EF4444' }}>
              <Square size={16} />
              <span>End Call</span>
            </button>
          )}
        </div>
      </div>

      {(callStatus === 'loading' || callStatus === 'active') && (
        <div className="call-modal">
          <div className="call-modal-card">
            <div className="call-modal-header">
              <Phone size={18} />
              <div>
                <div className="call-modal-title">OmniReply Voice Agent</div>
                <div className="call-modal-sub">Voice: Anushka</div>
              </div>
              <span className={`call-status-pill ${callStatus}`}>{callStatus === 'loading' ? 'Connecting' : 'Live'}</span>
            </div>

            <div className="call-tags">
              {['Name', 'Phone', 'Age', 'Symptoms', 'Date', 'Time', 'Treatment'].map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="call-thread">
              {transcript.length === 0 ? (
                <div className="call-bubble assistant">
                  {callStatus === 'loading' ? 'Connecting to your assistant...' : 'Hi! How can I help today?'}
                </div>
              ) : (
                transcript.map((item, idx) => (
                  <div key={`${item.text}-${idx}`} className={`call-row ${item.role}`}>
                    <span className="call-label">{item.role === 'assistant' ? 'AI' : 'You'}</span>
                    <div className={`call-bubble ${item.role}`}>
                      {item.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="call-footer">
              <span className={`call-listening ${callStatus === 'active' ? 'on' : ''}`}>
                <span className="dot" /> Listening...
              </span>
              <button className="call-hangup" onClick={handleStopCall}>
                <Phone size={16} />
              </button>
            </div>

            {callError && <div className="call-error-inline">{callError}</div>}
            {callStage && callStage !== 'in-call' && (
              <div className="call-stage">Status: {callStage}</div>
            )}
          </div>
        </div>
      )}

      <div className="ai-call-content page-scroll">
        {/* Metric Cards Row */}
        <div className="call-stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon icon-blue">
                <Phone size={20} />
              </div>
            </div>
            <div className="stat-value">23</div>
            <div className="stat-label">Total Calls Today</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon icon-green">
                <Headphones size={20} />
              </div>
              <span className="pulsing-call-dot"></span>
            </div>
            <div className="stat-value">1</div>
            <div className="stat-label">Active In-progress Calls</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon icon-purple">
                <Clock size={20} />
              </div>
            </div>
            <div className="stat-value">3:45</div>
            <div className="stat-label">Avg Call Duration</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon icon-orange">
                <Check size={20} />
              </div>
            </div>
            <div className="stat-value">89%</div>
            <div className="stat-label">Resolution Rate</div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="ai-call-tabs-row">
          <div className="call-tabs">
            <button 
              className={`call-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              Call Logs
            </button>
            <button 
              className={`call-tab-btn ${activeTab === 'config' ? 'active' : ''}`}
              onClick={() => setActiveTab('config')}
            >
              Voice Settings &amp; Configuration
            </button>
          </div>
        </div>

        {/* Dynamic Panel content */}
        {activeTab === 'logs' ? (
          <div className="call-logs-panel animate-fade-in">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Direction</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Channel</th>
                  <th>AI Agent Assigned</th>
                  <th>Time</th>
                  <th style={{ textAlign: 'right' }}>Audio Recording</th>
                </tr>
              </thead>
              <tbody>
                {logsList.map(log => (
                  <tr key={log.id} className={log.status === 'in-progress' ? 'pulse-row' : ''}>
                    <td>
                      <div className="call-contact-col">
                        <div className="contact-avatar-circle" style={{ backgroundColor: log.avatarColor, width: 32, height: 32, fontSize: 11 }}>
                          {log.contactAvatar}
                        </div>
                        <span className="contact-name">{log.contactName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`direction-label ${log.direction}`}>
                        {log.direction === 'inbound' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        <span>{log.direction === 'inbound' ? 'Inbound' : 'Outbound'}</span>
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge call-stat-${log.status}`}>
                        {log.status === 'in-progress' && <span className="pulsing-min-dot"></span>}
                        {log.status}
                      </span>
                    </td>
                    <td>{log.duration}</td>
                    <td>{log.channel}</td>
                    <td>{log.agentName}</td>
                    <td>{log.timestamp}</td>
                    <td style={{ textAlign: 'right' }}>
                      {log.recording ? (
                        <button 
                          className={`btn btn-secondary btn-sm play-recording-btn ${isPlaying === log.id ? 'playing-active' : ''}`}
                          onClick={() => handlePlayAudio(log.id)}
                        >
                          {isPlaying === log.id ? (
                            <>
                              <Pause size={12} />
                              <span>Playing (0:04)</span>
                            </>
                          ) : (
                            <>
                              <Play size={12} />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="no-recording-lbl">No recording</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="call-config-panel animate-fade-in">
            <div className="config-grid-layout">
              {/* Call Settings Column */}
              <div className="config-section-card">
                <h3>Call Settings</h3>
                <p className="section-desc">Manage voice automation pickup rules and fallback escalations.</p>

                <div className="config-fields-list">
                  <div className="config-toggle-row">
                    <div>
                      <span className="field-lbl-txt">Enable AI Call Handling</span>
                      <p className="field-sub-txt">Allow conversational voice AI to answers incoming calls.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={enableCalls}
                        onChange={() => setEnableCalls(!enableCalls)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="config-input-item">
                    <label>Auto-answer after</label>
                    <select value={autoAnswer} onChange={(e) => setAutoAnswer(e.target.value)}>
                      <option>1 ring</option>
                      <option>2 rings</option>
                      <option>3 rings</option>
                      <option>4 rings</option>
                    </select>
                  </div>

                  <div className="config-input-item">
                    <label>Max call duration (minutes)</label>
                    <input type="number" defaultValue={10} />
                  </div>

                  <div className="config-input-item">
                    <label>Transfer to human after failed attempts</label>
                    <input type="number" defaultValue={3} />
                  </div>
                </div>
              </div>

              {/* Voice Settings Column */}
              <div className="config-section-card">
                <h3>Voice &amp; Personality Settings</h3>
                <p className="section-desc">Customize voice types, accents, speed rate, and speech personality guidelines.</p>

                <div className="config-fields-list">
                  <div className="config-input-item">
                    <label>Voice Type</label>
                    <select value={voiceType} onChange={(e) => setVoiceType(e.target.value)}>
                      <option>Female - Natural</option>
                      <option>Male - Warm</option>
                      <option>Female - Accent British</option>
                      <option>Male - Energetic</option>
                    </select>
                  </div>

                  <div className="config-input-item">
                    <label>Speaking Rate ({speakingRate}x)</label>
                    <input 
                      type="range" 
                      min="0.8" 
                      max="1.5" 
                      step="0.1" 
                      value={speakingRate} 
                      onChange={(e) => setSpeakingRate(parseFloat(e.target.value))} 
                    />
                  </div>

                  <div className="config-input-item">
                    <label>Call Assistant Personality Description</label>
                    <textarea 
                      value={callPersonality}
                      onChange={(e) => setCallPersonality(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="config-card-actions">
                  <button className="btn btn-secondary">Test Voice Tone</button>
                  <button className="btn btn-primary">
                    <Sparkles size={14} />
                    <span>Save Configuration</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
