import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuditManagementProps {
  refreshTrigger?: number;
}

const AuditManagement: React.FC<AuditManagementProps> = ({ refreshTrigger = 0 }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/audit', {
        params: { page, limit, search }
      });
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, limit, search, refreshTrigger]);

  const toggleExpand = (id: string) => {
    if (expandedLogId === id) setExpandedLogId(null);
    else setExpandedLogId(id);
  };

  const getMethodColor = (method: string) => {
    switch(method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            System Audit Logs
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tracking all user and admin activities
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search action or endpoint..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/50 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          
          <select 
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="border border-slate-200 rounded-lg px-3 py-2 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">Loading logs...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">No logs found</td>
              </tr>
            ) : (
              logs.map((log) => (
                <React.Fragment key={log._id}>
                  <tr className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {log.userId ? (
                        <div>
                          <div className="font-medium text-slate-800">{log.userId.name}</div>
                          <div className="text-xs text-slate-500">{log.userId.email} <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] ml-1">{log.userId.role}</span></div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-slate-800">System/Guest</div>
                          <div className="text-xs text-slate-500">
                            {(() => {
                              try {
                                const parsed = JSON.parse(log.details);
                                return parsed.unauthenticatedEmail || 'Unauthenticated';
                              } catch(e) {
                                return 'Unauthenticated';
                              }
                            })()}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-800 font-medium text-sm">
                          {log.action}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getMethodColor(log.method)}`}>
                            {log.method || 'SYS'}
                          </span>
                          <span className="text-slate-500 font-mono text-xs truncate max-w-[200px]" title={log.endpoint}>
                            {log.endpoint}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4">
                      {log.details ? (
                        <button 
                          onClick={() => toggleExpand(log._id)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-medium focus:outline-none"
                        >
                          {expandedLogId === log._id ? 'Hide Details' : 'View Details'}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">No payload</span>
                      )}
                    </td>
                  </tr>
                  {expandedLogId === log._id && log.details && (
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Action Payload Details</h4>
                          {(() => {
                            try {
                              const parsed = JSON.parse(log.details);
                              if (Object.keys(parsed).length === 0) return <span className="text-sm text-slate-500 italic">No details provided</span>;
                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {Object.entries(parsed).map(([key, value]) => (
                                    <div key={key} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{key}</div>
                                      <div className="text-sm font-medium text-slate-700 truncate" title={String(value)}>
                                        {value === null ? 'null' : typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            } catch (e) {
                              return <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{log.details}</div>;
                            }
                          })()}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-700">{((page - 1) * limit) + 1}</span> to <span className="font-medium text-slate-700">{Math.min(page * limit, total)}</span> of <span className="font-medium text-slate-700">{total}</span> results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditManagement;
