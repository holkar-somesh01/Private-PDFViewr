import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100 flex flex-col items-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <h1 className="text-6xl font-black text-slate-800 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Page Not Found</h2>
        
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>

        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
