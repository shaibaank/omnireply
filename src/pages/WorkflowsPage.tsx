import React, { useState } from 'react';
import {
  GitBranch, Plus, Search, Check, Play, Pause, Edit, Trash, X,
  ArrowRight, MessageSquare, Bot, Clock, HelpCircle, RefreshCw
} from 'lucide-react';
import { workflows as initialWorkflows, Workflow } from '../data/mockData';
import './WorkflowsPage.css';

export default function WorkflowsPage() {
  const [workflowsList, setWorkflowsList] = useState<Workflow[]>(initialWorkflows);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'paused'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleWorkflow = (id: string) => {
    setWorkflowsList(prev => prev.map(wf => {
      if (wf.id === id) {
        const nextStatus = wf.status === 'active' ? 'paused' : 'active';
        return { ...wf, status: nextStatus };
      }
      return wf;
    }));
  };

  const filteredWorkflows = workflowsList.filter(wf => {
    const matchesSearch = wf.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          wf.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wf.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="workflows-page-container">
      <div className="page-header">
        <div>
          <h1>Workflow Automation</h1>
          <p className="subtitle">Automate business responses, lifecycle stages, and routing rules across all platforms.</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Create Workflow</span>
        </button>
      </div>

      <div className="workflows-content-scroll page-scroll">
        {/* Filters Row */}
        <div className="workflows-filters-row">
          <div className="workflows-tabs">
            <button 
              className={`wf-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button 
              className={`wf-tab ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </button>
            <button 
              className={`wf-tab ${statusFilter === 'draft' ? 'active' : ''}`}
              onClick={() => setStatusFilter('draft')}
            >
              Draft
            </button>
            <button 
              className={`wf-tab ${statusFilter === 'paused' ? 'active' : ''}`}
              onClick={() => setStatusFilter('paused')}
            >
              Paused
            </button>
          </div>

          <div className="search-input wf-search-input">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Workflows List Grid */}
        <div className="workflows-grid">
          {filteredWorkflows.map(wf => (
            <div key={wf.id} className={`workflow-card-row ${wf.status}`}>
              <div className="wf-status-section">
                <span className={`wf-status-circle dot-${wf.status}`}></span>
              </div>

              <div className="wf-main-info">
                <h3>{wf.name}</h3>
                <p>{wf.description}</p>
                <div className="wf-tags-row">
                  <span className="tag tag-blue text-xs">Trigger: {wf.trigger}</span>
                  <span className="tag tag-purple text-xs">{wf.actions} actions</span>
                </div>
              </div>

              <div className="wf-stats-info">
                <div className="wf-stat-col">
                  <span className="wf-lbl">Total Runs</span>
                  <span className="wf-val">{wf.runs.toLocaleString()}</span>
                </div>
                <div className="wf-stat-col">
                  <span className="wf-lbl">Success Rate</span>
                  <span className="wf-val text-green">{wf.successRate}%</span>
                </div>
                <div className="wf-stat-col">
                  <span className="wf-lbl">Last Run</span>
                  <span className="wf-val">{wf.lastRun}</span>
                </div>
              </div>

              <div className="wf-actions-section">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={wf.status === 'active'}
                    onChange={() => handleToggleWorkflow(wf.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>

                <div className="action-buttons-group">
                  <button className="icon-btn"><Edit size={16} /></button>
                  <button className="icon-btn-delete"><Trash size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE WORKFLOW MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content workflow-modal-size">
            <div className="modal-header">
              <h2>Create Automation Workflow</h2>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="modal-body">
              <div className="modal-split-layout">
                {/* Visual workflow builder preview */}
                <div className="visual-workflow-preview">
                  <h4>Workflow Preview</h4>
                  <div className="flow-canvas">
                    <div className="flow-node node-trigger">
                      <MessageSquare size={16} />
                      <span>Trigger: New Message</span>
                    </div>
                    <div className="flow-arrow"><i className="ri-arrow-down-line"></i></div>
                    <div className="flow-node node-condition">
                      <HelpCircle size={16} />
                      <span>Condition: Out of Hours?</span>
                    </div>
                    <div className="flow-arrow-split">
                      <div className="split-branch left">
                        <span>Yes</span>
                        <div className="flow-arrow"><i className="ri-arrow-down-line"></i></div>
                        <div className="flow-node node-action">
                          <Bot size={16} />
                          <span>Send Away Msg</span>
                        </div>
                      </div>
                      <div className="split-branch right">
                        <span>No</span>
                        <div className="flow-arrow"><i className="ri-arrow-down-line"></i></div>
                        <div className="flow-node node-action bg-blue-node">
                          <GitBranch size={16} />
                          <span>Route to Sales Team</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Templates Selector */}
                <div className="templates-selector-panel">
                  <h4>Choose a Template</h4>
                  <div className="templates-grid-list">
                    <div className="template-item-card select-active">
                      <h5>Welcome Message</h5>
                      <p>Send an automated welcome message when a new contact messages for the first time.</p>
                    </div>
                    <div className="template-item-card">
                      <h5>Lead Qualification</h5>
                      <p>Qualify incoming leads by asking questions and routing them to correct pipelines.</p>
                    </div>
                    <div className="template-item-card">
                      <h5>Out of Hours Auto-Reply</h5>
                      <p>Politely inform customers when your support team is offline.</p>
                    </div>
                    <div className="template-item-card start-scratch-card">
                      <h5>Start from scratch</h5>
                      <p>Build your own custom logic with triggers and branches.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => {
                setIsModalOpen(false);
                // Add workflow logic if needed
              }}>
                Use Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
