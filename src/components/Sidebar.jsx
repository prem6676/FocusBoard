import {
  LayoutDashboard,
  CheckSquare,
  Inbox,
  Calendar,
  BarChart3,
  Settings,
  Focus,
  X,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Tasks', icon: CheckSquare },
  { label: 'Inbox', icon: Inbox },
  { label: 'Calendar', icon: Calendar },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, activePage, onNavigate, onClose }) {
  return (
    <aside className={`sidebar${open ? ' sidebar--open' : ''}`} aria-label="Main navigation">
      <button
        type="button"
        className="sidebar__close"
        onClick={onClose}
        aria-label="Close navigation menu"
      >
        <X size={20} />
      </button>

      <div className="sidebar__brand">
        <span className="sidebar__brand-icon" aria-hidden="true">
          <Focus size={18} />
        </span>
        <div>
          <div className="sidebar__brand-name">FocusBoard</div>
          <div className="sidebar__brand-tag">Task management</div>
        </div>
      </div>

      <p className="sidebar__section-label">Menu</p>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ label, icon: Icon }) => {
          const active = label === activePage;
          return (
            <button
              key={label}
              type="button"
              className={`sidebar__link${active ? ' sidebar__link--active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavigate(label)}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="sidebar__footer">FocusBoard &middot; v1.0</div>
    </aside>
  );
}
