import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  Check,
  ChevronDown,
  Sparkles,
  CreditCard,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getTimeBasedGreeting } from '../../utils/formatters';

export const Topbar = ({ onMenuClick }) => {
  const { user, logout, isMock } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const greeting = getTimeBasedGreeting();
  const userName = user?.name ? user.name.split(' ')[0] : 'User';

  // Format today's date
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  const mockNotifications = [
    {
      id: 1,
      title: 'Monthly Salary Credited',
      desc: '₹45,000 received from TechCorp India',
      time: '1h ago',
      icon: CreditCard,
      color: 'text-emerald-500',
    },
    {
      id: 2,
      title: 'Housing Budget Alert',
      desc: 'Housing spending reached 94% of budget',
      time: '5h ago',
      icon: AlertCircle,
      color: 'text-amber-500',
    },
    {
      id: 3,
      title: 'Electricity Bill Logged',
      desc: '₹1,200 payment confirmed via UPI',
      time: 'Yesterday',
      icon: Check,
      color: 'text-blue-500',
    },
  ];

  const handleSignOut = () => {
    setProfileOpen(false);
    logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-20 h-20 bg-brand-bg/85 backdrop-blur-xl border-b border-brand-border px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left side: Hamburger button + Greeting & Date */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-brand-muted hover:text-brand-text hover:bg-brand-card rounded-xl border border-brand-border transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-brand-text tracking-tight flex items-center gap-2">
            <span>{greeting}, {userName}</span>
            {isMock && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Sparkles className="w-3 h-3" /> Live Demo
              </span>
            )}
          </h1>
          <p className="text-xs text-brand-muted hidden sm:block">{todayFormatted}</p>
        </div>
      </div>

      {/* Right side: Theme toggle, Notifications & Profile avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Dark / Light Theme Toggle */}
        <button
          data-testid="theme-toggle"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-brand-card hover:bg-brand-elevated text-brand-muted hover:text-brand-text border border-brand-border transition-all"
          aria-label="Toggle dark/light theme"
          title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl bg-brand-card hover:bg-brand-elevated text-brand-muted hover:text-brand-text border border-brand-border transition-all duration-200"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-emerald ring-2 ring-brand-bg animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-dropdown border border-brand-border shadow-elevated p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-brand-border">
                <span className="font-bold text-sm text-brand-text">Notifications</span>
                <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  3 unread
                </span>
              </div>
              <div className="space-y-2">
                {mockNotifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand-card transition-colors cursor-pointer"
                    >
                      <div className={`p-2 rounded-lg bg-brand-elevated ${n.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-brand-text truncate">{n.title}</p>
                          <span className="text-[10px] text-brand-subtle">{n.time}</span>
                        </div>
                        <p className="text-xs text-brand-muted mt-0.5 truncate">{n.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-brand-card hover:bg-brand-elevated border border-brand-border transition-all duration-200 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-emerald to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-semibold text-brand-text block leading-tight">{userName}</span>
              <span className="text-[10px] text-brand-subtle block leading-tight">Personal</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-brand-muted hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-dropdown border border-brand-border shadow-elevated py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-brand-border mb-1">
                <p className="text-xs font-semibold text-brand-text truncate">{user?.name || 'Account User'}</p>
                <p className="text-[11px] text-brand-subtle truncate">{user?.email || 'user@example.com'}</p>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-brand-muted hover:text-brand-text hover:bg-brand-elevated transition-colors text-left"
              >
                <User className="w-4 h-4 text-brand-emerald" />
                <span>Account Profile</span>
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-brand-muted hover:text-brand-text hover:bg-brand-elevated transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-brand-blue" />
                <span>Preferences & Theme</span>
              </button>

              <div className="my-1 border-t border-brand-border" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;