import type { User, Task, RoadmapNode, Project, Schedule, Goal } from "../types";

export const mockUser: User = {
  id: "u1",
  name: "Fahad",
  targetDate: "2027-04-30",
  careerGoal: "Senior Software Engineer",
  stack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
};

export const mockTasks: Task[] = [
  { id: "t1", title: "Complete Phase 1 UI", category: "development", priority: "high", status: "in_progress", deadline: "2026-09-14" },
  { id: "t2", title: "Solve Two Sum", category: "dsa", priority: "medium", status: "completed" },
  { id: "t3", title: "College Assignment", category: "academics", priority: "high", status: "pending", deadline: "2026-09-15" },
];

export const mockRoadmap: RoadmapNode[] = [
  {
    id: "r1", category: "Frontend", title: "HTML & CSS", status: "Mastered", progress: 100, confidence: "green",
    checkpoints: [{ label: "Semantic HTML", done: true }, { label: "Flexbox & Grid", done: true }],
    resources: [{ type: "MDN", title: "HTML Basics", url: "#" }]
  },
  {
    id: "r2", category: "Frontend", title: "JavaScript", status: "Comfortable", progress: 85, confidence: "green",
    checkpoints: [{ label: "ES6+ Syntax", done: true }, { label: "Promises & Async", done: true }, { label: "DOM Manipulation", done: true }],
    resources: [{ type: "MDN", title: "JS Guide", url: "#" }]
  },
  {
    id: "r3", category: "Practical", title: "Projects (Vanilla)", status: "Comfortable", progress: 100, confidence: "green",
    checkpoints: [{ label: "Built a weather app", done: true }],
    resources: []
  },
  {
    id: "r4", category: "Tools", title: "CLI", status: "Practicing", progress: 60, confidence: "yellow",
    checkpoints: [{ label: "Navigating file system", done: true }, { label: "File manipulation", done: false }],
    resources: []
  },
  {
    id: "r5", category: "Tools", title: "Git/GitHub", status: "Practicing", progress: 50, confidence: "yellow",
    checkpoints: [{ label: "Commit & Push", done: true }, { label: "Branching & Merging", done: false }],
    resources: []
  },
  {
    id: "r6", category: "Frontend", title: "React", status: "Learning", progress: 40, confidence: "yellow",
    checkpoints: [{ label: "Components & Props", done: true }, { label: "Hooks (useState, useEffect)", done: true }, { label: "Context API", done: false }],
    resources: [{ type: "React Docs", title: "React.dev", url: "#" }]
  },
  {
    id: "r7", category: "Backend", title: "Node.js/Express", status: "Not Started", progress: 0, confidence: "red",
    checkpoints: [{ label: "Basic Server", done: false }, { label: "Routing & Middleware", done: false }],
    resources: []
  },
  {
    id: "r8", category: "Backend", title: "APIs", status: "Locked", progress: 0, confidence: "red",
    checkpoints: [{ label: "REST Architecture", done: false }, { label: "JSON handling", done: false }],
    resources: []
  },
  {
    id: "r9", category: "Database", title: "PostgreSQL", status: "Locked", progress: 0, confidence: "red",
    checkpoints: [{ label: "Tables & Queries", done: false }, { label: "Relations & Joins", done: false }],
    resources: []
  },
  {
    id: "r10", category: "Backend", title: "Authentication", status: "Locked", progress: 0, confidence: "red",
    checkpoints: [{ label: "JWT basics", done: false }, { label: "Password hashing", done: false }],
    resources: []
  },
  {
    id: "r11", category: "DevOps", title: "Deployment", status: "Locked", progress: 0, confidence: "red",
    checkpoints: [{ label: "Vercel Frontend", done: false }, { label: "Railway Backend", done: false }],
    resources: []
  },
  {
    id: "r12", category: "DevOps", title: "Docker", status: "Locked", progress: 0, confidence: "red",
    checkpoints: [{ label: "Dockerfile basics", done: false }, { label: "Docker Compose", done: false }],
    resources: []
  },
  {
    id: "r13", category: "Practical", title: "Full-stack Projects", status: "Locked", progress: 0, confidence: "red",
    checkpoints: [{ label: "IV Management Platform", done: false }],
    resources: []
  },
  {
    id: "r14", category: "Advanced", title: "AI/ML", status: "Locked", progress: 0, confidence: "red",
    checkpoints: [{ label: "Prompt Engineering", done: false }, { label: "LLM Integration", done: false }],
    resources: []
  },
];

export const mockProjects: Project[] = [
  {
    id: "p1", name: "IV Management Platform", stack: ["React", "TS", "Node", "PostgreSQL", "Docker"], progress: 30,
    sections: { frontend: 70, backend: 10, database: 20, auth: 0, deploy: 0 }
  },
  {
    id: "p2", name: "Student Productivity Platform", stack: ["React", "Firebase"], progress: 80,
  }
];

export const mockSchedule: Schedule = {
  weekday: [
    { start: "05:00", end: "05:55", title: "Workout", category: "health" },
    { start: "05:55", end: "06:25", title: "Get Ready", category: "routine" },
    { start: "06:25", end: "06:55", title: "DSA Warm-up", category: "dsa" },
    { start: "07:15", end: "19:30", title: "College", category: "academics" },
    { start: "20:30", end: "21:45", title: "Dev — Phoenix/IV Platform", category: "development" },
    { start: "22:00", end: "23:00", title: "DSA / Academics", category: "dsa" },
  ],
  weekend: [
    { start: "06:00", end: "06:45", title: "Workout", category: "health" },
    { start: "07:15", end: "09:15", title: "DSA Deep Work", category: "dsa" },
    { start: "09:30", end: "11:30", title: "Project Dev", category: "development" },
    { start: "13:00", end: "15:00", title: "Flex Deep Work", category: "development" },
  ],
};

export const mockGoals: Goal[] = [
  { id: "g1", title: "Become a Senior Software Engineer", level: "vision", progress: 10 },
  { id: "g2", title: "Ship 3 Full-Stack Products", level: "longterm", parentId: "g1", progress: 33 },
  { id: "g3", title: "Master React & TypeScript", level: "monthly", parentId: "g2", progress: 60 },
  { id: "g4", title: "Complete Phase 2 of Phoenix", level: "weekly", parentId: "g3", progress: 0 },
];
