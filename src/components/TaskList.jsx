import { ClipboardList, FilterX } from 'lucide-react';
import TaskCard from './TaskCard';
import './TaskList.css';

export default function TaskList({ tasks, filtersActive, onEdit, onDelete, onStatusChange }) {
  return (
    <section aria-label="Task list">
      {tasks.length === 0 ? (
        <div className="task-list__empty">
          <span className="task-list__empty-icon" aria-hidden="true">
            {filtersActive ? <FilterX size={22} /> : <ClipboardList size={22} />}
          </span>
          <h3 className="task-list__empty-title">
            {filtersActive ? 'No matching tasks' : 'No tasks yet'}
          </h3>
          <p>
            {filtersActive
              ? 'No tasks match your current search and filters. Try a different keyword, status or priority.'
              : 'Create your first task using the New Task button to start organizing your work.'}
          </p>
        </div>
      ) : (
        <ul className="task-list__items">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
