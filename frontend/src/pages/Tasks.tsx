import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Circle, CheckCircle2, Clock, Calendar as CalendarIcon, Tag } from "lucide-react";
import { cn } from "../utils/cn";

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useAppContext();
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  const displayedTasks = tasks.filter(t => {
    if (filter === "pending") return t.status !== "completed";
    if (filter === "completed") return t.status === "completed";
    return true;
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Missions</h1>
        <div className="flex items-center gap-4">
          <div className="flex bg-panel rounded-lg p-1 border border-panel-hover">
            {(["all", "pending", "completed"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors",
                  filter === f ? "bg-bg-secondary text-text" : "text-text-secondary hover:text-text"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-accent hover:bg-accent-light text-bg px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <span>+</span> New Mission
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showAddForm && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTaskTitle.trim()) return;
              addTask({
                id: `t_${Date.now()}`,
                title: newTaskTitle,
                category: "development",
                priority: "medium",
                status: "pending",
              });
              setNewTaskTitle("");
              setShowAddForm(false);
            }} 
            className="mb-4 bg-panel p-4 rounded-xl border border-panel-hover flex gap-3"
          >
            <input 
              autoFocus
              type="text" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done?" 
              className="flex-1 bg-bg-secondary border border-panel-hover rounded-lg px-4 py-2 text-text text-sm focus:outline-none focus:border-accent"
            />
            <button type="submit" className="bg-accent hover:bg-accent-light text-bg px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Add Task
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-text-secondary hover:text-text px-3 py-2 text-sm font-medium">
              Cancel
            </button>
          </form>
        )}

        {displayedTasks.length > 0 ? (
          <div className="space-y-3">
            {displayedTasks.map(task => (
              <div 
                key={task.id} 
                className={cn(
                  "bg-panel p-5 rounded-xl border transition-all flex items-start gap-4",
                  task.status === "completed" ? "border-panel opacity-60" : "border-panel-hover hover:border-accent/50"
                )}
              >
                <button 
                  onClick={() => updateTask({ ...task, status: task.status === "completed" ? "pending" : "completed" })}
                  className="mt-0.5 text-text-muted hover:text-success transition-colors shrink-0"
                >
                  {task.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <h3 className={cn("text-lg font-medium transition-colors", task.status === "completed" ? "text-text-muted line-through" : "text-text")}>
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-bg-secondary text-text-secondary uppercase tracking-wider">
                      <Tag className="w-3 h-3" />
                      {task.category}
                    </span>
                    {task.deadline && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Due {task.deadline}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                      <Clock className="w-3.5 h-3.5" />
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-red-400 transition-all rounded-md"
                  title="Delete task"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-panel rounded-2xl border border-dashed border-panel-hover p-12 text-center">
            <CheckSquareIcon className="w-16 h-16 text-panel-hover mb-4" />
            <h3 className="text-xl font-bold text-text mb-2">No missions yet</h3>
            <p className="text-text-secondary max-w-sm">
              Create your first mission and start forging your day. Every great builder starts with a single task.
            </p>
            <button onClick={() => setShowAddForm(true)} className="mt-6 bg-accent hover:bg-accent-light text-bg font-semibold py-2.5 px-6 rounded-lg transition-colors">
              New Mission
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Temporary icon for empty state
function CheckSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
