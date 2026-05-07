import {
  Activity,
  CircleAlert,
  CircleCheckBig,
  Clock3,
  Image,
  Mic,
  Users,
  FolderTree,
  ClipboardList,
} from "lucide-react";

const ReportsPage = ({
  tasks,
  users,
  categories = [],
  subcategories = [],
}) => {
  const totalQuestions = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const highPriority = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const mediumPriority = tasks.filter(
    (task) => task.priority === "Medium"
  ).length;

  const lowPriority = tasks.filter(
    (task) => task.priority === "Low"
  ).length;

  const singleSelect = tasks.filter(
    (task) =>
      task.type === "Single Select"
  ).length;

  const multiSelect = tasks.filter(
    (task) =>
      task.type === "Multi Select"
  ).length;

  const trueFalse = tasks.filter(
    (task) => task.type === "True/False"
  ).length;

  const imageQuestions = tasks.filter(
    (task) => task.imagePreview
  ).length;

  const audioQuestions = tasks.filter(
    (task) => task.audioName
  ).length;

  const completionRate = totalQuestions
    ? Math.round(
      (completed / totalQuestions) *
      100
    )
    : 0;

  const categoryAnalytics = categories.map(
    (category) => {
      const count = tasks.filter(
        (task) =>
          task.categoryMappings?.some(
            (item) =>
              item.category ===
              category.name
          )
      ).length;

      return {
        name: category.name,
        count,
      };
    }
  );

  return (
    <section className="page-shell generic-page">
      <article className="hero-strip page-hero">
        <div>
          <p className="hero-kicker">
            Question Analytics
          </p>

          <h3>
            {completionRate}% completion
            rate
          </h3>

          <span>
            {completed} completed from{" "}
            {totalQuestions} total
            questions
          </span>
        </div>

        <div className="hero-tags">
          <span className="hero-mini-pill">
            <Users size={13} />
            {users.length} Users
          </span>

          <span className="hero-mini-pill">
            <CircleAlert size={13} />
            {highPriority} High
            Difficulty
          </span>
        </div>
      </article>

      <div className="metrics-grid">
        <article className="metric-card">
          <p>
            <Activity size={13} />
            Total Questions
          </p>

          <h3>{totalQuestions}</h3>

          <span>
            All added questions
          </span>
        </article>

        <article className="metric-card">
          <p>
            <FolderTree size={13} />
            Categories
          </p>

          <h3>{categories.length}</h3>

          <span>
            Total categories
          </span>
        </article>

        <article className="metric-card">
          <p>
            <ClipboardList size={13} />
            Sub Categories
          </p>

          <h3>
            {subcategories.length}
          </h3>

          <span>
            Total sub categories
          </span>
        </article>

        <article className="metric-card">
          <p>
            <Users size={13} />
            Users
          </p>

          <h3>{users.length}</h3>

          <span>
            Registered users
          </span>
        </article>
      </div>

      <div className="metrics-grid">
        <article className="metric-card">
          <p>
            <CircleCheckBig size={13} />
            Completed
          </p>

          <h3>{completed}</h3>

          <span>
            Completed questions
          </span>
        </article>

        <article className="metric-card">
          <p>
            <Clock3 size={13} />
            Pending
          </p>

          <h3>{pending}</h3>

          <span>
            Pending questions
          </span>
        </article>

        <article className="metric-card">
          <p>
            <Activity size={13} />
            In Progress
          </p>

          <h3>{inProgress}</h3>

          <span>
            Active questions
          </span>
        </article>

        <article className="metric-card">
          <p>
            <CircleAlert size={13} />
            High Priority
          </p>

          <h3>{highPriority}</h3>

          <span>
            Hard difficulty
          </span>
        </article>
      </div>

      <div className="metrics-grid">
        <article className="metric-card">
          <p>Low Difficulty</p>

          <h3>{lowPriority}</h3>

          <span>Easy questions</span>
        </article>

        <article className="metric-card">
          <p>Medium Difficulty</p>

          <h3>{mediumPriority}</h3>

          <span>
            Medium level questions
          </span>
        </article>

        <article className="metric-card">
          <p>Single Select</p>

          <h3>{singleSelect}</h3>

          <span>
            Single choice questions
          </span>
        </article>

        <article className="metric-card">
          <p>Multi Select</p>

          <h3>{multiSelect}</h3>

          <span>
            Multi choice questions
          </span>
        </article>
      </div>

      <div className="metrics-grid">
        <article className="metric-card">
          <p>True / False</p>

          <h3>{trueFalse}</h3>

          <span>
            Boolean questions
          </span>
        </article>

        <article className="metric-card">
          <p>
            <Image size={13} />
            With Image
          </p>

          <h3>{imageQuestions}</h3>

          <span>
            Questions containing image
          </span>
        </article>

        <article className="metric-card">
          <p>
            <Mic size={13} />
            With Audio
          </p>

          <h3>{audioQuestions}</h3>

          <span>
            Questions containing audio
          </span>
        </article>
      </div>

      <article className="card-panel report-summary">
        <h4 className="sub-head">
          Category Wise Questions
        </h4>

        <div className="table-card dashboard-table">
          <table className="admin-table compact-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Questions</th>
              </tr>
            </thead>

            <tbody>
              {categoryAnalytics.length ===
                0 ? (
                <tr>
                  <td colSpan={2}>
                    No category data
                    available.
                  </td>
                </tr>
              ) : (
                categoryAnalytics.map(
                  (item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>

                      <td>{item.count}</td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </article>

      <article className="card-panel report-summary">
        <h4 className="sub-head">
          Latest Questions
        </h4>

        <div className="table-card dashboard-table">
          <table className="admin-table compact-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Tags</th>
                <th>Status</th>
                <th>Difficulty</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    No questions added
                    yet.
                  </td>
                </tr>
              ) : (
                tasks
                  .slice(0, 5)
                  .map((task) => (
                    <tr key={task.id}>
                      <td>
                        {task.title
                          ?.replace(
                            /<[^>]+>/g,
                            ""
                          )
                          .slice(0, 50)}
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

                      <td>
                        {task.status}
                      </td>

                      <td>
                        {task.priority}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default ReportsPage;