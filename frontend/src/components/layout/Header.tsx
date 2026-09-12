import { Bell, UserCircle } from "lucide-react";
import { mockUser } from "../../data/mockState";
import { useEffect, useState } from "react";

export default function Header() {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    // Calculate days until target date
    const target = new Date(mockUser.targetDate);
    const now = new Date();
    const diffTime = Math.abs(target.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    setDaysRemaining(diffDays);
  }, []);

  return (
    <header className="h-16 bg-panel border-b border-panel-hover flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        <div className="hidden md:flex flex-col">
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Mission Target</span>
          <span className="text-sm font-semibold text-text">April 30, 2027</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xl font-bold text-accent leading-none">{daysRemaining}</span>
          <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Days Remain</span>
        </div>
        
        <div className="h-8 w-px bg-panel-hover hidden md:block"></div>

        <button className="text-text-secondary hover:text-text transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-panel"></span>
        </button>
        
        <button className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors">
          <UserCircle className="w-6 h-6" />
          <span className="text-sm font-medium hidden sm:block">{mockUser.name}</span>
        </button>
      </div>
    </header>
  );
}
