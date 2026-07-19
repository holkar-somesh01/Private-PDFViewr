import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, Sparkles, Key, AlertTriangle } from 'lucide-react';

const Login = ({ isAdminLogin = false }: { isAdminLogin?: boolean }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'Super Admin' || user?.role === 'Admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/phases');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/login-step-1', { email });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.accessToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid password');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.accessToken);
      navigate('/dashboard/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="relative w-full max-w-md z-10">
        <div className="backdrop-blur-xl bg-white/70 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[32px] p-8 sm:p-10 transition-all duration-500">
          
          <div className="flex flex-col items-center mb-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-5 shadow-xl transition-all duration-500 ${isAdminLogin ? 'bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-400/30' : 'bg-gradient-to-br from-emerald-500 to-blue-600 shadow-emerald-500/30'}`}>
              {isAdminLogin ? <ShieldCheck className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight text-center">
              {isAdminLogin ? 'Admin Portal' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 text-sm mt-2 text-center font-medium">
              {isAdminLogin ? 'Secure access to the management dashboard' : 'Sign in to continue to your premium resources'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-4 rounded-xl text-sm font-medium mb-6 text-center border border-red-100 flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {isAdminLogin ? (
            <form onSubmit={handleAdminLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Admin Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all outline-none font-medium text-slate-800"
                    placeholder="admin@ayurdnyanam.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all outline-none font-medium text-slate-800"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-8 shadow-xl shadow-slate-900/20 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login to Dashboard'}
              </button>
            </form>
          ) : (
            <div className="relative" style={{ height: step === 2 ? '280px' : '200px' }}>
              {step === 1 && (
                <form onSubmit={handleStep1} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 absolute w-full top-0 left-0">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-slate-800"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-8 shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleStep2} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 absolute w-full top-0 left-0">
                  <div className="text-center mb-6 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
                    <p className="text-sm font-medium text-slate-500 mb-1">Verification code sent to</p>
                    <p className="font-bold text-slate-800">{email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1 text-center">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-4 bg-white/50 border border-slate-200/80 rounded-2xl text-center text-2xl font-black tracking-[0.5em] text-slate-800 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none placeholder-slate-300"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  <button
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                  </button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleStep3} className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500 absolute w-full top-0 left-0">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-slate-800"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-8 shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Login'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
