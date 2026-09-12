import { useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "../utils/cn";

export default function Focus() {
  const [duration, setDuration] = useState(25); // minutes
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-panel rounded-3xl border border-panel-hover p-8 md:p-12 text-center shadow-xl">
        <h2 className="text-xl font-bold text-text-secondary mb-8">Focus Session</h2>
        
        {/* Timer Display */}
        <div className="text-7xl md:text-8xl font-black text-text tracking-tighter mb-12 font-mono">
          {String(duration).padStart(2, "0")}:00
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-12">
          <button className="p-4 rounded-full bg-bg-secondary text-text-secondary hover:text-text hover:bg-panel-hover transition-colors">
            <RotateCcw className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="p-6 rounded-full bg-accent text-bg hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
          >
            {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
        </div>

        {/* Duration Select */}
        <div className="flex justify-center gap-3">
          {[25, 45, 60].map(mins => (
            <button
              key={mins}
              onClick={() => setDuration(mins)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                duration === mins 
                  ? "bg-accent/10 text-accent border border-accent/20" 
                  : "bg-bg-secondary text-text-muted hover:text-text border border-transparent"
              )}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
