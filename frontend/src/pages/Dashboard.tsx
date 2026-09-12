import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Search, Plus, ChevronDown } from "lucide-react";

export default function Dashboard() {
  const { user, tasks } = useAppContext();
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good evening");
  }, []);

  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const completedTasks = tasks.filter(t => t.status === "completed");

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column */}
      <div className="flex-1 space-y-8">
        {/* Greeting Section */}
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">
            {greeting}, {user.name} <span role="img" aria-label="phoenix">🐦‍🔥</span>
          </h1>
          <p className="text-sm font-medium text-gray-700">
            Stay productive and finish your goals today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Tasks", value: tasks.length },
            { label: "Completed Tasks", value: completedTasks.length },
            { label: "In Progress", value: pendingTasks.filter(t => t.status === "in_progress").length },
            { label: "Pending Tasks", value: pendingTasks.filter(t => t.status === "pending").length },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
              <span className="text-sm font-bold text-black">{stat.label}</span>
              <span className="text-sm font-medium text-black mt-auto">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Your Projects */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black">Your Projects</h2>
            <button className="bg-[#5B52FF] hover:bg-[#4d44e5] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors">
              + Project
            </button>
          </div>
          <p className="text-sm font-medium text-black mb-6">No projects created yet.</p>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none shadow-sm"
              />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium text-black shadow-sm focus:outline-none cursor-pointer">
                <option>All Projects</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>
            <button className="bg-[#10B981] hover:bg-[#059669] text-white p-2.5 rounded-xl transition-colors shadow-sm">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Today's Tasks */}
        <section>
          <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[160px]">
            <h2 className="text-xl font-bold text-black mb-4">Today's Tasks</h2>
            <p className="text-sm font-medium text-black">No tasks added yet.</p>
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-80 space-y-6">
        {/* Calendar Widget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-center font-bold text-black mb-6">September 2026</h3>
          <div className="grid grid-cols-7 gap-y-4 text-center">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
              <div key={day} className="text-xs font-bold text-black">{day}</div>
            ))}
            <div className="col-span-1"></div>
            {Array.from({ length: 30 }, (_, i) => i + 1).map(date => (
              <div 
                key={date} 
                className={`text-sm font-medium flex items-center justify-center w-8 h-8 mx-auto rounded-lg ${date === 12 ? 'bg-[#5B52FF] text-white' : 'text-black'}`}
              >
                {date}
              </div>
            ))}
          </div>
        </div>

        {/* Daily Progress Widget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-black mb-1">Daily Progress</h3>
          <div className="text-sm font-bold text-black">0%</div>
        </div>
      </div>
    </div>
  );
}
