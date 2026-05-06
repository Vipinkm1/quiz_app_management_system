import { useMemo, useState, useEffect, } from "react";
import {
  ChartColumn,
  CircleHelp,
  ClipboardList,
  FolderTree,
  Image,
  LayoutDashboard,
  ListChecks,
  Settings,
  Users,
  KanbanSquare,
} from "lucide-react";
import "./App.css";
import Sidebar from "./Components/Layout/Sidebar";
import Navbar from "./Components/Layout/Navbar";
import Dashboards from "./Components/Pages/Dashboards";
import TaskBuilder from "./Components/Pages/TaskBuilder";
import EntityManagerPage from "./Components/Pages/EntityManagerPage";
import ReportsPage from "./Components/Pages/ReportsPage";
import MediaLibraryPage from "./Components/Pages/MediaLibraryPage";
import SettingsPage from "./Components/Pages/SettingsPage";
import KanbanPage from "./Components/Pages/KanbanPage";
import ListsPage from "./Components/Pages/ListsPage";




const toEntity = (name) => ({ id: Date.now() + Math.random(), name });

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("tasks");
  // const [tasks, setTasks] = useState(seedTasks);
  const [categories, setCategories] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "categories"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });
  const [
    subcategories,
    setSubcategories,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        "subcategories"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });
  const [lists, setLists] =
    useState(() => {
      const saved =
        localStorage.getItem("lists");

      return saved
        ? JSON.parse(saved)
        : [];
    });
  const [users, setUsers] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [tasks, setTasks] = useState(() => {
    const saved =
      localStorage.getItem("tasks");

    return saved
      ? JSON.parse(saved)
      : [];
  });
  const [taskToEdit, setTaskToEdit] =
    useState(null);
  const [settings, setSettings] = useState({
    workspaceName: "Todo Admin Workspace",
    defaultPriority: "Medium",
    notifications: "Enabled",
  });

  const addTask = (task) => {
    setTasks((prev) => [{ ...task, id: Date.now(), createdAt: Date.now() }, ...prev]);
  };

  const updateTask = (taskId, updates) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)));
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };
  useEffect(() => {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "categories",
      JSON.stringify(categories)
    );
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(
      "subcategories",
      JSON.stringify(subcategories)
    );
  }, [subcategories]);

  useEffect(() => {
    localStorage.setItem(
      "lists",
      JSON.stringify(lists)
    );
  }, [lists]);

  const addEntity = (setter) => (data) => {
    setter((prev) => {
      // EDIT MODE
      if (
        typeof data === "object" &&
        data.isEdit
      ) {
        return prev.map((item) =>
          item.id === data.id
            ? {
              ...item,
              name: data.name,
              parent:
                data.parent || item.parent,
            }
            : item
        );
      }

      // OBJECT ADD
      if (typeof data === "object") {
        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            name: data.name,
            parent: data.parent,
          },
        ];
      }

      // STRING ADD
      return [
        ...prev,
        {
          id: Date.now() + Math.random(),
          name: data,
        },
      ];
    });
  };
  const deleteEntity = (setter) => (id) => setter((prev) => prev.filter((item) => item.id !== id));


  const menuItems = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        component: () => <Dashboards tasks={tasks} onOpenTasks={() => setActivePage("tasks")} />,
      },
      {
        id: "tasks",
        label: "Tasks",
        icon: ListChecks,
        component: () => (
          <TaskBuilder
            tasks={tasks}
            categories={categories}
            subcategories={subcategories}
            taskToEdit={taskToEdit}
            clearTaskToEdit={() =>
              setTaskToEdit(null)
            }
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        ),
      },
      {
        id: "categories",
        label: "Categories",
        icon: FolderTree,
        component: () => (
          <EntityManagerPage
            title="Categories"
            items={categories}
            onAdd={addEntity(setCategories)}
            onDelete={deleteEntity(setCategories)}
            inputLabel="Category"
          />
        ),
      },
      {
        id: "subcategories",
        label: "Sub Categories",
        icon: ClipboardList,
        component: () => (
          <EntityManagerPage
            title="Sub Categories"
            items={subcategories}
            onAdd={addEntity(setSubcategories)}
            onDelete={deleteEntity(setSubcategories)}
            inputLabel="Sub Category"
            showParentSelect
            parentLabel="Category"
            parentOptions={categories}
          />
        ),
      },
      {
        id: "lists",
        label: "Lists",
        icon: CircleHelp,
        component: () => (
          <ListsPage
            tasks={tasks}

            onEditTask={(task) => {
              console.log(
                "APP RECEIVED TASK:",
                task
              );

              setTaskToEdit(task);

              console.log(
                "SETTING ACTIVE PAGE"
              );

              setActivePage("tasks");
            }}




            onDeleteTask={deleteTask}
          />
        ),
      },
      {
        id: "users",
        label: "Users",
        icon: Users,
        component: () => (
          <EntityManagerPage
            title="Users"
            items={users}
            onAdd={addEntity(setUsers)}
            onDelete={deleteEntity(setUsers)}
            inputLabel="User Name"
          />
        ),
      },
      // {
      //   id: "kanban",
      //   label: "Kanban",
      //   icon: KanbanSquare,
      //   component: () => <KanbanPage tasks={tasks} />,
      // },
      {
        id: "reports",
        label: "Reports",
        icon: ChartColumn,
        component: () => <ReportsPage
          tasks={tasks}
          users={users}
          categories={categories}
          subcategories={subcategories}
        />
      },
      // {
      //   id: "media",
      //   label: "Media Library",
      //   icon: Image,
      //   component: () => (
      //     <MediaLibraryPage
      //       mediaItems={mediaItems}
      //       onAdd={(items) => setMediaItems((prev) => [...items, ...prev])}
      //       onDelete={(id) => setMediaItems((prev) => prev.filter((item) => item.id !== id))}
      //     />
      //   ),
      // },
      // {
      //   id: "settings",
      //   label: "Settings",
      //   icon: Settings,
      //   component: () => (
      //     <SettingsPage
      //       settings={settings}
      //       onChange={(key, value) => setSettings((prev) => ({ ...prev, [key]: value }))}
      //     />
      //   ),
      // },
    ],

    [
      tasks,
      categories,
      subcategories,
      lists,
      users,
      mediaItems,
      settings,
      taskToEdit,
    ]


  );


  const handlePageChange = (page) => {
    setActivePage(page);

    // reset edit mode
    if (page !== "tasks") {
      setTaskToEdit(null);
    }
  };



  const activeItem = menuItems.find((item) => item.id === activePage) ?? menuItems[0];
  const ActiveComponent = activeItem.component;

  return (
    <div className="admin-layout">
      <Sidebar
        menuItems={menuItems}
        activePage={activeItem.id}
        isOpen={isSidebarOpen}

        onSelect={handlePageChange}


      />
      <main className="main-panel">
        <Navbar title={activeItem.label} onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        <section className="content-panel">
          <ActiveComponent />
        </section>
      </main>
    </div>
  );
}

export default App;
