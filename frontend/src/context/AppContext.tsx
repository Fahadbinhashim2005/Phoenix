import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Task, Goal, RoadmapNode, Project, User } from '../types';
import { mockTasks, mockGoals, mockRoadmap, mockProjects, mockUser } from '../data/mockState';

interface AppState {
  user: User;
  tasks: Task[];
  goals: Goal[];
  roadmap: RoadmapNode[];
  projects: Project[];
  
  // Actions
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  
  toggleRoadmapCheckpoint: (nodeId: string, checkpointIndex: number) => void;
  
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  
  resetData: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User>('phoenix_user', mockUser);
  const [tasks, setTasks] = useLocalStorage<Task[]>('phoenix_tasks', mockTasks);
  const [goals, setGoals] = useLocalStorage<Goal[]>('phoenix_goals', mockGoals);
  const [roadmap, setRoadmap] = useLocalStorage<RoadmapNode[]>('phoenix_roadmap', mockRoadmap);
  const [projects, setProjects] = useLocalStorage<Project[]>('phoenix_projects', mockProjects);

  // --- Tasks ---
  const addTask = (task: Task) => setTasks(prev => [...prev, task]);
  const updateTask = (updatedTask: Task) => setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  // --- Goals ---
  const addGoal = (goal: Goal) => setGoals(prev => [...prev, goal]);
  const updateGoal = (updatedGoal: Goal) => setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));

  // --- Roadmap ---
  const toggleRoadmapCheckpoint = (nodeId: string, checkpointIndex: number) => {
    setRoadmap(prev => prev.map(node => {
      if (node.id !== nodeId) return node;
      
      const newCheckpoints = [...node.checkpoints];
      newCheckpoints[checkpointIndex] = {
        ...newCheckpoints[checkpointIndex],
        done: !newCheckpoints[checkpointIndex].done
      };
      
      const completedCount = newCheckpoints.filter(c => c.done).length;
      const totalCount = newCheckpoints.length;
      const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : node.progress;
      
      // Auto-update status if progress changes
      let status = node.status;
      if (progress === 100) status = "Mastered";
      else if (progress > 0 && (status === "Not Started" || status === "Locked")) status = "Learning";
      
      return { ...node, checkpoints: newCheckpoints, progress, status };
    }));
  };

  // --- Projects ---
  const addProject = (project: Project) => setProjects(prev => [...prev, project]);
  const updateProject = (updatedProject: Project) => setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  const deleteProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));

  // --- Reset ---
  const resetData = () => {
    setUser(mockUser);
    setTasks(mockTasks);
    setGoals(mockGoals);
    setRoadmap(mockRoadmap);
    setProjects(mockProjects);
  };

  return (
    <AppContext.Provider value={{
      user, tasks, goals, roadmap, projects,
      addTask, updateTask, deleteTask,
      addGoal, updateGoal, deleteGoal,
      toggleRoadmapCheckpoint,
      addProject, updateProject, deleteProject,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
