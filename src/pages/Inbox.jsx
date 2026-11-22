import { useMemo } from 'react';
import { Inbox as InboxIcon, AlarmClock, CalendarClock, CalendarDays, CheckCheck } from 'lucide-react';
import { toIsoDate, isOverdue } from '../data/taskStats';
import { formatDueDate } from '../data/taskUtils';
import './pages.css';
import './pages-extras.css';

const TYPE_META = {
  overdue: {
    label: 'Overdue',
    icon: AlarmClock,
    badge: 'badge--high',
  },
  today: {
    label: 'Due today',
    icon: CalendarClock,
    badge: 'badge--medium',
  },
  upcoming: {
    label: 'Due soon',
    icon: CalendarDays,
    badge: 'badge--inprogress',
  },
  completed: {
    label: 'Recently completed',
    icon: CheckCheck,
    badge: 'badge--completed',
  },
};

function buildNotifications(tasks, todayIso) {
  const notifications = [];
  tasks.forEach((task) => {
    if (isOverdue(task, todayIso)) {
      notifications.push({ task, type: 'overdue' });
    } else if (task.status !== 'Completed' && task.dueDate === todayIso) {
      notifications.push({ task, type: 'today' });
    } else if (task.status !== 'Completed' && task.dueDate > todayIso) {
      const due = new Date(`${task.dueDate}T00:00:00`);
      const today = new Date(`${todayIso}T00:00:00`);
      const daysOut = Math.round((due - today) / 86400000);
      if (daysOut <= 7) {
        notifications.push({ task, type: 'upcoming' });
      }
    } else if (task.status === 'Completed' && task.dueDate >= todayIso) {
      notifications.push({ task, type: 'completed' });
    }
  });
  const order = { overdue: 0, today: 1, upcoming: 2, completed: 3 };
  return notifications.sort((a, b) => order[a.type] - order[b.type] || a.task.dueDate.localeCompare(b.task.dueDate));
}

export default function Inbox({ tasks, onOpenTask }) {
  const todayIso = toIsoDate(new Date());
  const notifications = useMemo(() => buildNotifications(tasks, todayIso), [tasks, todayIso]);

  return (
    <div className="pages">
      <div className="page-heading">
        <div>
          <h1 className="page-heading__title">Inbox</h1>
          <p className="page-heading__subtitle">
            Automatically generated from your task dates and statuses — nothing to configure.
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <section className="panel">
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true">
              <InboxIcon size={22} />
            </span>
            <h3 className="empty-state__title">You&apos;re all caught up</h3>
            <p>
              No overdue work, nothing due today, and no deadlines in the next seven days. New
              notifications appear here automatically as your tasks change.
            </p>
          </div>
        </section>
      ) : (
        <section className="panel" aria-label="Task notifications">
          <div className="panel__heading">
            <h2 className="panel__title">Notifications</h2>
            <span className="panel__count">
              {notifications.length} item{notifications.length === 1 ? '' : 's'}
            </span>
          </div>
          <ul className="inbox-list">
            {notifications.map(({ task, type }) => {
              const meta = TYPE_META[type];
              const Icon = meta.icon;
              return (
                <li key={`${type}-${task.id}`} className="inbox-item">
                  <span className={`badge ${meta.badge} inbox-item__type`}>
                    <Icon size={13} aria-hidden="true" />
                    {meta.label}
                  </span>
                  <div className="inbox-item__body">
                    <button
                      type="button"
                      className="inbox-item__title"
                      onClick={() => onOpenTask(task)}
                    >
                      {task.title}
                    </button>
                    <p className="inbox-item__meta">
                      Due {formatDueDate(task.dueDate)} · {task.status} · {task.priority} priority
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      task.status === 'Completed'
                        ? 'badge--completed'
                        : task.status === 'In progress'
                          ? 'badge--inprogress'
                          : 'badge--todo'
                    }`}
                  >
                    <span className="badge-dot" aria-hidden="true" />
                    {task.status}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
