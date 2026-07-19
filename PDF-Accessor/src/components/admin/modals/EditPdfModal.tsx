import React, { useRef, useState } from 'react';
import { X, FileText, Upload } from 'lucide-react';

interface EditPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPdf: any;
  setEditingPdf: React.Dispatch<React.SetStateAction<any>>;
  setPdfFile: React.Dispatch<React.SetStateAction<File | null>>;
  setThumbnailFile: React.Dispatch<React.SetStateAction<File | null>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  phases?: any[];
}

const EditPdfModal: React.FC<EditPdfModalProps> = ({ 
  isOpen, onClose, editingPdf, setEditingPdf, setPdfFile, setThumbnailFile, onSubmit, phases 
}) => {
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [thumbFileName, setThumbFileName] = useState<string>('');
  
  if (!isOpen || !editingPdf) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Edit PDF</h3>
              <p className="text-xs font-medium text-slate-500">Update document details or replace files</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto">
          <form onSubmit={onSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                value={editingPdf.title || ''}
                onChange={(e) => setEditingPdf({ ...editingPdf, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex justify-between">
                <span>Description</span>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full">Line breaks supported</span>
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 resize-none whitespace-pre-wrap"
                value={editingPdf.description || ''}
                onChange={(e) => setEditingPdf({ ...editingPdf, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Phase (Subject)</label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                  value={editingPdf.phaseId || ''}
                  onChange={(e) => setEditingPdf({ ...editingPdf, phaseId: e.target.value })}
                >
                  {phases?.map(phase => (
                    <option key={phase._id || phase.id} value={phase._id || phase.id}>
                      {phase.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                  value={editingPdf.status || 'Active'}
                  onChange={(e) => setEditingPdf({ ...editingPdf, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="pt-2 pb-1 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-700 mb-3">Replace Files <span className="text-xs font-normal text-slate-400">(Optional)</span></h4>
              <div className="grid grid-cols-2 gap-4">
                {/* PDF File Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    New PDF Document
                  </label>
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPdfFile(file);
                          setPdfFileName(file.name);
                        } else {
                          setPdfFile(null);
                          setPdfFileName('');
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-blue-400 group-hover:bg-blue-50 rounded-xl flex flex-col items-center justify-center gap-2 transition-all text-center">
                      <Upload className={`w-5 h-5 ${pdfFileName ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`} />
                      <span className={`text-xs font-medium truncate w-full px-2 ${pdfFileName ? 'text-blue-600' : 'text-slate-500'}`}>
                        {pdfFileName || 'Choose PDF File...'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    New Cover Image
                  </label>
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setThumbnailFile(file);
                          setThumbFileName(file.name);
                        } else {
                          setThumbnailFile(null);
                          setThumbFileName('');
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-blue-400 group-hover:bg-blue-50 rounded-xl flex flex-col items-center justify-center gap-2 transition-all text-center">
                      <Upload className={`w-5 h-5 ${thumbFileName ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`} />
                      <span className={`text-xs font-medium truncate w-full px-2 ${thumbFileName ? 'text-blue-600' : 'text-slate-500'}`}>
                        {thumbFileName || 'Choose Image...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPdfModal;
