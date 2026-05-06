import { useEffect, useMemo, useState } from "react";

const statusClass = (status) => {
  if (status === "completed") return "status-badge status-done";
  if (status === "in-progress") return "status-badge status-progress";
  return "status-badge status-pending";
};

const AnimatedMetric = ({ label, value, note }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.ceil(value / 20));
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <article className="metric-card" key={label}>
      <p>{label}</p>
      <h3>{displayValue}</h3>
      <span>{note}</span>
    </article>
  );
};

const Dashboards = ({ tasks, onOpenTasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const inProgress = tasks.filter((task) => task.status === "in-progress").length;
  const pending = tasks.filter((task) => task.status === "pending").length;

  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  const metrics = useMemo(
    () => [
      { title: "Total Tasks", value: total, note: "All created tasks" },
      { title: "Completed", value: completed, note: `${completionRate}% completion` },
      { title: "In Progress", value: inProgress, note: "Active execution" },
      { title: "Pending", value: pending, note: "Not started yet" },
    ],
    [total, completed, completionRate, inProgress, pending]
  );

  const recentTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);

  return (
    <section className="page-shell dashboard-shell">
      <article className="hero-strip">
        <div>
          <p className="hero-kicker">Today's Progress</p>
          <h3>{completionRate}% tasks completed</h3>
          <span>{completed} completed out of {total} total tasks</span>
        </div>
        <button className="action-btn" type="button" onClick={onOpenTasks}>Manage Tasks</button>
      </article>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <AnimatedMetric key={metric.title} label={metric.title} value={metric.value} note={metric.note} />
        ))}
      </div>

      <article className="table-card dashboard-table">
        <div className="section-header-row">
          <h3>Recent Tasks</h3>
          <button className="action-btn" type="button" onClick={onOpenTasks}>
            Open Tasks
          </button>
        </div>
        <table className="admin-table compact-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Category</th>
              <th>Status</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {recentTasks.map((task) => (
              <tr key={task.id}>
                <td dangerouslySetInnerHTML={{ __html: task.title }} />
                <td>{task.category}</td>
                <td><span className={statusClass(task.status)}>{task.status}</span></td>
                <td>{task.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
};

export default Dashboards;
