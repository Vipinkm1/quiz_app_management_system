import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { AudioLines, CheckCircle2, ImageUp, Pencil, Plus, RotateCcw, Trash2, Upload } from "lucide-react";

const getEmptyForm = (categories, subcategories = []) => {
  const defaultCategory = "";
  const defaultSubCategory = "";

  return {
    title: "",
    description: "",
    hint: "",
    explanation: "",
    categoryMappings: [],
    priority: "Medium",
    due: "Today",
    status: "pending",
    type: "Single Select",
    marks: "10",
    imagePreview: "",
    audioName: "",
  };
};

const seedOptions = ["", ""];
const stripHtml = (value = "") => value.replace(/<[^>]+>/g, "").trim();
const statusClass = (status) => {
  if (status === "completed") return "status-badge status-done";
  if (status === "in-progress") return "status-badge status-progress";
  return "status-badge status-pending";
};

const priorityClass = (priority) => {
  if (priority === "High") return "priority-badge priority-high";
  if (priority === "Medium") return "priority-badge priority-medium";
  return "priority-badge priority-low";
};

const TaskBuilder = ({ tasks, categories, subcategories, taskToEdit, onAddTask, clearTaskToEdit, onUpdateTask, onDeleteTask }) => {

  console.log(
    "TASK BUILDER PROP:",
    taskToEdit
  );


  const [form, setForm] = useState(getEmptyForm(categories, subcategories));
  const [filter, setFilter] = useState("all");
  const [isEditing, setIsEditing] =
    useState(false);
  const [editId, setEditId] = useState(null);
  const [options, setOptions] = useState(seedOptions);
  // MULTI CATEGORY TAGGING
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    selectedSubCategory,
    setSelectedSubCategory,
  ] = useState("");
  const [
    correctAnswers,
    setCorrectAnswers,
  ] = useState([]);
  const [audioSupport, setAudioSupport] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [subCategoryDraft, setSubCategoryDraft] = useState("");
  const [selectedSubCategoryParent, setSelectedSubCategoryParent] = useState("");
  const [subCategoryMap, setSubCategoryMap] = useState({});

  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const optionInputRefs = useRef([]);
  const pendingFocusRef = useRef(null);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };


  const editor = useEditor({
    extensions: [StarterKit],

    content: "",

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      setForm((prev) => ({
        ...prev,
        title: editor.getHTML(),
      }));
    },
  });



  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const filteredSubCategories =
    useMemo(() => {
      return subcategories.filter(
        (subCategory) =>
          subCategory.parent ===
          selectedCategory
      );
    }, [
      subcategories,
      selectedCategory,
    ]);

  useEffect(() => {
    if (!form.category) {
      setForm((prev) => ({
        ...prev,
        subCategory: "",
      }));
    }
  }, [form.category]);

  useEffect(() => {
    if (pendingFocusRef.current === null) return;
    optionInputRefs.current[pendingFocusRef.current]?.focus();
    pendingFocusRef.current = null;
  }, [options.length]);

  const clearForm = () => {
    setForm(getEmptyForm(categories, subcategories));
    setEditId(null);
    setOptions(seedOptions);
    setCorrectAnswers([]);
    clearTaskToEdit?.();
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (audioInputRef.current) audioInputRef.current.value = "";
    editor?.commands.setContent("");
  };

  const addSubCategory = () => {
    const value = subCategoryDraft.trim();
    if (!value) return;
    setSubCategoryMap((prev) => {
      const existing = prev[selectedSubCategoryParent] ?? [];
      return { ...prev, [selectedSubCategoryParent]: [...existing, value] };
    });
    setSubCategoryDraft("");
  };
  // ADD CATEGORY TAG
  const addCategoryMapping =
    () => {
      if (
        !selectedCategory ||
        !selectedSubCategory
      )
        return;

      const exists =
        form.categoryMappings?.some(
          (item) =>
            item.category ===
            selectedCategory &&
            item.subCategory ===
            selectedSubCategory
        );

      if (exists) return;

      setForm((prev) => ({
        ...prev,

        categoryMappings: [
          ...(prev.categoryMappings ||
            []),

          {
            category:
              selectedCategory,

            subCategory:
              selectedSubCategory,
          },
        ],
      }));

      setSelectedSubCategory("");
    };

  // REMOVE CATEGORY TAG
  const removeCategoryMapping =
    (index) => {
      setForm((prev) => ({
        ...prev,

        categoryMappings:
          prev.categoryMappings.filter(
            (_, i) => i !== index
          ),
      }));
    };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleChange("imagePreview", String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleChange("audioName", file.name);
  };

  const addOption = () => {
    if (options.length >= 5) return;
    setOptions((prev) => [...prev, ""]);
    pendingFocusRef.current = options.length;
  };

  const updateOption = (index, value) => {
    setOptions((prev) => prev.map((item, i) => (i === index ? value : item)));
  };



  const handleSave = () => {
    if (!form.title.trim()) return;

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      hint: form.hint.trim(),
      explanation: form.explanation.trim(),
      options,
      correctAnswers,
      audioSupport,
    };

    if (editId) {
      onUpdateTask(editId, payload);
      clearForm();
      return;
    }

    onAddTask(payload);
    clearForm();
  };


  // const handleEdit = (task) => {

  //   console.log( "HANDLE EDIT DATA:", task );
  //   setEditId(task.id);

  //   const nextForm = {
  //     ...getEmptyForm(
  //       categories,
  //       subcategories
  //     ),

  //     title: task.title || "",

  //     description:
  //       task.description || "",

  //     hint: task.hint || "",

  //     explanation:
  //       task.explanation || "",

  //     category:
  //       task.category || "",

  //     subCategory:
  //       task.subCategory || "",

  //     priority:
  //       task.priority || "Medium",

  //     due: task.due || "Today",

  //     status:
  //       task.status || "pending",

  //     type:
  //       task.type ||
  //       "Single Select",

  //     marks: task.marks || "10",

  //     imagePreview:
  //       task.imagePreview || "",

  //     audioName:
  //       task.audioName || "",
  //   };

  //   setForm(nextForm);

  //   setOptions(
  //     task.options?.length
  //       ? task.options
  //       : seedOptions
  //   );

  //   setCorrectOption(
  //     Number.isInteger(
  //       task.correctOption
  //     )
  //       ? task.correctOption
  //       : 0
  //   );

  //   setAudioSupport(
  //     task.audioSupport ?? true
  //   );

  //   // IMPORTANT
  //   // setTimeout(() => {
  //   //   editor?.commands.setContent(
  //   //     task.title || ""
  //   //   );
  //   // }, 0);
  // };




  useEffect(() => {

    console.log(
      "USE EFFECT RUN:",
      taskToEdit
    );


    if (!taskToEdit || !editor)
      return;

    setIsEditing(true);

    setEditId(taskToEdit.id);

    setForm({
      ...getEmptyForm(
        categories,
        subcategories
      ),

      ...taskToEdit,
    });

    setOptions(
      taskToEdit.options?.length
        ? taskToEdit.options
        : seedOptions
    );

    setCorrectAnswers(
      taskToEdit.correctAnswers || []
    );

    setAudioSupport(
      taskToEdit.audioSupport ??
      true
    );

    editor.commands.setContent(
      taskToEdit.title || ""
    );

    setTimeout(() => {
      setIsEditing(false);
    }, 100);
  }, [taskToEdit, editor]);




  // onUpdate: ({ editor }) => {
  //   if (isEditing) return;

  //   setForm((prev) => ({
  //     ...prev,
  //     title: editor.getHTML(),
  //   }));
  // },




  return (
    <section className="task-builder">
      <div className="builder-toolbar">
        <p className="crumbs">Questions &gt; {editId ? "Edit Question" : "Add New Question"}</p>
        <div className="toolbar-actions">
          {/* <button className="ghost-btn" type="button">Preview</button> */}
          <button className="action-btn" type="button" onClick={handleSave}>{editId ? "Update" : "Save"}</button>
          <button className="ghost-btn" type="button" onClick={clearForm}>Save &amp; Add Another</button>
        </div>
      </div>

      <div className="builder-grid">
        <section className="builder-main card-panel">
          <h3>Question Details</h3>

          <label className="field-label">Question Text</label>
          <div className="editor-shell">
            <div className="editor-toolbar">
              <button className="ghost-btn" type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
              <button className="ghost-btn" type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
              <button className="ghost-btn" type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullet</button>
              <button className="ghost-btn" type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbered</button>
              <button className="ghost-btn" type="button" onClick={() => editor?.chain().focus().setParagraph().run()}>P</button>
            </div>
            <EditorContent editor={editor} className="question-editor" />
          </div>

          <div className="media-row">
            <div className="upload-box">
              <p>Question Image (Optional)</p>
              <div className="upload-modern">
                <div className="upload-head">
                  <ImageUp size={16} />
                  <span>Image Upload</span>
                </div>
                {form.imagePreview ? (
                  <img src={form.imagePreview} alt="Question preview" className="task-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={18} />
                    <span>Drop image here or choose file</span>
                  </div>
                )}
                <label className="file-btn">
                  Choose Image
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="file-input-hidden" />
                </label>
                <small className="upload-note">PNG, JPG up to 5MB</small>
              </div>
            </div>
            <div className="upload-box">
              <p>Question Audio (Optional)</p>
              <div className="upload-modern">
                <div className="upload-head">
                  <AudioLines size={16} />
                  <span>Audio Upload</span>
                </div>
                <div className="upload-placeholder">
                  <Upload size={18} />
                  <span>{form.audioName || "Drop audio here or choose file"}</span>
                </div>
                <label className="file-btn">
                  Choose Audio
                  <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioChange} className="file-input-hidden" />
                </label>
                <small className="upload-note">MP3, M4A, WAV up to 5MB</small>
              </div>
            </div>
          </div>

          <label className="field-label" htmlFor="task-hint">Hint (Optional)</label>
          <textarea
            id="task-hint"
            className="text-area"
            rows={3}
            value={form.hint}
            onChange={(e) => handleChange("hint", e.target.value)}
            placeholder="Add optional hint"
          />


          <h4 className="sub-head">
            Options
          </h4>

          <div className="options-wrap">

            {/* SINGLE SELECT */}

            {form.type ===
              "Single Select" &&
              options.map(
                (option, index) => (
                  <div
                    className="option-row"
                    key={index}
                  >
                    <input
                      type="radio"
                      checked={correctAnswers.includes(
                        index
                      )}
                      onChange={() =>
                        setCorrectAnswers([
                          index,
                        ])
                      }
                      name="correct-answer"
                    />

                    <input
                      className="text-input"
                      value={option}
                      ref={(el) => {
                        optionInputRefs.current[
                          index
                        ] = el;
                      }}
                      onChange={(e) =>
                        updateOption(
                          index,
                          e.target.value
                        )
                      }
                    />

                    <button
                      className="icon-btn danger-btn"
                      type="button"
                      onClick={() =>
                        removeOption(index)
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              )}

            {/* MULTI SELECT */}

            {form.type ===
              "Multi Select" &&
              options.map(
                (option, index) => (
                  <div
                    className="option-row"
                    key={index}
                  >
                    <input
                      type="checkbox"
                      checked={correctAnswers.includes(
                        index
                      )}
                      onChange={(e) => {
                        if (
                          e.target.checked
                        ) {
                          setCorrectAnswers(
                            [
                              ...correctAnswers,
                              index,
                            ]
                          );
                        } else {
                          setCorrectAnswers(
                            correctAnswers.filter(
                              (item) =>
                                item !== index
                            )
                          );
                        }
                      }}
                    />

                    <input
                      className="text-input"
                      value={option}
                      ref={(el) => {
                        optionInputRefs.current[
                          index
                        ] = el;
                      }}
                      onChange={(e) =>
                        updateOption(
                          index,
                          e.target.value
                        )
                      }
                    />

                    <button
                      className="icon-btn danger-btn"
                      type="button"
                      onClick={() =>
                        removeOption(index)
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              )}

            {/* TRUE FALSE */}

            {form.type ===
              "True/False" && (
                <>
                  {["True", "False"].map(
                    (option, index) => (
                      <div
                        className="option-row"
                        key={index}
                      >
                        <input
                          type="radio"
                          checked={correctAnswers.includes(
                            index
                          )}
                          onChange={() =>
                            setCorrectAnswers([
                              index,
                            ])
                          }
                        />

                        <input
                          className="text-input"
                          value={option}
                          disabled
                        />
                      </div>
                    )
                  )}
                </>
              )}

            {/* ADD OPTION BUTTON */}

            {form.type !==
              "True/False" && (
                <>
                  <button
                    className="ghost-btn"
                    type="button"
                    onClick={addOption}
                  >
                    + Add Option
                  </button>

                  <p className="muted-text">
                    Min 2 - Max 5 options
                  </p>
                </>
              )}
          </div>

          <label className="field-label" htmlFor="task-explanation">Explanation (Optional)</label>
          <textarea
            id="task-explanation"
            className="text-area"
            rows={3}
            value={form.explanation}
            onChange={(e) => handleChange("explanation", e.target.value)}
            placeholder="Explain the correct answer"
          />

          {/* <button className="collapse-btn" type="button" onClick={() => setAdvancedOpen((prev) => !prev)}>
            Advanced Settings (Marks, Difficulty, Time, Status)
          </button> */}
          {/* {advancedOpen ? (
            <div className="settings-grid">
              <label>
                Time Limit
                <select value={form.due} onChange={(e) => handleChange("due", e.target.value)}>
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>This Week</option>
                  <option>Done</option>
                </select>
              </label>
              <label>
                Marks
                <input className="text-input" value={form.marks} onChange={(e) => handleChange("marks", e.target.value)} />
              </label>
            </div>
          ) : null} */}

          {/* <h4 className="sub-head">Question List</h4>
          <div className="table-controls">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div> */}

          {/* <article className="table-card dashboard-table">
            <table className="admin-table compact-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{stripHtml(task.title)}</td>
                    <td>{task.category}</td>
                    <td><span className={priorityClass(task.priority)}>{task.priority}</span></td>
                    <td><span className={statusClass(task.status)}>{task.status}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="ghost-btn" type="button" onClick={() => handleEdit(task)}>
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          className="ghost-btn"
                          type="button"
                          onClick={() =>
                            onUpdateTask(task.id, {
                              status: task.status === "completed" ? "pending" : "completed",
                              due: task.status === "completed" ? "Today" : "Done",
                            })
                          }
                        >
                          {task.status === "completed" ? <RotateCcw size={14} /> : <CheckCircle2 size={14} />}
                          {task.status === "completed" ? "Reopen" : "Complete"}
                        </button>
                        <button className="icon-btn danger-btn" type="button" onClick={() => onDeleteTask(task.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article> */}
        </section>

        <aside className="builder-side">
          {/* <article className="card-panel">
            <h3>Categories</h3>
            <div className="chip-row">
              {categories.slice(0, 3).map((category) => (
                <span className="chip" key={category.id}>{category.name}</span>
              ))}
            </div>
            <button className="link-btn" type="button">+ Create New Category</button>
          </article> */}
          {/* 
          <article className="card-panel">
            <h3>Sub Categories</h3>
            <div className="settings-grid">
              <label>
                Category
                <select
                  value={selectedSubCategoryParent}
                  onChange={(e) => setSelectedSubCategoryParent(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <div className="inline-form">
                <input
                  className="text-input"
                  value={subCategoryDraft}
                  onChange={(e) => setSubCategoryDraft(e.target.value)}
                  placeholder="Add sub category"
                />
                <button className="action-btn" type="button" onClick={addSubCategory}>
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>
            <div className="chip-row">
              {(subCategoryMap[selectedSubCategoryParent] ?? []).map((sub, index) => (
                <span className="chip" key={`${selectedSubCategoryParent}-${sub}-${index}`}>{sub}</span>
              ))}
            </div>
            <button className="link-btn" type="button">+ Create New Sub Category</button>
          </article> */}

          <article className="card-panel">
            <h3>Question Settings</h3>
            <div className="settings-grid">
              <div className="settings-grid">
                <label>
                  Category

                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(
                        e.target.value
                      );

                      setSelectedSubCategory(
                        ""
                      );
                    }}
                  >
                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.name}
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  Sub Category

                  <select
                    value={selectedSubCategory}
                    onChange={(e) =>
                      setSelectedSubCategory(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Sub Category
                    </option>

                    {filteredSubCategories.map(
                      (subCategory) => (
                        <option
                          key={subCategory.id}
                          value={
                            subCategory.name
                          }
                        >
                          {subCategory.name}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>

              <button
                className="file-btn"
                type="button"
                onClick={
                  addCategoryMapping
                }
              >
                + Add Tag
              </button>

              <div className="chip-row">
                {form.categoryMappings?.map(
                  (item, index) => (
                    <div
                      className="chip"
                      key={index}
                    >
                      {item.category} &gt;{" "}
                      {item.subCategory}

                      <button
                        type="button"
                        className="cross"
                        onClick={() =>
                          removeCategoryMapping(
                            index
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
              <label>
                Difficulty
                <select value={form.priority} onChange={(e) => handleChange("priority", e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <label>
                Question Type
                <select value={form.type} onChange={(e) => handleChange("type", e.target.value)}>
                  <option>Single Select</option>
                  <option>Multi Select</option>
                  <option>True/False</option>
                </select>
              </label>
              <label>
                Marks
                <input className="text-input" value={form.marks} onChange={(e) => handleChange("marks", e.target.value)} />
              </label>
              <label>
                Status
                <select value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
            </div>
          </article>

          <article className="card-panel muted-card">
            <h3>User Audio Support (During App Usage)</h3>
            <div className="toggle-line">
              <input type="checkbox" checked={audioSupport} onChange={(e) => setAudioSupport(e.target.checked)} />
              <span>Allow users to upload audio</span>
            </div>
            <ul>
              <li>Allowed formats: MP3, M4A, WAV</li>
              <li>Max size: 5MB</li>
              <li>Duration: Up to 60 seconds</li>
            </ul>
          </article>

          <article className="card-panel future-card">
            <h3>Future Enhancements (Planned)</h3>
            <ul>
              <li>Support more question types</li>
              <li>Add media in options</li>
              <li>Question tagging and advanced search</li>
              <li>Bulk upload and export questions</li>
            </ul>
            <button className="link-btn" type="button">View Roadmap</button>
          </article>
        </aside>
      </div>
    </section>
  );
};

export default TaskBuilder;


