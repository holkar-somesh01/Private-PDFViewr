import React from 'react';
import { Users, FileText, LayoutDashboard, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  user: any;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-300 flex flex-col 
        transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
              A
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              Ayurdnyanam
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <button
            onClick={() => { navigate('/dashboard/admin/dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold ${
              activeTab === 'dashboard' || activeTab === '' 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button
            onClick={() => { navigate('/dashboard/admin/users'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold ${
              activeTab === 'users' 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            <Users className="w-5 h-5" /> User Management
          </button>
          <button
            onClick={() => { navigate('/dashboard/admin/pdfs'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold ${
              activeTab === 'pdfs' 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            <FileText className="w-5 h-5" /> PDF Management
          </button>
          <button
            onClick={() => { navigate('/dashboard/admin/audit'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold ${
              activeTab === 'audit' 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            <Activity className="w-5 h-5" /> Audit Logs
          </button>
        </div>

        <div className="p-5 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-xl shadow-inner">
            <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-xs text-emerald-400 font-medium truncate tracking-wide uppercase">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
