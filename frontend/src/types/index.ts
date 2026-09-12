export interface User {
  id: string;
  name: string;
  targetDate: string;
  careerGoal: string;
  stack: string[];
}

export interface Task {
  id: string;
  title: string;
  category: "development" | "dsa" | "health" | "routine" | "academics";
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
  deadline?: string;
  goalId?: string; // Links to a Goal if applicable
}

export interface Goal {
  id: string;
  title: string;
  level: "vision" | "longterm" | "monthly" | "weekly";
  parentId?: string; // Links to parent goal
  progress: number;
}

export interface Checkpoint {
  label: string;
  done: boolean;
}

export interface Resource {
  type: string;
  title: string;
  url: string;
}

export interface RoadmapNode {
  id: string;
  category: string;
  title: string;
  status: "Locked" | "Not Started" | "Learning" | "Practicing" | "Comfortable" | "Mastered";
  progress: number;
  confidence: "red" | "yellow" | "green";
  checkpoints: Checkpoint[];
  resources: Resource[];
}

export interface ProjectSection {
  frontend: number;
  backend: number;
  database: number;
  auth: number;
  deploy: number;
}

export interface Project {
  id: string;
  name: string;
  repoUrl?: string;
  deployUrl?: string;
  stack: string[];
  progress: number;
  sections?: ProjectSection;
}

export interface TimeBlock {
  start: string;
  end: string;
  title: string;
  category: "health" | "routine" | "dsa" | "academics" | "development";
}

export interface Schedule {
  weekday: TimeBlock[];
  weekend: TimeBlock[];
}
