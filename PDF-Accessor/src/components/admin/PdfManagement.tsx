import React from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface PdfManagementProps {
  pdfs: any[];
  openUploadModal: () => void;
  openEditModal: (pdf: any) => void;
  handleDeletePdf: (pdfId: string) => void;
}

const PdfManagement: React.FC<PdfManagementProps> = ({ pdfs, openUploadModal, openEditModal, handleDeletePdf }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">PDFs List</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and organize all uploaded documents.</p>
        </div>
        <button
          onClick={openUploadModal}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Upload PDF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pdfs.map(pdf => (
          <div key={pdf._id || pdf.id} className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="aspect-[1/1.414] w-full bg-slate-100 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
              <img
                src={`${api.defaults.baseURL}/pdfs/thumbnail/${pdf._id || pdf.id}`}
                alt={pdf.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('data:image')) {
                    target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22400%22%20viewBox%3D%220%200%20300%20400%22%3E%3Crect%20fill%3D%22%23f1f5f9%22%20width%3D%22300%22%20height%3D%22400%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20dy%3D%2210.5%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Thumbnail%3C%2Ftext%3E%3C%2Fsvg%3E';
                  }
                }}
              />
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm border border-emerald-100">
                  {pdf.status || 'Active'}
                </span>
              </div>
            </div>
            <div className="p-5 bg-white relative">
              <div className="absolute top-4 right-4 flex gap-1 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-slate-100/50">
                <button 
                  onClick={() => navigate(`/pdf/${pdf._id || pdf.id}`)}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Preview PDF"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => openEditModal(pdf)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit PDF"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeletePdf(pdf._id || pdf.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete PDF"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-bold text-slate-800 text-lg truncate pr-16 mb-1" title={pdf.title}>{pdf.title}</h4>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3 opacity-80">Phase: {pdf.phaseId}</p>
              <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">{pdf.description}</p>
            </div>
          </div>
        ))}
        {pdfs.length === 0 && (
          <div className="col-span-full py-16 px-4 bg-white border border-slate-100 border-dashed rounded-3xl text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1">No PDFs found</h4>
            <p className="text-sm font-medium text-slate-500">Upload your first PDF document to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfManagement;
