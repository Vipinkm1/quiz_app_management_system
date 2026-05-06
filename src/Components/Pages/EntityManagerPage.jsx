import { useMemo, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

const EntityManagerPage = ({
  title,
  items,
  onAdd,
  onDelete,
  inputLabel = "Name",
  showParentSelect = false,
  parentLabel = "Category",
  parentOptions = [],
}) => {
  const [value, setValue] = useState("");

  const [editId, setEditId] = useState(null);

  const [selectedParent, setSelectedParent] =
    useState("");

  const submit = () => {
    const normalized = value.trim();

    if (!normalized) return;

    // EDIT MODE
    if (editId) {
      onAdd({
        id: editId,
        name: normalized,
        parent: selectedParent,
        isEdit: true,
      });

      setEditId(null);
    }

    // ADD MODE
    else {
      if (showParentSelect) {
        onAdd({
          name: normalized,
          parent: selectedParent,
        });
      } else {
        onAdd(normalized);
      }
    }

    setValue("");
  };

  const initials = useMemo(
    () =>
      title
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [title]
  );

  const visibleItems = showParentSelect
    ? selectedParent
      ? items.filter(
        (item) =>
          item.parent === selectedParent
      )
      : items
    : items;

  return (
    <section className="page-shell generic-page">
      {/* HERO */}

      <article className="hero-strip page-hero compact-hero">
        <div>
          <p className="hero-kicker">
            Manage Entities
          </p>

          <h3>{title}</h3>

          <span>
            {items.length} total records
          </span>
        </div>

        <span className="hero-avatar">
          {initials}
        </span>
      </article>

      {/* FORM */}

      <article className="card-panel">
        <div className="entity-form-stack">
          {showParentSelect ? (
            <div className="settings-grid">
              <label>
                {parentLabel}

                <select
                  value={selectedParent}
                  onChange={(e) =>
                    setSelectedParent(e.target.value)
                  }
                >
                  <option value="">
                    Select Category
                  </option>

                  {parentOptions.map((option) => (
                    <option
                      key={option.id}
                      value={option.name}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          <div className="inline-form">
            <input
              className="text-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Add ${inputLabel}`}
            />

            <button
              className="action-btn"
              type="button"
              onClick={submit}
            >
              <Plus size={14} />
              {editId ? "Update" : "Add"}
            </button>

            {editId ? (
              <button
                className="action-btn secondary-btn"
                type="button"
                onClick={() => {
                  setEditId(null);
                  setValue("");
                }}
              >
                <X size={14} />
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </article>

      {/* TABLE */}

      <article className="table-card dashboard-table">
        <table className="admin-table compact-table">
          <thead>
            <tr>
              <th>#</th>

              {showParentSelect ? (
                <th>{parentLabel}</th>
              ) : null}

              <th>{inputLabel}</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* EMPTY */}

            {visibleItems.length === 0 && (
              <tr>
                <td
                  colSpan={
                    showParentSelect ? 4 : 3
                  }
                >
                  <div className="empty-inline">
                    No records yet. Add your
                    first{" "}
                    {inputLabel.toLowerCase()}.
                  </div>
                </td>
              </tr>
            )}

            {/* ROWS */}

            {visibleItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                {showParentSelect ? (
                  <td>{item.parent}</td>
                ) : null}

                <td>{item.name}</td>

                <td>
                  <div className="table-actions">
                    {/* EDIT */}

                    <button
                      className="icon-btn"
                      type="button"
                      onClick={() => {
                        setValue(item.name);

                        setEditId(item.id);

                        if (
                          showParentSelect
                        ) {
                          setSelectedParent(
                            item.parent
                          );
                        }
                      }}
                    >
                      <Pencil size={14} />
                    </button>

                    {/* DELETE */}

                    <button
                      className="icon-btn danger-btn"
                      type="button"
                      onClick={() =>
                        onDelete(item.id)
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
};

export default EntityManagerPage;