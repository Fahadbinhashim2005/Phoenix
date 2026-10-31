import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Percent,
  Receipt,
  FileSpreadsheet,
  Repeat,
  CreditCard,
  AlertCircle,
  FileText,
  BarChart3,
  Users,
  Building2,
  Settings,
  LogOut,
  X,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuthStore();
  const isCustomer = user?.role === 'customer';

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
      isActive
        ? 'bg-white/10 text-white shadow-xs font-semibold'
        : 'text-white/65 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e1b4b] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-indigo-950/50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-violet-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">
                Brightloop
              </span>
              <span className="text-[10px] text-violet-300 font-medium uppercase tracking-wider">
                Subscription SaaS
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {/* Main */}
          <div className="space-y-1">
            <NavLink to="/dashboard" className={navClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 text-violet-400" />
              <span>Dashboard</span>
            </NavLink>
          </div>

          {/* Customer Portal view */}
          {isCustomer ? (
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
                Customer Portal
              </div>
              <div className="space-y-1">
                <NavLink to="/my-subscriptions" className={navClass} onClick={onClose}>
                  <Repeat className="w-4 h-4 text-violet-400" />
                  <span>My Subscriptions</span>
                </NavLink>
                <NavLink to="/my-invoices" className={navClass} onClick={onClose}>
                  <FileText className="w-4 h-4 text-violet-400" />
                  <span>My Invoices</span>
                </NavLink>
              </div>
            </div>
          ) : (
            <>
              {/* Catalogue (Member 2) */}
              <div>
                <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
                  Product Catalogue
                </div>
                <div className="space-y-1">
                  <NavLink to="/products" className={navClass} onClick={onClose}>
                    <Package className="w-4 h-4 text-violet-400" />
                    <span>Products</span>
                  </NavLink>
                  <NavLink to="/plans" className={navClass} onClick={onClose}>
                    <Layers className="w-4 h-4 text-violet-400" />
                    <span>Subscription Plans</span>
                  </NavLink>
                  <NavLink to="/discounts" className={navClass} onClick={onClose}>
                    <Percent className="w-4 h-4 text-violet-400" />
                    <span>Discounts</span>
                  </NavLink>
                  <NavLink to="/taxes" className={navClass} onClick={onClose}>
                    <Receipt className="w-4 h-4 text-violet-400" />
                    <span>Taxes & GST</span>
                  </NavLink>
                </div>
              </div>

              {/* Subscriptions & Sales (Member 3) */}
              <div>
                <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
                  Sales & Contracts
                </div>
                <div className="space-y-1">
                  <NavLink to="/quotations" className={navClass} onClick={onClose}>
                    <FileSpreadsheet className="w-4 h-4 text-violet-400" />
                    <span>Quotations</span>
                  </NavLink>
                  <NavLink to="/subscriptions" className={navClass} onClick={onClose}>
                    <Repeat className="w-4 h-4 text-violet-400" />
                    <span>Subscriptions</span>
                  </NavLink>
                </div>
              </div>

              {/* Billing & Finance (Member 4) */}
              <div>
                <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
                  Finance & Invoicing
                </div>
                <div className="space-y-1">
                  <NavLink to="/invoices" className={navClass} onClick={onClose} end>
                    <FileText className="w-4 h-4 text-violet-400" />
                    <span>Invoices</span>
                  </NavLink>
                  <NavLink to="/invoices/overdue" className={navClass} onClick={onClose}>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Overdue Invoices</span>
                  </NavLink>
                  <NavLink to="/payments" className={navClass} onClick={onClose}>
                    <CreditCard className="w-4 h-4 text-violet-400" />
                    <span>Payments</span>
                  </NavLink>
                  <NavLink to="/reports/revenue" className={navClass} onClick={onClose}>
                    <BarChart3 className="w-4 h-4 text-violet-400" />
                    <span>Revenue Reports</span>
                  </NavLink>
                </div>
              </div>

              {/* Users & CRM (Member 1) */}
              <div>
                <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
                  Management
                </div>
                <div className="space-y-1">
                  <NavLink to="/customers" className={navClass} onClick={onClose}>
                    <Building2 className="w-4 h-4 text-violet-400" />
                    <span>Customers</span>
                  </NavLink>
                  {isAdmin() && (
                    <NavLink to="/staff" className={navClass} onClick={onClose}>
                      <Users className="w-4 h-4 text-violet-400" />
                      <span>Staff Team</span>
                    </NavLink>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Account Settings */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
              Preferences
            </div>
            <div className="space-y-1">
              <NavLink to="/settings" className={navClass} onClick={onClose}>
                <Settings className="w-4 h-4 text-violet-400" />
                <span>Account Settings</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-white/10 bg-[#161338]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-violet-600/80 border border-violet-400/30 flex items-center justify-center font-bold text-xs text-white shrink-0">
                {user?.name?.slice(0, 2).toUpperCase() || 'BL'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-white/10 text-violet-200">
                  {user?.role || 'staff'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
