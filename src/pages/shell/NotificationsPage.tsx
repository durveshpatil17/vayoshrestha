import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Activity,
  CheckCheck,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  category: 'Task' | 'Approval' | 'Escalation' | 'DeliveryAlert';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      category: 'Escalation',
      title: 'Health Welfare Triage Case Assigned',
      description: 'Senior Bhagwandas Sharma (HUB-PUN) flagged for sudden dizziness. 2h SLA deadline active.',
      timestamp: '10 minutes ago',
      isRead: false,
    },
    {
      id: 'notif-2',
      category: 'Approval',
      title: 'Attendance Correction Pending Review',
      description: 'Volunteer Pooja Shinde submitted attendance correction for Gentle Morning Yoga session.',
      timestamp: '45 minutes ago',
      isRead: false,
    },
    {
      id: 'notif-3',
      category: 'DeliveryAlert',
      title: 'WhatsApp Batch Delivery Completed',
      description: '142 session reminders delivered with 98.6% delivery success rate.',
      timestamp: '2 hours ago',
      isRead: true,
    },
    {
      id: 'notif-4',
      category: 'Task',
      title: 'Monthly Centre Drop-off Follow-up Due',
      description: '12 senior citizens at Ekta Hub Shivajinagar have been absent for over 30 days.',
      timestamp: '5 hours ago',
      isRead: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const filtered = filter === 'UNREAD' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div>
      <PageHeader
        title="Notifications & Alerts"
        description="Operational alerts, approval requests, escalation triggers, and delivery dispatches."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Notifications' }]}
        primaryAction={
          <Button
            variant="secondary"
            size="sm"
            icon={<CheckCheck className="w-4 h-4 text-accent" />}
            onClick={markAllAsRead}
          >
            Mark All as Read
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex border-b border-border-hairline mb-4 gap-4 text-xs font-semibold">
        <button
          onClick={() => setFilter('ALL')}
          className={`pb-2 border-b-2 -mb-px ${
            filter === 'ALL' ? 'border-accent text-accent font-semibold' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`pb-2 border-b-2 -mb-[1px] ${
            filter === 'UNREAD' ? 'border-accent text-accent font-semibold' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Unread ({notifications.filter((n) => !n.isRead).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-xs border border-dashed border-border-hairline rounded bg-bg-subtle">
            No notifications in this view.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markSingleAsRead(item.id)}
              className={`p-4 rounded border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                item.isRead
                  ? 'bg-bg-base border-border-hairline'
                  : 'bg-accent-tint/20 border-accent/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {item.category === 'Escalation' && (
                    <div className="w-7 h-7 rounded-full bg-danger-bg text-danger flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  {item.category === 'Approval' && (
                    <div className="w-7 h-7 rounded-full bg-warning-bg text-warning flex items-center justify-center">
                      <FileCheck className="w-4 h-4" />
                    </div>
                  )}
                  {item.category === 'DeliveryAlert' && (
                    <div className="w-7 h-7 rounded-full bg-accent-tint text-accent flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                  )}
                  {item.category === 'Task' && (
                    <div className="w-7 h-7 rounded-full bg-bg-subtle text-text-muted flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-text-primary">{item.title}</h4>
                    <StatusChip
                      label={item.category}
                      variant={
                        item.category === 'Escalation'
                          ? 'danger'
                          : item.category === 'Approval'
                          ? 'pending'
                          : 'neutral'
                      }
                    />
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-text-muted block">{item.timestamp}</span>
                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-accent inline-block mt-1" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
