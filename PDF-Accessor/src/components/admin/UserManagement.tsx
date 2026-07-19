import React from 'react';
import { Shield, Plus, Edit2, Trash2, Ban, CheckCircle, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

interface UserManagementProps {
  users: any[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  search: string;
  setSearch: (search: string) => void;
  sortBy: string;
  order: string;
  setSort: (sortBy: string) => void;
  openAssignModal: (userId: string) => void;
  openCreateModal: () => void;
  openEditModal: (user: any) => void;
  handleDeleteUser: (userId: string) => void;
  handleToggleBlock: (user: any) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  totalUsers,
  currentPage,
  totalPages,
  setPage,
  limit,
  setLimit,
  search,
  setSearch,
  sortBy,
  order,
  setSort,
  openAssignModal, 
  openCreateModal,
  openEditModal,
  handleDeleteUser,
  handleToggleBlock
}) => {

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity" />;
    return <ArrowUpDown className={`w-3.5 h-3.5 text-emerald-600 ${order === 'desc' ? 'rotate-180' : ''}`} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Users List</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage user accounts, roles, and access.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 hidden sm:block">Per page:</span>
            <select 
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button
            onClick={openCreateModal}
            className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Create
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/50">
              <tr>
                <th onClick={() => setSort('name')} className="px-6 py-4 text-left font-bold text-slate-600 tracking-wide cursor-pointer group hover:bg-slate-100/50 transition-colors">
                  <div className="flex items-center gap-2">Name {renderSortIcon('name')}</div>
                </th>
                <th onClick={() => setSort('email')} className="px-6 py-4 text-left font-bold text-slate-600 tracking-wide cursor-pointer group hover:bg-slate-100/50 transition-colors">
                  <div className="flex items-center gap-2">Email {renderSortIcon('email')}</div>
                </th>
                <th onClick={() => setSort('role')} className="px-6 py-4 text-left font-bold text-slate-600 tracking-wide cursor-pointer group hover:bg-slate-100/50 transition-colors">
                  <div className="flex items-center gap-2">Role {renderSortIcon('role')}</div>
                </th>
                <th className="px-6 py-4 text-center font-bold text-slate-600 tracking-wide">Status</th>
                <th className="px-6 py-4 text-right font-bold text-slate-600 tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{u.name}</td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${
                        u.role === 'Admin' || u.role === 'Super Admin' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                        u.isBlocked ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Manage Access"
                          onClick={() => openAssignModal(u._id || u.id)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          title="Edit User"
                          onClick={() => openEditModal(u)}
                          className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          title={u.isBlocked ? "Unblock User" : "Block User"}
                          onClick={() => handleToggleBlock(u)}
                          className={`p-2 rounded-lg transition-colors ${
                            u.isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                          }`}
                        >
                          {u.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                        <button
                          title="Delete User"
                          onClick={() => handleDeleteUser(u._id || u.id)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center text-slate-500 font-medium">
            No users found.
          </div>
        ) : (
          users.map(u => (
            <div key={u._id || u.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    {u.name}
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.isBlocked ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-500 font-medium">{u.email}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  u.role === 'Admin' || u.role === 'Super Admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {u.role}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 mt-1">
                <button
                  onClick={() => openAssignModal(u._id || u.id)}
                  className="flex items-center justify-center py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  <Shield className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(u)}
                  className="flex items-center justify-center py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleBlock(u)}
                  className={`flex items-center justify-center py-2 rounded-xl transition-colors ${
                    u.isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                  }`}
                >
                  {u.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDeleteUser(u._id || u.id)}
                  className="flex items-center justify-center py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm gap-4">
          <div className="text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{users.length}</span> of <span className="font-bold text-slate-800">{totalUsers}</span> users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="text-sm font-bold text-slate-700 px-3 bg-slate-50 rounded-lg py-1.5 border border-slate-100">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
