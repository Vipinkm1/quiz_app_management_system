
import { Pencil, Trash2 } from "lucide-react";

const stripHtml = (value = "") =>
    value.replace(/<[^>]+>/g, "").trim();

const ListsPage = ({
    tasks,
    onEditTask,
    onDeleteTask,
}) => {
    return (
        <section className="page-shell generic-page">
            <article className="hero-strip page-hero compact-hero">
                <div>
                    <p className="hero-kicker">
                        Question Manager
                    </p>

                    <h3>All Questions</h3>

                    <span>
                        {tasks.length} total questions
                    </span>
                </div>

                <span className="hero-avatar">
                    QB
                </span>
            </article>

            <article className="table-card dashboard-table">
                <table className="admin-table compact-table">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Tags</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <div className="empty-inline">
                                        No questions added yet.
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>
                                        {stripHtml(task.title)}
                                    </td>

                                    <td>
                                        <div className="chip-row">
                                            {task.categoryMappings?.map(
                                                (item, index) => (
                                                    <span
                                                        className="chip"
                                                        key={index}
                                                    >
                                                        {item.category}
                                                        {" > "}
                                                        {item.subCategory}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </td>

                                    <td>{task.status}</td>

                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="ghost-btn"
                                                type="button"

                                                onClick={() => {
                                                    console.log(
                                                        "EDIT TASK DATA:",
                                                        task
                                                    );

                                                    onEditTask(task);
                                                }}


                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>

                                            <button
                                                className="icon-btn danger-btn"
                                                type="button"
                                                onClick={() =>
                                                    onDeleteTask(task.id)
                                                }
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </article>
        </section>
    );
};

export default ListsPage;
