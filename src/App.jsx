import { useState } from 'react';
import { Bell, Plus, Search, Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePreferences } from './hooks/usePreferences';
import { sampleTasks } from './data/sampleTasks';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import Inbox from './pages/Inbox';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './components/Header.css';
import './components/utilities.css';
import './App.css';

const STORAGE_KEY = 'focusboard_tasks';

export default function App() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, sampleTasks);
  const [preferences, setPreferences] = usePreferences();
  const [activePage, setActivePage] = useState('Dashboard');
  const [taskFilters, setTaskFilters] = useState(null);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [createTaskRequest, setCreateTaskRequest] = useState(0);

  const navigate = (page, filters) => {
    if (page === 'My Tasks' && filters) {
      setTaskFilters({ status: filters.status ?? 'All', priority: filters.priority ?? 'All' });
    } else if (page === 'My Tasks') {
      setTaskFilters(null);
    }
    setActivePage(page);
    setMenuOpen(false);
  };

  return (
    <div className={`dashboard${preferences.theme === 'dark' ? ' dashboard--dark' : ''}`}>
      <Sidebar
        open={menuOpen}
        activePage={activePage}
        onNavigate={navigate}
        onClose={() => setMenuOpen(false)}
      />
      {menuOpen && (
        <button
          type="button"
          className="dashboard__scrim"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="dashboard__main">
        <Header
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            if (value.trim()) navigate('My Tasks');
          }}
          onNewTask={() => {
            navigate('My Tasks');
            setCreateTaskRequest((current) => current + 1);
          }}
          onMenuClick={() => setMenuOpen(true)}
          onNotifications={() => navigate('Inbox')}
          onProfile={() => navigate('Settings')}
          displayName={preferences.displayName}
        />

        <main className="dashboard__content">
          {activePage === 'Dashboard' && (
            <Dashboard
              tasks={tasks}
              preferences={preferences}
              onNavigate={navigate}
              onStatusChange={handleStatusChange(setTasks)}
            />
          )}
          {activePage === 'My Tasks' && (
            <MyTasks
              tasks={tasks}
              setTasks={setTasks}
              initialFilters={taskFilters}
              search={search}
              onSearchChange={setSearch}
              createTaskRequest={createTaskRequest}
              defaultPriority={preferences.defaultPriority}
              key={`${taskFilters?.status ?? 'All'}-${taskFilters?.priority ?? 'All'}`}
            />
          )}
          {activePage === 'Inbox' && <Inbox tasks={tasks} onOpenTask={() => navigate('My Tasks', { status: 'All', priority: 'All' })} />}
          {activePage === 'Calendar' && <Calendar tasks={tasks} />}
          {activePage === 'Reports' && <Reports tasks={tasks} />}
          {activePage === 'Settings' && (
            <Settings
              preferences={preferences}
              setPreferences={setPreferences}
              onResetTasks={() => setTasks(sampleTasks)}
              onClearTasks={() => setTasks([])}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function handleStatusChange(setTasks) {
  return (taskId, newStatus) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };
}

function Header({ search, onSearchChange, onNewTask, onMenuClick, onNotifications, onProfile, displayName }) {
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

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

      <button type="button" className="header__icon-button" aria-label="Open inbox notifications" onClick={onNotifications}>
        <Bell size={18} />
        <span className="header__notification-dot" aria-hidden="true" />
      </button>

      <button type="button" className="header__profile" aria-label={`Account settings for ${displayName}`} onClick={onProfile}>
        <span className="header__avatar" aria-hidden="true">
          {initials}
        </span>
        <span>
          <span className="header__profile-name">{displayName}</span>
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
