import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Trash2,
  Check,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const Notifications = () => {
  const toast = useToast();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unread_count || 0);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefreshReminders = async () => {
    setRefreshing(true);
    try {
      const res = await notificationService.generateReminders();
      setNotifications(res.data || []);
      const unread = (res.data || []).filter((n) => !n.is_read).length;
      setUnreadCount(unread);
      toast.success('Reminders and alerts updated');
    } catch (err) {
      toast.error('Failed to sync reminders');
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.info('Marked as read');
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.info('Notification removed');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'overdue_bill':
        return {
          icon: AlertCircle,
          color: 'text-rose-500',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
        };
      case 'bill_reminder':
        return {
          icon: Clock,
          color: 'text-amber-500',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
        };
      case 'budget_alert':
        return {
          icon: AlertTriangle,
          color: 'text-orange-500',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/20',
        };
      default:
        return {
          icon: Sparkles,
          color: 'text-black dark:text-white',
          bg: 'bg-black/5 dark:bg-white/10',
          border: 'border-black/10 dark:border-white/10',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-text tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-black dark:text-white" />
            <span>Notifications & Reminders</span>
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Real-time bill payment deadlines, budget limits, and financial alerts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefreshReminders}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-brand-card hover:bg-brand-elevated text-brand-text border border-brand-border text-xs font-semibold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Check Deadlines</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm border border-zinc-800 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Mechanism Notice */}
      <div className="p-4 rounded-2xl bg-brand-card border border-brand-border/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-black dark:text-white mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-text">
              In-App Notification Engine Active
            </h4>
            <p className="text-[11px] text-brand-muted mt-0.5 max-w-2xl leading-relaxed">
              Alerts evaluate your scheduled bills and category budgets on every session refresh.
              External SMS and email notification channels are not connected and do not send unsolicited messages.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-black dark:text-white px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 whitespace-nowrap">
          {unreadCount} Unread Alert{unreadCount === 1 ? '' : 's'}
        </span>
      </div>

      {/* Notifications List */}
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-card">
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" message="Loading alerts..." />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16">
            <EmptyState
              title="All caught up!"
              description="You have no pending alerts or overdue bills. Check back as upcoming utility deadlines approach."
            />
          </div>
        ) : (
          <div className="divide-y divide-brand-border/50">
            {notifications.map((notif) => {
              const meta = getNotificationIcon(notif.type);
              const Icon = meta.icon;

              return (
                <div
                  key={notif.id}
                  className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                    !notif.is_read
                      ? 'bg-brand-elevated/40 hover:bg-brand-elevated/60'
                      : 'hover:bg-brand-elevated/20'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color} border ${meta.border}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-xs sm:text-sm text-brand-text truncate">
                          {notif.title}
                        </h4>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-black dark:bg-white flex-shrink-0 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-brand-muted leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-brand-subtle block mt-1.5">
                        {new Date(notif.created_at).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!notif.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-1.5 text-brand-muted hover:text-black dark:hover:text-white hover:bg-brand-elevated rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="p-1.5 text-brand-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
