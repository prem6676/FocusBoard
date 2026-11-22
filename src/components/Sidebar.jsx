import { LayoutDashboard, CheckSquare, Calendar, Settings, Focus, X } from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Overview', page: 'Dashboard', icon: LayoutDashboard },
  { label: 'My tasks', page: 'My Tasks', icon: CheckSquare },
  { label: 'Calendar', page: 'Calendar', icon: Calendar },
  { label: 'Settings', page: 'Settings', icon: Settings },
];

export default function Sidebar({ open, activePage, onNavigate, onClose }) {
  return (
    <aside className={`sidebar${open ? ' sidebar--open' : ''}`} aria-label="Main navigation">
      <button type="button" className="sidebar__close" onClick={onClose} aria-label="Close navigation menu"><X size={20} /></button>
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon" aria-hidden="true"><Focus size={18} /></span>
        <div><div className="sidebar__brand-name">FocusBoard</div><div className="sidebar__brand-tag">Workspace</div></div>
      </div>
      <p className="sidebar__section-label">WORKSPACE</p>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ label, page, icon: Icon }) => {
          const active = page === activePage;
          return <button key={page} type="button" className={`sidebar__link${active ? ' sidebar__link--active' : ''}`}
            aria-current={active ? 'page' : undefined} onClick={() => onNavigate(page)}>
            <Icon size={17} aria-hidden="true" /><span>{label}</span>
          </button>;
        })}
      </nav>
      <div className="sidebar__footer">FocusBoard · v1.0</div>
    </aside>
  );
}
