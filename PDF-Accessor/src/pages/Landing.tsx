import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Play, MessageCircle, Star, BookOpen, CheckCircle, BrainCircuit, Activity } from 'lucide-react';
import Logo from '../assets/Logo.jpeg';
import LogoName from '../assets/logoName.jpeg';

const Landing = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated && user?.role === 'Super Admin') {
      navigate('/dashboard/admin');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-[#F8F9FB] text-[#171A26]">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
          
          <div className="mb-6 flex flex-col items-center gap-4">
            <img src={Logo} alt="Ayurdnyanam Logo" className="w-24 h-24 object-contain rounded-xl shadow-sm" />
            <img src={LogoName} alt="Ayurdnyanam" className="h-10 object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-sm mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Trusted by 10,000+ Students</span>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 font-semibold text-sm mb-8 shadow-sm">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Exclusive Platform for Premium BAMS Notes Only</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-4 leading-tight">
            GRASP, RECALL, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">MASTER</span>
          </h1>
          
          <p className="text-2xl font-medium text-gray-500 mb-6">
            || ज्ञानं सर्वार्थ साधनम् ||
          </p>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
            Premium Handwritten Notes meticulously crafted for BAMS Course success.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={() => navigate('/phases')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              Get Premium Notes
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" /> Google Play
            </button>
            <a
              href="https://wa.me/919158739395"
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-emerald-500 text-emerald-600 font-bold text-lg rounded-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp Us
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Star className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="font-bold text-lg">10,000+ Students</h3>
              <p className="text-sm text-gray-500">ACHIEVING EXCELLENCE</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <BrainCircuit className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-bold text-lg">Mnemonics & Tricks</h3>
              <p className="text-sm text-gray-500">FOR COMPLEX SHLOKAS</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Activity className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-bold text-lg">Visual Learning</h3>
              <p className="text-sm text-gray-500">FLOWCHARTS & DIAGRAMS</p>
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                THE VISIONARY BEHIND THE NOTES:
                <span className="block text-gray-500 text-2xl mt-2">Simplifying the Vast Ocean of Ayurvedic Wisdom</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Led by an experienced educator in the BAMS field, Ayurdnyanam is built on three core pillars:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <p><span className="font-bold">Exam-Oriented Focus:</span> Master topics directly relevant to your exams.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <p><span className="font-bold">Structured Learning:</span> Flow smoothly from foundational to advanced concepts.</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <p><span className="font-bold">Academic Excellence:</span> Achieve top grades with confidence.</p>
                </li>
              </ul>
              <p className="text-gray-600 italic">
                "We believe that every student deserves notes that are as easy to understand as they are deep in knowledge. Our approach turns complex Shlokas into memorable codes, ensuring you achieve academic excellence with ease."
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="text-4xl mb-3">👨‍🏫</div>
                <h4 className="font-bold text-gray-900">3+ Years</h4>
                <p className="text-sm text-gray-500">Experience</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-bold text-gray-900">Exam-Focused</h4>
                <p className="text-sm text-gray-500">Approach</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="text-4xl mb-3">📈</div>
                <h4 className="font-bold text-gray-900">Proven</h4>
                <p className="text-sm text-gray-500">Results</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="text-4xl mb-3">🎓</div>
                <h4 className="font-bold text-gray-900">Experienced</h4>
                <p className="text-sm text-gray-500">Faculty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h4 className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-2">EXPERT CURRICULUM</h4>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Explore The Subjects</h2>
            <p className="text-gray-600 text-lg">
              Comprehensive handwritten notes across all BAMS phases, meticulously designed for deep understanding and university-level excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="font-black text-xl">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">First Phase</h3>
              <ul className="space-y-4 text-gray-600 font-medium flex-1">
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Padartha Vigyan</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Samskritam evam Ayurved Itihas</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Kriya Sharira</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Rachana Sharira</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Samhita Adhyayan – 1</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="font-black text-xl">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Second Phase</h3>
              <ul className="space-y-4 text-gray-600 font-medium flex-1">
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Dravyaguna Vigyan</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Rasashastra evam Bhaishajya Kalpana</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Roga Nidan evam Vikriti Vigyan</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Agad Tantra evam Vidhi Vaidyaka</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Swasthavritta evam Yoga</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Samhita Adhyayan – 2</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="font-black text-xl">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Third Phase</h3>
              <ul className="space-y-4 text-gray-600 font-medium flex-1">
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Kayachikitsa</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Panchakarma & Upakarma</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Shalya Tantra</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Shalakya Tantra</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Prasuti Tantra evam Stree Roga</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Kaumarabhritya</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => navigate('/phases')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              Enroll for Excellence →
            </button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-zinc-900 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">OUR IMPACT: Join the community where Academic Excellence is the Standard.</h2>
          <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
            Our results speak louder than words. We've helped hundreds of BAMS students turn complex BAMS Course subjects into their strongest areas.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div>
              <div className="text-5xl font-black text-emerald-400 mb-2">2500+</div>
              <div className="text-gray-300 font-medium">Happy Students</div>
            </div>
            <div>
              <div className="text-5xl font-black text-emerald-400 mb-2">99%</div>
              <div className="text-gray-300 font-medium">Passing Rate</div>
            </div>
            <div>
              <div className="text-5xl font-black text-emerald-400 mb-2">100%</div>
              <div className="text-gray-300 font-medium">Authentic Data</div>
            </div>
            <div>
              <div className="text-5xl font-black text-emerald-400 mb-2">15+</div>
              <div className="text-gray-300 font-medium">University Toppers</div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-white text-gray-900 font-black text-xl rounded-xl shadow-lg hover:bg-gray-100 hover:scale-105 transition-all"
          >
            Start Your Journey Now →
          </button>
        </div>
      </section>

    </div>
  );
};

export default Landing;
