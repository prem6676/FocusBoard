import { useState } from 'react';
import { RotateCcw, Trash2, User, Palette, Database } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { PRIORITY_OPTIONS } from '../data/taskOptions';
import './pages.css';
import './pages-extras.css';

export default function Settings({ preferences, setPreferences, onResetTasks, onClearTasks }) {
  const [confirmAction, setConfirmAction] = useState(null);

  const updatePreference = (field) => (event) => {
    setPreferences((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <div className="pages">
      <div className="page-heading">
        <div>
          <h1 className="page-heading__title">Settings</h1>
          <p className="page-heading__subtitle">
            Preferences are saved in your browser and persist across refreshes.
          </p>
        </div>
      </div>

      <section className="panel" aria-label="Profile preferences">
        <div className="panel__heading">
          <h2 className="panel__title">
            <User size={16} aria-hidden="true" /> Profile
          </h2>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="display-name">
            Display name
          </label>
          <input
            id="display-name"
            type="text"
            className="field__input"
            value={preferences.displayName}
            onChange={updatePreference('displayName')}
            placeholder="e.g. Alex Morgan"
            maxLength={40}
          />
          <p className="field-hint">Shown in the header and on your Dashboard welcome message.</p>
        </div>
      </section>

      <section className="panel" aria-label="Appearance preferences">
        <div className="panel__heading">
          <h2 className="panel__title">
            <Palette size={16} aria-hidden="true" /> Appearance
          </h2>
        </div>
        <div className="field">
          <span className="field__label" id="theme-label">
            Theme
          </span>
          <div className="theme-options" role="radiogroup" aria-labelledby="theme-label">
            {[
              { value: 'light', label: 'Light', hint: 'White content area with navy sidebar' },
              { value: 'dark', label: 'Dark', hint: 'Deep navy content area with navy sidebar' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={preferences.theme === option.value}
                className={`theme-option${preferences.theme === option.value ? ' theme-option--active' : ''}`}
                onClick={() => setPreferences((current) => ({ ...current, theme: option.value }))}
              >
                <span className="theme-option__name">{option.label}</span>
                <span className="theme-option__hint">{option.hint}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="default-priority">
            Default priority for new tasks
          </label>
          <select
            id="default-priority"
            className="field__select"
            value={preferences.defaultPriority}
            onChange={updatePreference('defaultPriority')}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="panel" aria-label="Task data management">
        <div className="panel__heading">
          <h2 className="panel__title">
            <Database size={16} aria-hidden="true" /> Task data
          </h2>
        </div>
        <p className="settings-note">
          These actions change your entire task board and cannot be undone. You will be asked to
          confirm before anything happens.
        </p>
        <div className="settings-actions">
          <button type="button" className="btn btn--secondary" onClick={() => setConfirmAction('reset')}>
            <RotateCcw size={16} aria-hidden="true" />
            Reset to sample tasks
          </button>
          <button type="button" className="btn btn--danger" onClick={() => setConfirmAction('clear')}>
            <Trash2 size={16} aria-hidden="true" />
            Clear all tasks
          </button>
        </div>
      </section>

      {confirmAction === 'reset' && (
        <ConfirmDialog
          title="Reset all tasks?"
          message="Your current task board will be replaced with the original sample tasks. This cannot be undone."
          confirmLabel="Reset Tasks"
          onConfirm={() => {
            onResetTasks();
            setConfirmAction(null);
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === 'clear' && (
        <ConfirmDialog
          title="Clear all tasks?"
          message="Every task will be permanently deleted from your board. This cannot be undone."
          confirmLabel="Clear All"
          onConfirm={() => {
            onClearTasks();
            setConfirmAction(null);
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
