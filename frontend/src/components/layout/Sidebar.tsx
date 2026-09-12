import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, CalendarDays, BarChart2, FolderKanban, Settings, Flame, Map, Timer } from "lucide-react";
import { cn } from "../../utils/cn";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Roadmap", path: "/roadmap", icon: Map },
  { label: "Tasks", path: "/tasks", icon: CheckSquare },
  { label: "Calendar", path: "/calendar", icon: CalendarDays },
  { label: "Focus", path: "/focus", icon: Timer },
  { label: "Projects", path: "/projects", icon: FolderKanban },
];

const secondaryNavItems = [
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Progress", path: "/progress", icon: BarChart2 }, // Keep if needed for visual match, though it wasn't in phase 1 routes originally, wait, I will just keep Settings.
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#5B52FF] text-white hidden md:flex flex-col h-full shadow-lg">
      {/* Brand */}
      <div className="pt-8 pb-4 px-6">
        <h1 className="text-2xl font-bold tracking-wide">Phoenix</h1>
        <p className="text-sm text-white/80 mt-1">Task Manager</p>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-semibold text-sm",
                isActive 
                  ? "bg-white text-[#5B52FF]" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-white/20 space-y-2">
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-semibold text-sm",
                  isActive 
                    ? "bg-white text-[#5B52FF]" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="pt-4 mt-4 border-t border-white/20">
          <h3 className="px-4 text-sm font-semibold text-white/90">Current Projects</h3>
          {/* We can map current projects here if needed later */}
        </div>
      </div>

      {/* Profile / Bottom Section */}
      <div className="p-4">
        <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">Fahad</p>
            <p className="text-xs text-white/80 mt-0.5">Stay Productive <Flame className="inline w-3 h-3 text-orange-400 fill-orange-400" /></p>
          </div>
        </div>
      </div>
    </aside>
  );
}
