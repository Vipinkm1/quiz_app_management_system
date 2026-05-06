const GenericPage = ({ title }) => {
  return (
    <section className="page-shell generic-page">
      <div className="section-header-row">
        <h3>{title}</h3>
        <button className="action-btn" type="button">Create New</button>
      </div>
      <p className="muted-text">Demo content for {title}. You can plug real API data here later.</p>
      <div className="placeholder-grid">
        <article className="placeholder-card">Overview block</article>
        <article className="placeholder-card">Filters / Controls</article>
        <article className="placeholder-card">Table / List output</article>
      </div>
    </section>
  );
};

export default GenericPage;
