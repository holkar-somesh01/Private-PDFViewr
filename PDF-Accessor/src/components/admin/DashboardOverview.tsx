import React from 'react';
import { Users, FileText } from 'lucide-react';

interface DashboardOverviewProps {
  usersCount: number;
  pdfsCount: number;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ usersCount, pdfsCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow group">
        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
          <p className="text-4xl font-black text-slate-800 tracking-tight">{usersCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow group">
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total PDFs</p>
          <p className="text-4xl font-black text-slate-800 tracking-tight">{pdfsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
