import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import Avatar from '../ui/Avatar.jsx';

export default function Navbar({ onToggleSidebar }) {
  const { user, profile, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⚡</span>
          <span className="navbar__logo-text">Skill Hub</span>
        </Link>
      </div>

      <div className="navbar__right">
        <Link to="/notifications" className="navbar__icon-btn" aria-label={`Notifications (${unreadCount} unread)`}>
          <Bell size={20} />
          {unreadCount > 0 && <span className="navbar__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </Link>

        <div className="navbar__user-menu">
          <button className="navbar__user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <Avatar src={profile?.avatarUrl} name={profile?.displayName || user?.email || ''} size={32} />
          </button>
          {dropdownOpen && (
            <div className="navbar__dropdown glass-panel">
              <div className="navbar__dropdown-header">
                <strong>{profile?.displayName || 'User'}</strong>
                <small>{user?.email}</small>
              </div>
              <Link to="/profile" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                <User size={16} /> Profile
              </Link>
              <button className="navbar__dropdown-item" onClick={() => { setDropdownOpen(false); logout(); }}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
