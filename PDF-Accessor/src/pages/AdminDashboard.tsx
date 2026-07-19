import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// Import Components
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardOverview from '../components/admin/DashboardOverview';
import UserManagement from '../components/admin/UserManagement';
import PdfManagement from '../components/admin/PdfManagement';
import CreateUserModal from '../components/admin/modals/CreateUserModal';
import EditUserModal from '../components/admin/modals/EditUserModal';
import AuditManagement from '../components/admin/AuditManagement';
import UploadPdfModal from '../components/admin/modals/UploadPdfModal';
import ManageAccessModal from '../components/admin/modals/ManageAccessModal';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const params = useParams();
  const activeTab = params['*'] || 'dashboard';
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Data State
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const [pdfs, setPdfs] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);

  // Modals State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isUploadPdfModalOpen, setIsUploadPdfModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedPhaseIds, setSelectedPhaseIds] = useState<string[]>([]);

  // Forms State
  const [newUser, setNewUser] = useState({ name: '', email: '', mobile: '', role: 'User' });
  const [newPdf, setNewPdf] = useState({ title: '', description: '', subject: '', category: '' });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, limit, searchQuery, sortBy, order, refreshTrigger]);

  useEffect(() => {
    fetchPdfs();
    fetchPhases();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users`, {
        params: { page: currentPage, limit, search: searchQuery, sortBy, order }
      });
      setUsers(res.data.users || res.data); // fallback if array is returned
      if (res.data.total !== undefined) setTotalUsers(res.data.total);
      if (res.data.totalPages !== undefined) setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPdfs = async () => {
    try {
      const res = await api.get('/admin/pdfs');
      setPdfs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPhases = async () => {
    try {
      const res = await api.get('/admin/phases');
      setPhases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openAssignModal = async (userId: string) => {
    setSelectedUserId(userId);
    setIsAssignModalOpen(true);
    try {
      const res = await api.get(`/admin/users/${userId}/phases`);
      setSelectedPhaseIds(res.data.map((p: any) => p._id || p.id));
    } catch (err) {
      console.error('Failed to fetch user phases', err);
    }
  };

  const handleSaveAccess = async () => {
    if (!selectedUserId) return;
    try {
      await api.post('/admin/permissions/assign', {
        userId: selectedUserId,
        phaseIds: selectedPhaseIds
      });
      toast.success('Access updated successfully!');
      setIsAssignModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving access');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newUser);
      fetchUsers();
      setNewUser({ name: '', email: '', mobile: '', role: 'User' });
      setIsCreateUserModalOpen(false);
      toast.success('User created and credentials sent to email!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser._id || editingUser.id}`, editingUser);
      fetchUsers();
      setIsEditUserModalOpen(false);
      setEditingUser(null);
      toast.success('User updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
      toast.success('User deleted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleToggleBlock = async (userObj: any) => {
    try {
      await api.put(`/admin/users/${userObj._id || userObj.id}`, { isBlocked: !userObj.isBlocked });
      fetchUsers();
      toast.success(userObj.isBlocked ? 'User unblocked successfully!' : 'User blocked successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating block status');
    }
  };

  const handleUploadPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !thumbnailFile) return alert('Select both files');

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('thumbnail', thumbnailFile);
    formData.append('title', newPdf.title);
    formData.append('description', newPdf.description);
    formData.append('subject', newPdf.subject);
    formData.append('category', newPdf.category);

    try {
      await api.post('/admin/pdfs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchPdfs();
      setIsUploadPdfModalOpen(false);
      setNewPdf({ title: '', description: '', subject: '', category: '' });
      setPdfFile(null);
      setThumbnailFile(null);
      toast.success('PDF uploaded successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error uploading PDF');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login/adminpanel');
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Data refreshed!');
  };

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans">
      <AdminSidebar 
        activeTab={activeTab} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        user={user} 
      />

      <div className="flex-1 flex flex-col overflow-hidden relative w-full md:w-[calc(100%-18rem)]">
        <AdminHeader 
          activeTab={activeTab} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
          onLogout={handleLogout}
          onRefresh={handleRefresh}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-transparent">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {activeTab === 'dashboard' && <DashboardOverview usersCount={totalUsers || users.length} pdfsCount={pdfs.length} />}
            {activeTab === 'users' && (
              <UserManagement 
                users={users} 
                totalUsers={totalUsers || users.length}
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setCurrentPage}
                limit={limit}
                setLimit={setLimit}
                search={searchQuery}
                setSearch={setSearchQuery}
                sortBy={sortBy}
                order={order}
                setSort={(field) => {
                  if (sortBy === field) {
                    setOrder(order === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy(field);
                    setOrder('asc');
                  }
                }}
                openAssignModal={openAssignModal} 
                openCreateModal={() => setIsCreateUserModalOpen(true)} 
                openEditModal={(u) => { setEditingUser(u); setIsEditUserModalOpen(true); }}
                handleDeleteUser={handleDeleteUser}
                handleToggleBlock={handleToggleBlock}
              />
            )}
            {activeTab === 'pdfs' && <PdfManagement pdfs={pdfs} openUploadModal={() => setIsUploadPdfModalOpen(true)} />}
            {activeTab === 'audit' && <AuditManagement refreshTrigger={refreshTrigger} />}
          </div>
        </main>
      </div>

      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        newUser={newUser}
        setNewUser={setNewUser}
        onSubmit={handleCreateUser}
      />

      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        onSubmit={handleEditUserSubmit}
      />

      <UploadPdfModal
        isOpen={isUploadPdfModalOpen}
        onClose={() => setIsUploadPdfModalOpen(false)}
        newPdf={newPdf}
        setNewPdf={setNewPdf}
        setPdfFile={setPdfFile}
        setThumbnailFile={setThumbnailFile}
        onSubmit={handleUploadPdf}
      />

      <ManageAccessModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        phases={phases}
        selectedPhaseIds={selectedPhaseIds}
        setSelectedPhaseIds={setSelectedPhaseIds}
        onSave={handleSaveAccess}
      />
    </div>
  );
};

export default AdminDashboard;
