import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, BookOpen, Loader2 } from 'lucide-react';

interface PDF {
  _id: string;
  title: string;
  description: string;
  subject: string;
  thumbnailPath: string;
}

const Home = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedDescIds, setExpandedDescIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleDescription = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedDescIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const fetchAssignedPDFs = async () => {
      try {
        setLoading(true);
        // 1. Fetch assigned phases
        const phasesRes = await api.get('/users/phases');
        const assignedPhases = phasesRes.data;

        // 2. Fetch PDFs for each assigned phase
        let allPdfs: PDF[] = [];
        for (const phase of assignedPhases) {
          try {
            const pdfsRes = await api.get(`/users/phases/${phase.id}/pdfs`);
            
            // Map the PDFs to match the frontend interface, adding subject/phase name
            const mappedPdfs = pdfsRes.data.map((p: any) => ({
              _id: p.id,
              title: p.title,
              description: p.description,
              subject: phase.name,
              thumbnailPath: p.thumbnailPath
            }));
            
            allPdfs = [...allPdfs, ...mappedPdfs];
          } catch (err) {
            console.error(`Failed to fetch PDFs for phase ${phase.id}`, err);
          }
        }

        setPdfs(allPdfs);
      } catch (err) {
        console.error('Failed to fetch assigned phases', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedPDFs();
  }, []);

  const filteredPdfs = pdfs.filter(pdf => 
    pdf.title.toLowerCase().includes(search.toLowerCase()) ||
    pdf.subject.toLowerCase().includes(search.toLowerCase()) ||
    pdf.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-in fade-in duration-500">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-50"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Library</h1>
              <p className="text-gray-500 mt-1 font-medium">Explore your assigned notes and resources</p>
            </div>
          </div>

          <div className="w-full md:max-w-md">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by subject, title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <p className="text-gray-500 font-medium">Loading your resources...</p>
        </div>
      ) : filteredPdfs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-gray-100 border-dashed shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No PDFs found</h3>
          <p className="text-gray-500 max-w-sm">We couldn't find any documents matching your search. Try adjusting your filters.</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Available Notes <span className="text-gray-400 text-sm ml-2 font-medium">({filteredPdfs.length})</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8 items-start">
            {filteredPdfs.map(pdf => (
              <div 
                key={pdf._id}
                onClick={() => navigate(`/pdf/${pdf._id}`)}
                className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden cursor-pointer group hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[1/1.414] w-full bg-slate-100 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img 
                    src={`${api.defaults.baseURL}/pdfs/thumbnail/${pdf._id}`}
                    alt={pdf.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('data:image')) {
                        target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22400%22%20viewBox%3D%220%200%20300%20400%22%3E%3Crect%20fill%3D%22%23f1f5f9%22%20width%3D%22300%22%20height%3D%22400%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20dy%3D%2210.5%22%20font-weight%3D%22600%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Cover%3C%2Ftext%3E%3C%2Fsvg%3E';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/30 transition-colors backdrop-blur-sm">
                      Read Document
                    </button>
                  </div>
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-emerald-600 rounded-lg shadow-sm">
                      {pdf.subject}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col bg-white">
                  <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-emerald-600 transition-colors" title={pdf.title}>
                    {pdf.title}
                  </h3>
                  <div className="mt-auto pt-2 relative z-10">
                    <p className={`text-xs text-gray-500 font-medium transition-all whitespace-pre-wrap ${expandedDescIds.has(pdf._id) ? '' : 'line-clamp-2'}`}>
                      {pdf.description}
                    </p>
                    {pdf.description && pdf.description.length > 80 && (
                      <button 
                        onClick={(e) => toggleDescription(e, pdf._id)}
                        className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-1.5 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-md transition-colors"
                      >
                        {expandedDescIds.has(pdf._id) ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
