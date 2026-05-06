import { useRef } from "react";
import { ImageUp, Trash2 } from "lucide-react";

const MediaLibraryPage = ({ mediaItems, onAdd, onDelete }) => {
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const mapped = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type || "unknown",
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }));
    onAdd(mapped);
    e.target.value = "";
  };

  return (
    <section className="page-shell generic-page">
      <article className="hero-strip page-hero compact-hero">
        <div>
          <p className="hero-kicker">Asset Manager</p>
          <h3>Media Library</h3>
          <span>{mediaItems.length} files uploaded</span>
        </div>
        <button className="action-btn" type="button" onClick={openPicker}><ImageUp size={14} /> Upload Files</button>
      </article>
      <input ref={inputRef} type="file" multiple hidden onChange={handleFiles} />

      <article className="table-card dashboard-table">
        <table className="admin-table compact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mediaItems.length === 0 && (
              <tr>
                <td colSpan={4}><div className="empty-inline">No media uploaded yet. Start by uploading your first file.</div></td>
              </tr>
            )}
            {mediaItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.size}</td>
                <td>
                  <button className="icon-btn danger-btn" type="button" onClick={() => onDelete(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
};

export default MediaLibraryPage;
