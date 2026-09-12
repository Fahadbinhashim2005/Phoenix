import { useAppContext } from "../context/AppContext";
import { FolderGit2, ExternalLink, GitBranch } from "lucide-react";

export default function Projects() {
  const { projects } = useAppContext();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Projects</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-panel rounded-2xl border border-panel-hover p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 text-accent rounded-lg">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-text">{project.name}</h2>
              </div>
              <div className="flex gap-2">
                <button className="text-text-muted hover:text-text transition-colors p-2 bg-bg-secondary rounded-md">
                  <GitBranch className="w-4 h-4" />
                </button>
                <button className="text-text-muted hover:text-text transition-colors p-2 bg-bg-secondary rounded-md">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.stack.map(tech => (
                <span key={tech} className="px-2.5 py-1 text-xs font-medium text-accent-light bg-accent/10 rounded-md">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary font-medium">Overall Progress</span>
                  <span className="text-text font-bold">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
              
              {project.sections && (
                <div className="pt-4 border-t border-panel-hover grid grid-cols-3 gap-4">
                  {Object.entries(project.sections).slice(0, 3).map(([key, val]) => (
                    <div key={key}>
                      <div className="text-xs text-text-muted uppercase tracking-wider mb-1 font-semibold">{key}</div>
                      <div className="text-sm font-medium text-text">{val}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Placeholder for new project */}
        <button className="bg-panel rounded-2xl border border-dashed border-panel-hover p-6 flex flex-col items-center justify-center text-text-muted hover:text-accent hover:border-accent/50 transition-colors h-full min-h-[250px]">
          <div className="p-4 bg-bg-secondary rounded-full mb-4 group-hover:bg-accent/10 transition-colors">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <span className="font-semibold">Initialize New Project</span>
        </button>
      </div>
    </div>
  );
}
