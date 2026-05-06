const Sidebar = ({ menuItems, activePage, onSelect, isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <h1 className="sidebar-title">Quiz Admin</h1>
      <p className="sidebar-subtitle">Control Center</p>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${activePage === item.id ? "active" : ""}`}
            onClick={() => onSelect(item.id)}
            type="button"
          >
            {item.icon ? <item.icon size={17} className="sidebar-icon" /> : null}
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-tip">
        <p>Quick Tip</p>
        <span>Keep categories clean for faster task filtering.</span>
      </div>
    </aside>
  );
};

export default Sidebar;
