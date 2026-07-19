import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPdf: any;
  setNewPdf: (pdf: any) => void;
  setPdfFile: (file: File | null) => void;
  setThumbnailFile: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const UploadPdfModal: React.FC<UploadPdfModalProps> = ({
  isOpen,
  onClose,
  newPdf,
  setNewPdf,
  setPdfFile,
  setThumbnailFile,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 md:p-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Upload New PDF</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
              <input
                type="text"
                placeholder="Introduction to Anatomy"
                required
                value={newPdf.title}
                onChange={e => setNewPdf({ ...newPdf, title: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="Anatomy"
                required
                value={newPdf.subject}
                onChange={e => setNewPdf({ ...newPdf, subject: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                <span>Description</span>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full">Line breaks supported</span>
              </label>
              <textarea
                placeholder="Detailed notes for Anatomy chapter 1..."
                required
                rows={4}
                value={newPdf.description}
                onChange={e => setNewPdf({ ...newPdf, description: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 resize-none whitespace-pre-wrap"
              />
            </div>
            <div className="md:col-span-2 bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl p-6 text-center hover:bg-slate-100 transition-colors">
              <label className="block text-sm font-bold text-slate-700 mb-3">PDF File</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setPdfFile(e.target.files?.[0] || null)}
                required
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>
            <div className="md:col-span-2 bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl p-6 text-center hover:bg-slate-100 transition-colors">
              <label className="block text-sm font-bold text-slate-700 mb-3">Thumbnail (Image)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                required
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold mt-6 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" /> Upload File
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPdfModal;
