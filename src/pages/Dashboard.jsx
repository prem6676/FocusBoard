import { useMemo } from 'react';
import { ClipboardList, Activity, CheckCircle2, ListTodo, CalendarDays, Plus } from 'lucide-react';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import { computeTaskStats, countByPriority, toIsoDate } from '../data/taskStats';
import './pages.css';
import './pages-extras.css';

const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };

function daysUntil(isoDate, todayIso) {
  const due = new Date(`${isoDate}T00:00:00`);
  const today = new Date(`${todayIso}T00:00:00`);
  return Math.round((due - today) / 86400000);
}

export default function Dashboard({ tasks, preferences, onNavigate, onStatusChange }) {
  const stats = useMemo(() => computeTaskStats(tasks), [tasks]);
  const priorities = useMemo(() => countByPriority(tasks), [tasks]);
  const todayIso = toIsoDate(new Date());

  const recentTasks = useMemo(
    () => [...tasks].slice(0, 3),
    [tasks]
  );

  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status !== 'Completed' && task.dueDate >= todayIso)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 4),
    [tasks, todayIso]
  );

  const openTasks = tasks.filter((task) => task.status !== 'Completed');

  const openMyTasks = (status, priority) => onNavigate('My Tasks', { status, priority });

  return (
    <div className="pages">
      <div className="page-heading">
        <div>
          <h1 className="page-heading__title">
            Welcome back, {preferences.displayName.split(' ')[0]}
          </h1>
          <p className="page-heading__subtitle">
            Here is a snapshot of everything on your plate today.
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => openMyTasks('All', 'All')}>
          <Plus size={16} aria-hidden="true" />
          Go to My Tasks
        </button>
      </div>

      <section aria-label="Task statistics">
        <div className="stat-grid">
          <StatCard label="Total Tasks" value={stats.total} icon={ClipboardList} tone="total" />
          <StatCard label="In Progress" value={stats.inProgress} icon={Activity} tone="progress" />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="completed" />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={ListTodo}
            tone="percentage"
            hint={stats.percentage}
          />
        </div>
      </section>

      <div className="stat-grid stat-grid--two" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <section className="panel" aria-label="Task status distribution">
          <div className="panel__heading">
            <h2 className="panel__title">Status distribution</h2>
            <span className="panel__count">{stats.percentage}% complete</span>
          </div>
          <div className="bar-row">
            <span className="bar-row__label">To do</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill bar-row__fill--todo"
                style={{ width: `${stats.total ? (stats.toDo / stats.total) * 100 : 0}%` }}
              />
            </div>
            <span className="bar-row__value">{stats.toDo}</span>
          </div>
          <div className="bar-row">
            <span className="bar-row__label">In progress</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill bar-row__fill--inprogress"
                style={{ width: `${stats.total ? (stats.inProgress / stats.total) * 100 : 0}%` }}
              />
            </div>
            <span className="bar-row__value">{stats.inProgress}</span>
          </div>
          <div className="bar-row">
            <span className="bar-row__label">Completed</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill bar-row__fill--completed"
                style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }}
              />
            </div>
            <span className="bar-row__value">{stats.completed}</span>
          </div>
        </section>

        <section className="panel" aria-label="Priority distribution">
          <div className="panel__heading">
            <h2 className="panel__title">Priority distribution</h2>
          </div>
          {(['low', 'medium', 'high']).map((key) => {
            const priority = PRIORITY_LABELS[key];
            return (
              <div className="bar-row" key={key}>
                <span className="bar-row__label">{priority}</span>
                <div className="bar-row__track">
                  <div
                    className={`bar-row__fill bar-row__fill--${key}`}
                    style={{ width: `${stats.total ? (priorities[priority] / stats.total) * 100 : 0}%` }}
                  />
                </div>
                <span className="bar-row__value">{priorities[priority]}</span>
              </div>
            );
          })}
        </section>
      </div>

      <section className="panel" aria-label="Upcoming deadlines">
        <div className="panel__heading">
          <h2 className="panel__title">Upcoming deadlines</h2>
          <span className="panel__count">{openTasks.length} open tasks</span>
        </div>
        {upcomingTasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true">
              <CalendarDays size={22} />
            </span>
            <h3 className="empty-state__title">No upcoming deadlines</h3>
            <p>Nothing is due right now. Enjoy the clear runway!</p>
          </div>
        ) : (
          <ul className="deadline-list">
            {upcomingTasks.map((task) => {
              const diff = daysUntil(task.dueDate, todayIso);
              return (
                <li key={task.id} className="deadline-item">
                  <div>
                    <button
                      type="button"
                      className="deadline-item__title"
                      onClick={() => onNavigate('My Tasks', { status: 'All', priority: 'All' })}
                    >
                      {task.title}
                    </button>
                    <p className="deadline-item__due">
                      {diff === 0 ? 'Due today' : diff === 1 ? 'Due tomorrow' : `Due in ${diff} days`}
                      {' · '}
                      {task.priority} priority
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      task.priority === 'High'
                        ? 'badge--high'
                        : task.priority === 'Medium'
                          ? 'badge--medium'
                          : 'badge--low'
                    }`}
                  >
                    <span className="badge-dot" aria-hidden="true" />
                    {task.priority}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="panel" aria-label="Recently added tasks">
        <div className="panel__heading">
          <h2 className="panel__title">Recently added tasks</h2>
          <button
            type="button"
            className="panel__link"
            onClick={() => openMyTasks('All', 'All')}
          >
            View all
          </button>
        </div>
        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true">
              <ClipboardList size={22} />
            </span>
            <h3 className="empty-state__title">No tasks yet</h3>
            <p>Create your first task in My Tasks to see it here.</p>
          </div>
        ) : (
          <div className="dashboard-task-list">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => openMyTasks('All', 'All')}
                onDelete={() => openMyTasks('All', 'All')}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
