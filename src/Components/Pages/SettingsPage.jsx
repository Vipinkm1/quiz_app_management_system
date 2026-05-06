import { Bell, SlidersHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";

// const [settings, setSettings] = useState({
//   workspaceName: "",
//   defaultPriority: "",
//   notifications: "",
// });

const SettingsPage = ({ settings, onChange }) => {
  return (
    <section className="page-shell generic-page">
      <article className="hero-strip page-hero compact-hero">
        <div>
          <p className="hero-kicker">Workspace Controls</p>
          <h3>Settings</h3>
          <span>Configure behavior, defaults and notifications</span>
        </div>
        <span className="hero-avatar"><Sparkles size={16} /></span>
      </article>

      <article className="card-panel settings-grid polished-settings">
        <label>
          <span className="setting-label"><SlidersHorizontal size={13} /> Workspace Name</span>
          <input
            className="text-input"
            value={settings.workspaceName}
            onChange={(e) => onChange("workspaceName", e.target.value)}
          />
        </label>
        <label>
          <span className="setting-label"><SlidersHorizontal size={13} /> Default Priority</span>
          <select value={settings.defaultPriority} onChange={(e) => onChange("defaultPriority", e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label>
          <span className="setting-label"><Bell size={13} /> Notifications</span>
          <select value={settings.notifications} onChange={(e) => onChange("notifications", e.target.value)}>
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </label>
      </article>
    </section>
  );
};

export default SettingsPage;
