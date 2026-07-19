import React from 'react';
import { UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.jpeg';
import LogoName from '../assets/logoName.jpeg';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login');
  };

  const handleScrollTo = (id: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <img src={Logo} alt="Ayurdnyanam Logo" className="w-12 h-12 object-contain group-hover:scale-105 transition-transform rounded-md" />
            <img src={LogoName} alt="Ayurdnyanam" className="h-8 hidden sm:block object-contain" />
          </div>

          <nav className="hidden md:flex items-center gap-8 font-semibold text-[#171A26]">
            <button onClick={() => navigate('/')} className="hover:text-emerald-600 transition-colors">Home</button>
            <button onClick={() => handleScrollTo('about')} className="hover:text-emerald-600 transition-colors">About</button>
            <button onClick={() => handleScrollTo('courses')} className="hover:text-emerald-600 transition-colors">Subjects</button>
            <button onClick={() => navigate('/phases')} className="hover:text-emerald-600 transition-colors">Notes</button>
          </nav>

          <div className="flex items-center gap-4">
            {user?.role === 'Super Admin' && (
              <button
                onClick={() => navigate('/dashboard/admin')}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hidden sm:block"
              >
                Admin Panel
              </button>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/919158739395"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:flex px-5 py-2.5 bg-emerald-100 text-emerald-700 font-bold rounded-xl hover:bg-emerald-200 transition-colors items-center gap-2"
                >
                  WhatsApp
                </a>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Enroll Now
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 relative">
                <div
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-emerald-200 transition-all"
                >
                  <UserCircle className="w-6 h-6 text-gray-600" />
                </div>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100 mb-2">
                        <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-gray-500 text-xs truncate mt-0.5">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-[#171A26] text-gray-300 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                Ayurdnyanam
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Ayurdnyanam: Bridging Ancient Wisdom with Academic Excellence. Premium handwritten notes and resources for BAMS students.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📍 Sambhajinagar, Maharashtra</p>
                <p>📞 +91 9096147080</p>
                <p>✉️ ayurdnyanam@gmail.com</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">QUICK EXPLORE</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => navigate('/')} className="hover:text-emerald-400 transition-colors">Home</button></li>
                <li><button onClick={() => handleScrollTo('about')} className="hover:text-emerald-400 transition-colors">About Us</button></li>
                <li><button onClick={() => handleScrollTo('courses')} className="hover:text-emerald-400 transition-colors">Premium Notes</button></li>
                <li><button className="hover:text-emerald-400 transition-colors">Success Results</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">SPECIALIZATIONS</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Simplified Ayurveda Learning</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Designed according to NCISM syllabus</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Charts & Diagrams</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Short tricks for Shlokas</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">OUR APP</h4>
              <p className="text-sm text-gray-400 mb-6">Study on the go with our dedicated mobile application.</p>
              <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-colors border border-white/10 w-full justify-center text-white">
                <span className="font-bold">Google Play</span>
                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Soon</span>
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Ayurdnyanam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
