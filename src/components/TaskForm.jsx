import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../data/taskOptions';
import './modals.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  status: STATUS_OPTIONS[0].value,
  priority: PRIORITY_OPTIONS[1].value,
  dueDate: '',
};

export default function TaskForm({ task, onSubmit, onCancel, defaultPriority = PRIORITY_OPTIONS[1].value }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        category: task.category || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
      });
    } else {
      setForm({ ...EMPTY_FORM, priority: defaultPriority });
    }
    setErrors({});
  }, [task, defaultPriority]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) {
      nextErrors.title = 'Task title is required.';
    }
    if (!form.dueDate) {
      nextErrors.dueDate = 'Due date is required.';
    }
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
    });
  };

  return (
    <div className="modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <div className="modal__header">
          <h2 id="task-form-title" className="modal__title">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button type="button" className="modal__close" onClick={onCancel} aria-label="Close form">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            <div className="field">
              <label className="field__label" htmlFor="task-title">
                Task Title <span className="field__hint">(required)</span>
              </label>
              <input
                id="task-title"
                type="text"
                className={`field__input${errors.title ? ' field__input--invalid' : ''}`}
                value={form.title}
                onChange={handleChange('title')}
                placeholder="e.g. Prepare sprint demo"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'task-title-error' : undefined}
                autoFocus
              />
              {errors.title && (
                <p id="task-title-error" className="field__error" role="alert">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="task-description">
                Description
              </label>
              <textarea
                id="task-description"
                className="field__textarea"
                value={form.description}
                onChange={handleChange('description')}
                placeholder="Add more context about this task..."
              />
            </div>

            <div className="field__row">
              <div className="field">
                <label className="field__label" htmlFor="task-status">
                  Status
                </label>
                <select
                  id="task-status"
                  className="field__select"
                  value={form.status}
                  onChange={handleChange('status')}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="task-priority">
                  Priority
                </label>
                <select
                  id="task-priority"
                  className="field__select"
                  value={form.priority}
                  onChange={handleChange('priority')}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="task-due-date">
                Due Date <span className="field__hint">(required)</span>
              </label>
              <input
                id="task-due-date"
                type="date"
                className={`field__input${errors.dueDate ? ' field__input--invalid' : ''}`}
                value={form.dueDate}
                onChange={handleChange('dueDate')}
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={errors.dueDate ? 'task-due-date-error' : undefined}
              />
              {errors.dueDate && (
                <p id="task-due-date-error" className="field__error" role="alert">
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
