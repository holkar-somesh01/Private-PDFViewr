import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import PDFViewer from './pages/PDFViewer';
import AdminDashboard from './pages/AdminDashboard';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';

const ProtectedRoute = ({ children, requireAdmin }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requireAdmin && user?.role !== 'Super Admin' && user?.role !== 'Admin') return <Navigate to="/" />;
  return <>{children}</>;
};

import { Toaster } from 'react-hot-toast';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/adminpanel" element={<Login isAdminLogin />} />

      {/* Protected User Routes */}
      <Route path="/phases" element={<ProtectedRoute><MainLayout><Home /></MainLayout></ProtectedRoute>} />
      <Route path="/pdf/:id" element={<ProtectedRoute><PDFViewer /></ProtectedRoute>} />

      {/* Admin Panel Routes */}
      <Route path="/dashboard/admin/*" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
