import { Bell, Plus, Search, Menu, X } from 'lucide-react';
import './Header.css';

export default function Header({ search, onSearchChange, onNewTask, onMenuClick }) {
  return (
    <header className="header">
      <button
        type="button"
        className="header__menu"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <div className="header__search">
        <Search size={16} className="header__search-icon" aria-hidden="true" />
        <label htmlFor="task-search" className="sr-only">
          Search tasks by title
        </label>
        <input
          id="task-search"
          type="search"
          className="header__search-input"
          placeholder="Search tasks by title..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          autoComplete="off"
        />
        {search && (
          <button
            type="button"
            className="header__search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="header__spacer" />

      <button
        type="button"
        className="header__icon-button"
        aria-label="Notifications (1 unread)"
      >
        <Bell size={18} />
        <span className="header__notification-dot" aria-hidden="true" />
      </button>

      <button type="button" className="header__profile" aria-label="Account, Alex Morgan">
        <span className="header__avatar" aria-hidden="true">
          AM
        </span>
        <span>
          <span className="header__profile-name">Alex Morgan</span>
          <br />
          <span className="header__profile-role">Product Manager</span>
        </span>
      </button>

      <button type="button" className="header__new-task" onClick={onNewTask}>
        <Plus size={18} aria-hidden="true" />
        <span>New Task</span>
      </button>
    </header>
  );
}
