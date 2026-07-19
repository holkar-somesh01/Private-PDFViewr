import React from 'react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: any;
  setEditingUser: (user: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  editingUser,
  setEditingUser,
  onSubmit,
}) => {
  if (!isOpen || !editingUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 md:p-8 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Edit User</h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                required 
                value={editingUser.name} 
                onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} 
                className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                required 
                value={editingUser.email} 
                onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} 
                className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile</label>
              <input 
                type="text" 
                placeholder="1234567890" 
                required 
                value={editingUser.mobile} 
                onChange={e => setEditingUser({ ...editingUser, mobile: e.target.value })} 
                className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400" 
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold mt-6 transition-colors shadow-lg shadow-emerald-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
