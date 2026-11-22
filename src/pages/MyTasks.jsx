import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import StatCard from '../components/StatCard';
import FilterTabs from '../components/FilterTabs';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { computeTaskStats } from '../data/taskStats';
import { TASK_STATUSES, TASK_PRIORITIES } from '../data/taskOptions';
import { generateId } from '../data/taskUtils';

const FILTER_TABS = ['All', ...TASK_STATUSES];

export default function MyTasks({
  tasks,
  setTasks,
  initialFilters,
  search: globalSearch,
  onSearchChange,
  createTaskRequest,
  defaultPriority = 'Medium',
}) {
  const [localSearch, setLocalSearch] = useState(initialFilters?.search ?? '');
  const search = globalSearch ?? localSearch;
  const updateSearch = onSearchChange ?? setLocalSearch;
  const [statusFilter, setStatusFilter] = useState(initialFilters?.status ?? 'All');
  const [priorityFilter, setPriorityFilter] = useState(initialFilters?.priority ?? 'All');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);

  useEffect(() => {
    if (createTaskRequest > 0) {
      setEditingTask(null);
      setFormOpen(true);
    }
  }, [createTaskRequest]);

  const statistics = useMemo(() => computeTaskStats(tasks), [tasks]);

  const visibleTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch =
        normalizedSearch === '' || task.title.toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const filtersActive = search.trim() !== '' || statusFilter !== 'All' || priorityFilter !== 'All';

  const handleCreateTask = (formData) => {
    setTasks((current) => [{ ...formData, id: generateId() }, ...current]);
    setFormOpen(false);
  };

  const handleUpdateTask = (formData) => {
    setTasks((current) =>
      current.map((task) => (task.id === editingTask.id ? { ...task, ...formData } : task))
    );
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  const handleConfirmDelete = () => {
    setTasks((current) => current.filter((task) => task.id !== taskPendingDelete.id));
    setTaskPendingDelete(null);
  };

  const openNewTaskForm = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEditTaskForm = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const closeTaskForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const tabOptions = FILTER_TABS.map((tab) => ({
    value: tab,
    label: tab,
    count: tab === 'All' ? tasks.length : tasks.filter((task) => task.status === tab).length,
  }));

  return (
    <div className="pages">
      <div className="page-heading">
        <div>
          <h1 className="page-heading__title">My Tasks</h1>
          <p className="page-heading__subtitle">
            Track, organize and complete your work — everything is saved automatically.
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={openNewTaskForm}>
          <Plus size={18} aria-hidden="true" />
          Add Task
        </button>
      </div>

      <section aria-label="Task statistics">
        <div className="stat-grid">
          <StatCard
            label="Total Tasks"
            value={statistics.total}
            icon={ClipboardListIcon}
            tone="total"
          />
          <StatCard
            label="In Progress"
            value={statistics.inProgress}
            icon={ActivityIcon}
            tone="progress"
          />
          <StatCard
            label="Completed"
            value={statistics.completed}
            icon={CheckCircleIcon}
            tone="completed"
          />
          <StatCard
            label="Completion Percentage"
            value={`${statistics.percentage}%`}
            icon={GaugeIcon}
            tone="percentage"
            hint={statistics.percentage}
          />
        </div>
      </section>


      <section className="panel" aria-label="Tasks">
        <div className="panel__heading">
          <h2 className="panel__title">Tasks</h2>
          <span className="panel__count">
            {visibleTasks.length} of {tasks.length} shown
          </span>
        </div>

        <div className="task-list__toolbar">
          <FilterTabs options={tabOptions} active={statusFilter} onChange={setStatusFilter} />
          <div className="task-list__toolbar-right">
            <div className="task-list__priority-select">
              <label htmlFor="priority-filter">Priority</label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="All">All priorities</option>
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filtersActive && (
          <p className="task-list__results" role="status">
            Showing <strong>{visibleTasks.length}</strong> task
            {visibleTasks.length === 1 ? '' : 's'}
            {search.trim() && (
              <>
                {' '}
                matching <strong>&ldquo;{search.trim()}&rdquo;</strong>
              </>
            )}
          </p>
        )}

        <TaskList
          tasks={visibleTasks}
          filtersActive={filtersActive}
          onEdit={openEditTaskForm}
          onDelete={setTaskPendingDelete}
          onStatusChange={handleStatusChange}
        />
      </section>

      {formOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={closeTaskForm}
          defaultPriority={defaultPriority}
        />
      )}

      {taskPendingDelete && (
        <ConfirmDialog
          title="Delete this task?"
          message={
            <>
              Are you sure you want to delete{' '}
              <strong>&ldquo;{taskPendingDelete.title}&rdquo;</strong>? This action cannot be
              undone.
            </>
          }
          confirmLabel="Delete Task"
          onConfirm={handleConfirmDelete}
          onCancel={() => setTaskPendingDelete(null)}
        />
      )}
    </div>
  );
}

function ClipboardListIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...props}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6" />
      <path d="M9 16h3" />
    </svg>
  );
}

function ActivityIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...props}>
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}

function CheckCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function GaugeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...props}>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}
