import { useState } from "react";
import { mockSchedule } from "../data/mockState";
import { Clock } from "lucide-react";
import { cn } from "../utils/cn";

export default function Calendar() {
  const [view, setView] = useState<"month" | "day">("day");
  const [dayType, setDayType] = useState<"weekday" | "weekend">("weekday");

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Schedule</h1>
        <div className="flex bg-panel rounded-lg p-1 border border-panel-hover">
          <button
            onClick={() => setView("day")}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", view === "day" ? "bg-bg-secondary text-text" : "text-text-secondary hover:text-text")}
          >
            Day
          </button>
          <button
            onClick={() => setView("month")}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", view === "month" ? "bg-bg-secondary text-text" : "text-text-secondary hover:text-text")}
          >
            Month
          </button>
        </div>
      </div>

      <div className="flex-1 bg-panel rounded-2xl border border-panel-hover overflow-hidden flex flex-col">
        {view === "day" ? (
          <>
            <div className="p-4 border-b border-panel-hover flex gap-4">
              <button 
                onClick={() => setDayType("weekday")}
                className={cn("text-sm font-medium transition-colors", dayType === "weekday" ? "text-accent" : "text-text-muted hover:text-text")}
              >
                Weekday Schedule
              </button>
              <button 
                onClick={() => setDayType("weekend")}
                className={cn("text-sm font-medium transition-colors", dayType === "weekend" ? "text-accent" : "text-text-muted hover:text-text")}
              >
                Weekend Schedule
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {mockSchedule[dayType].map((block, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-bg-secondary border border-panel-hover">
                  <div className="text-text-muted flex items-center gap-2 text-sm font-medium min-w-[120px] shrink-0">
                    <Clock className="w-4 h-4" />
                    {block.start} - {block.end}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-text">{block.title}</h4>
                    <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded bg-panel text-text-secondary uppercase tracking-wider">
                      {block.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-text-muted">
            Month view (September 2026) placeholder.
          </div>
        )}
      </div>
    </div>
  );
}
