import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { TASK_STATUSES } from '../data/taskOptions';
import { formatDueDate } from '../data/taskUtils';
import './TaskCard.css';
import './badges.css';

function statusClass(status) {
  if (status === 'In progress') return 'badge--inprogress';
  if (status === 'Completed') return 'badge--completed';
  return 'badge--todo';
}

function priorityClass(priority) {
  if (priority === 'High') return 'badge--high';
  if (priority === 'Medium') return 'badge--medium';
  return 'badge--low';
}

function isOverdue(task) {
  return task.status !== 'Completed' && task.dueDate < new Date().toISOString().slice(0, 10);
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const overdue = isOverdue(task);

  return (
    <article
      className={`task-card${task.status === 'Completed' ? ' task-card--completed' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card__body">
        <div className="task-card__top">
          <h3 className="task-card__title">{task.title}</h3>
        </div>

        {task.description && <p className="task-card__description">{task.description}</p>}

        <div className="task-card__meta">
          <span className={`badge ${statusClass(task.status)}`}>
            <span className="badge-dot" aria-hidden="true" />
            {task.status}
          </span>
          <span className={`badge ${priorityClass(task.priority)}`}>
            <span className="badge-dot" aria-hidden="true" />
            {task.priority} priority
          </span>
          {task.category && <span className="badge badge--category">{task.category}</span>}
          <span
            className={`task-card__due${overdue ? ' task-card__due--overdue' : ''}`}
            title={overdue ? 'This task is past its due date' : undefined}
          >
            <CalendarDays size={14} aria-hidden="true" />
            Due {formatDueDate(task.dueDate)}
            {overdue ? ' · overdue' : ''}
          </span>
        </div>
      </div>

      <div className="task-card__actions">
        <label className="sr-only" htmlFor={`status-${task.id}`}>
          Change status of {task.title}
        </label>
        <select
          id={`status-${task.id}`}
          className="task-card__status-select"
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="task-card__action task-card__action--edit"
          onClick={() => onEdit(task)}
          aria-label={`Edit task: ${task.title}`}
        >
          <Pencil size={15} />
        </button>

        <button
          type="button"
          className="task-card__action task-card__action--delete"
          onClick={() => onDelete(task)}
          aria-label={`Delete task: ${task.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}
