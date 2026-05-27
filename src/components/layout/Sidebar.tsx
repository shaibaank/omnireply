import { NavLink, useLocation } from 'react-router-dom';
import {
  MessageSquare, LayoutDashboard, Users, Bot, GitBranch,
  Radio, Phone, BookOpen, BarChart3, Settings, HelpCircle,
  Bell
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inbox', icon: MessageSquare, label: 'Inbox', badge: 80 },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/ai-agents', icon: Bot, label: 'AI Agents' },
  { to: '/workflows', icon: GitBranch, label: 'Workflows' },
  { to: '/channels', icon: Radio, label: 'Channels' },
  { to: '/ai-call', icon: Phone, label: 'AI Call' },
  { to: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const bottomItems = [
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: 5 },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        O
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {item.badge && <span className="badge">{item.badge > 99 ? '99+' : item.badge}</span>}
              <span className="tooltip">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {item.badge && <span className="badge">{item.badge}</span>}
              <span className="tooltip">{item.label}</span>
            </NavLink>
          );
        })}
        <div className="sidebar-divider" />
        <div className="sidebar-avatar">
          <span>M</span>
          <span className="status-dot online sidebar-status-dot"></span>
        </div>
      </div>
    </aside>
  );
}
