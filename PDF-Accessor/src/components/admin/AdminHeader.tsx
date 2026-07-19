import React from 'react';
import { Menu, LogOut, Settings, RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  activeTab: string;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  onRefresh: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, setIsMobileMenuOpen, onLogout, onRefresh }) => {
  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Overview';
      case 'users': return 'User Management';
      case 'pdfs': return 'PDF Management';
      default: return 'Admin Panel';
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onRefresh}
          className="flex w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center text-indigo-600 hover:bg-indigo-100 border border-indigo-100 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <button className="hidden md:flex w-10 h-10 rounded-xl bg-slate-50 items-center justify-center text-slate-500 hover:bg-slate-100 border border-slate-200 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-100 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" /> 
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
