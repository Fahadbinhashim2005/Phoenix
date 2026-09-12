import { useAppContext } from "../context/AppContext";
import { AlertTriangle } from "lucide-react";

export default function Settings() {
  const { resetData } = useAppContext();

  const handleReset = () => {
    if (window.confirm("WARNING: This is a destructive action. It will permanently delete all your tasks, goals, and project data, and restore the initial mock data. Are you sure?")) {
      resetData();
      alert("Data has been reset to defaults.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-text mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your application preferences and data.</p>
      </div>

      <section className="bg-panel rounded-2xl border border-red-500/20 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text mb-1">Danger Zone</h3>
            <p className="text-sm font-medium text-text-secondary mb-4">
              Reset all local application data. This will wipe your current localStorage state and restore the default starter data for development and testing.
            </p>
            <button 
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
