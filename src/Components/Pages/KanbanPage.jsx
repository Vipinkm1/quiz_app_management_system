import { KanbanSquare } from "lucide-react";

// const columns = statusesFromBackend;
const columns = [
  { key: "pending", title: "To Do" },
  { key: "in-progress", title: "In Progress" },
  { key: "completed", title: "Done" },
];

const priorityClass = (priority) => {
  if (priority === "High") return "priority-badge priority-high";
  if (priority === "Medium") return "priority-badge priority-medium";
  return "priority-badge priority-low";
};

const KanbanPage = ({ tasks }) => {
  return (
    <section className="page-shell generic-page">
      <article className="hero-strip page-hero compact-hero">
        <div>
          <p className="hero-kicker">Visual Workflow</p>
          <h3>Kanban Board</h3>
          <span>Track tasks by progress stage</span>
        </div>
        <span className="hero-avatar"><KanbanSquare size={16} /></span>
      </article>

      <div className="kanban-grid">
        {columns.map((column) => (
          <article className="kanban-column" key={column.key}>
            <h4>{column.title}</h4>
            <div className="kanban-list">
              {tasks
                .filter((task) => task.status === column.key)
                .map((task) => (
                  <div className="kanban-card" key={task.id}>
                    <p>{task.title}</p>
                    <span>{task.category}</span>
                    <div className="kanban-meta">
                      <em className={priorityClass(task.priority)}>{task.priority}</em>
                      <small>{task.due}</small>
                    </div>
                  </div>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default KanbanPage;
