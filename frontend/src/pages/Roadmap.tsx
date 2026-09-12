import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { CheckCircle2, Circle, Lock, BookOpen, GraduationCap, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "../utils/cn";

export default function Roadmap() {
  const { roadmap, toggleRoadmapCheckpoint } = useAppContext();
  const [expandedId, setExpandedId] = useState<string | null>(roadmap.find(n => n.status === "Learning")?.id || null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Locked": return <Lock className="w-5 h-5" />;
      case "Mastered": return <GraduationCap className="w-5 h-5 text-success" />;
      case "Comfortable": return <CheckCircle2 className="w-5 h-5 text-accent" />;
      default: return <BookOpen className="w-5 h-5 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">Learning Roadmap</h1>
        <p className="text-text-secondary">Track your progression from fundamentals to full-stack mastery.</p>
      </div>

      <div className="space-y-4 relative">
        {/* Connecting line */}
        <div className="absolute left-8 top-8 bottom-8 w-px bg-panel-hover -z-10 hidden sm:block"></div>

        {roadmap.map((node) => (
          <div 
            key={node.id} 
            className={cn(
              "bg-panel rounded-2xl border transition-all duration-200 overflow-hidden",
              node.status === "Locked" ? "border-transparent opacity-60" : "border-panel-hover hover:border-accent/30",
              expandedId === node.id ? "ring-1 ring-accent shadow-lg shadow-accent/10" : ""
            )}
          >
            <button 
              onClick={() => setExpandedId(expandedId === node.id ? null : node.id)}
              className="w-full flex items-center gap-4 p-5 sm:p-6 text-left"
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                node.status === "Locked" ? "bg-bg-secondary border-panel-hover" : "bg-accent/10 border-accent/20 text-accent"
              )}>
                {getStatusIcon(node.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-1">
                  <h3 className="text-lg font-bold text-text truncate">{node.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-bg-secondary text-text-secondary uppercase tracking-wider hidden sm:block">
                      {node.category}
                    </span>
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      node.status === "Mastered" ? "text-success" :
                      node.status === "Locked" ? "text-text-muted" : "text-accent"
                    )}>
                      {node.status}
                    </span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-bg-secondary rounded-full mt-3 overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      node.confidence === "green" ? "bg-success" :
                      node.confidence === "yellow" ? "bg-accent" : "bg-orange"
                    )} 
                    style={{ width: `${node.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="shrink-0 text-text-muted">
                <ChevronDown className={cn("w-5 h-5 transition-transform", expandedId === node.id && "rotate-180")} />
              </div>
            </button>

            {/* Expandable Content */}
            {expandedId === node.id && (
              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-panel-hover">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Checkpoints */}
                  <div>
                    <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Checkpoints</h4>
                    <div className="space-y-3">
                      {node.checkpoints.map((cp, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <button 
                            onClick={() => toggleRoadmapCheckpoint(node.id, idx)}
                            className="mt-0.5 shrink-0 text-text-muted hover:text-accent transition-colors"
                          >
                            {cp.done ? <CheckCircle2 className="w-5 h-5 text-accent" /> : <Circle className="w-5 h-5" />}
                          </button>
                          <span className={cn("text-sm font-medium", cp.done ? "text-text-secondary line-through" : "text-text")}>
                            {cp.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  {node.resources.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Resources</h4>
                      <div className="space-y-2">
                        {node.resources.map((res, idx) => (
                          <a 
                            key={idx} 
                            href={res.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="group flex items-center justify-between p-3 rounded-lg bg-bg-secondary border border-transparent hover:border-panel-hover transition-colors"
                          >
                            <div>
                              <div className="text-xs font-semibold text-text-muted mb-0.5">{res.type}</div>
                              <div className="text-sm font-medium text-text group-hover:text-accent transition-colors">{res.title}</div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
