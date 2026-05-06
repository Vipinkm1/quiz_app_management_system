import { Bell, PanelLeftClose, Save, Search } from "lucide-react";

const Navbar = ({ onToggleSidebar, title }) => {
  return (
    <header className="navbar">
      <div className="nav-left">
        <button className="menu-btn" onClick={onToggleSidebar} type="button" aria-label="Toggle sidebar">
          <PanelLeftClose size={18} />
        </button>
        <div>
          <p className="nav-kicker">Workspace</p>
          <h2 className="navbar-title">{title}</h2>
        </div>
      </div>
      <div className="nav-actions">
        <span className="nav-chip"><Search size={12} /> Smart Search</span>
        <span className="nav-chip"><Bell size={12} /> Alerts</span>
        <button className="action-btn" type="button">
          <Save size={14} />
          Quick Save
        </button>
      </div>
    </header>
  );
};

export default Navbar;
