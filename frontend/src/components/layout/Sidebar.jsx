import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Smartphone,
  Landmark,
  Zap,
  PieChart,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { notificationService } from '../../services/notificationService';

export const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, logout, isMock } = useAuth();
  const toast = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    notificationService
      .getUnreadCount()
      .then((res) => setUnreadCount(res.unread_count || 0))
      .catch(() => {});
  }, [user]);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { name: 'UPI & Payments', path: '/upi-payments', icon: Smartphone, comingSoon: true },
    { name: 'Bank Accounts', path: '/bank-accounts', icon: Landmark, comingSoon: true },
    { name: 'Bills & Utilities', path: '/bills', icon: Zap },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
    { name: 'Reports & Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.');
    window.location.href = '/';
  };

  const navLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
      isActive
        ? 'bg-black text-white dark:bg-zinc-800 dark:text-white shadow-sm font-semibold border border-zinc-800 dark:border-zinc-700/80'
        : 'text-brand-muted hover:text-brand-text hover:bg-brand-elevated'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-brand-sidebar border-r border-brand-border transition-colors">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-20 border-b border-brand-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-black dark:bg-zinc-900 border border-zinc-800 dark:border-zinc-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col transition-opacity duration-200">
              <span className="font-extrabold text-lg tracking-tight text-brand-text flex items-center gap-1.5">
                FinTrack
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-black text-white dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-800 dark:border-zinc-700">
                  PRO
                </span>
              </span>
              <span className="text-xs text-brand-subtle">Wealth OS</span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-brand-card hover:bg-brand-elevated text-brand-muted hover:text-brand-text border border-brand-border transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
              title={isCollapsed ? item.name : undefined}
            >
              <div className="relative flex items-center justify-center">
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.name === 'Notifications' && unreadCount > 0 && isCollapsed && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-black dark:bg-white ring-2 ring-brand-sidebar animate-pulse" />
                )}
              </div>
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate">{item.name}</span>
                  {item.comingSoon && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700/60 ml-2">
                      Soon
                    </span>
                  )}
                  {item.name === 'Notifications' && unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-black text-white dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-800 dark:border-zinc-700">
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Dev Mode Badge & Pro Status */}
      {!isCollapsed && isMock && (
        <div className="mx-4 mb-4 p-3 rounded-xl bg-brand-card border border-brand-border text-xs text-brand-muted">
          <div className="flex items-center gap-2 text-brand-text font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mock Mode Active</span>
          </div>
          <p className="text-[11px] text-brand-subtle leading-tight">
            User-isolated storage. Ready for backend API hook.
          </p>
        </div>
      )}

      {/* User profile preview & Logout */}
      <div className="p-3 border-t border-brand-border space-y-2">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-brand-card/40 border border-brand-border/40">
            <div className="w-9 h-9 rounded-full bg-black dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-text truncate">{user.name}</p>
              <p className="text-xs text-brand-subtle truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
          title={isCollapsed ? 'Log out' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside
        className={`lg:hidden fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;