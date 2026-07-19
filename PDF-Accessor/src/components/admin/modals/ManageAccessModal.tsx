import React from 'react';

interface ManageAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  phases: any[];
  selectedPhaseIds: string[]; // Note: Assuming MongoDB ObjectIds are strings
  setSelectedPhaseIds: (ids: string[]) => void;
  onSave: () => void;
}

const ManageAccessModal: React.FC<ManageAccessModalProps> = ({
  isOpen,
  onClose,
  phases,
  selectedPhaseIds,
  setSelectedPhaseIds,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Access</h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto mb-8 pr-2 custom-scrollbar">
          {phases.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-sm font-medium text-slate-500">No phases available.</p>
              <p className="text-xs text-slate-400 mt-1">Please create a phase first.</p>
            </div>
          ) : (
            phases.map(phase => (
              <label 
                key={phase._id} 
                className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${
                  selectedPhaseIds.includes(phase._id) 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPhaseIds.includes(phase._id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedPhaseIds([...selectedPhaseIds, phase._id]);
                    else setSelectedPhaseIds(selectedPhaseIds.filter(id => id !== phase._id));
                  }}
                  className="w-5 h-5 text-emerald-600 rounded-md focus:ring-emerald-500 border-slate-300 transition-colors"
                />
                <span className={`font-semibold ${selectedPhaseIds.includes(phase._id) ? 'text-emerald-800' : 'text-slate-700'}`}>
                  {phase.name}
                </span>
              </label>
            ))
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAccessModal;
