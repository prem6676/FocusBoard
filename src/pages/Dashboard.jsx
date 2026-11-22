import { useMemo, useState } from 'react';
import { ClipboardList, Activity, CheckCircle2, Plus, Search, SlidersHorizontal, CalendarDays } from 'lucide-react';
import StatCard from '../components/StatCard';
import { TASK_STATUSES } from '../data/taskOptions';
import { formatDueDate } from '../data/taskUtils';
import FocusNotes from '../components/FocusNotes';
import { computeTaskStats, toIsoDate } from '../data/taskStats';
import './pages.css';
import './pages-extras.css';

export default function Dashboard({ tasks, preferences, onNavigate, onStatusChange, onNewTask }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [taskSearch, setTaskSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const stats = useMemo(() => computeTaskStats(tasks), [tasks]);
  const todayIso = toIsoDate(new Date());
  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesStatus = activeFilter === 'All' || task.status === activeFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesSearch = task.title.toLowerCase().includes(taskSearch.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  }).slice(0, 5), [tasks, activeFilter, priorityFilter, taskSearch]);
  const filterItems = [
    { label: 'All tasks', value: 'All', count: stats.total },
    { label: 'In progress', value: 'In progress', count: stats.inProgress },
    { label: 'Completed', value: 'Completed', count: stats.completed },
  ];

  return (
    <div className="overview-page">
      <div className="overview-heading">
        <div>
          <h1>Your work, in focus.</h1>
          <p>Plan your day, stay organized, and celebrate small wins.</p>
        </div>
        <button type="button" className="overview-heading__new" onClick={onNewTask}>
          <Plus size={15} /> New task
        </button>
      </div>

      <FocusNotes />

      <section className="overview-stats" aria-label="Task overview">
        <StatCard label="Total tasks" value={stats.total} icon={ClipboardList} tone="total" />
        <StatCard label="In progress" value={stats.inProgress} icon={Activity} tone="progress" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="completed" />
      </section>

      <section className="overview-tasks" aria-label="My tasks">
        <div className="overview-tasks__heading">
          <div>
            <h2>My tasks</h2>
            <p>Manage and track everything in one place.</p>
          </div>
          <button type="button" className="overview-tasks__view" onClick={() => onNavigate('My Tasks')}>View all tasks <span>→</span></button>
        </div>

        <div className="overview-task-tools">
          <div className="overview-tabs" role="tablist" aria-label="Filter tasks by status">
            {filterItems.map((item) => (
              <button key={item.value} type="button" role="tab" aria-selected={activeFilter === item.value}
                className={activeFilter === item.value ? 'is-active' : ''} onClick={() => setActiveFilter(item.value)}>
                {item.label} <span>{item.count}</span>
              </button>
            ))}
          </div>
          <div className="overview-task-filters">
            <label className="overview-task-search">
              <Search size={14} />
              <input value={taskSearch} onChange={(event) => setTaskSearch(event.target.value)} placeholder="Find a task..." aria-label="Find a task" />
            </label>
            <label className="overview-priority-filter">
              <SlidersHorizontal size={13} />
              <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label="Filter by priority">
                <option value="All">Priority: All</option>
                <option value="High">Priority: High</option>
                <option value="Medium">Priority: Medium</option>
                <option value="Low">Priority: Low</option>
              </select>
            </label>
          </div>
        </div>

        {visibleTasks.length === 0 ? (
          <div className="overview-empty">
            <span><CalendarDays size={20} /></span>
            <strong>No tasks found</strong>
            <p>{tasks.length === 0 ? 'Create your first task to get started.' : 'Try changing your search or filters.'}</p>
            {tasks.length === 0 && <button type="button" onClick={() => onNavigate('My Tasks')}>Create a task <Plus size={14} /></button>}
          </div>
        ) : (
          <div className="overview-task-list">
            {visibleTasks.map((task) => <DashboardTaskRow key={task.id} task={task} onStatusChange={onStatusChange} />)}
          </div>
        )}
        <p className="overview-task-footnote">Showing up to 5 tasks · {todayIso}</p>
      </section>
    </div>
  );
}

function DashboardTaskRow({ task, onStatusChange }) {
  const statusTone = task.status === 'Completed' ? 'done' : task.status === 'In progress' ? 'progress' : 'todo';
  const priorityTone = task.priority.toLowerCase();
  return (
    <article className={`overview-task-row${task.status === 'Completed' ? ' is-completed' : ''}`}>
      <span className={`overview-task-row__mark ${statusTone}`} aria-hidden="true">{task.status === 'Completed' ? '✓' : ''}</span>
      <div className="overview-task-row__main">
        <strong>{task.title}</strong>
        <span>{task.category || 'Personal'} <i>·</i> {task.status}</span>
      </div>
      <span className={`overview-task-row__priority ${priorityTone}`}>{task.priority}</span>
      <span className="overview-task-row__date"><CalendarDays size={11} /> {formatDueDate(task.dueDate)}</span>
      <label className="sr-only" htmlFor={`overview-status-${task.id}`}>Update status for {task.title}</label>
      <select id={`overview-status-${task.id}`} value={task.status} onChange={(event) => onStatusChange(task.id, event.target.value)} aria-label={`Status for ${task.title}`}>
        {TASK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
      </select>
    </article>
  );
}
