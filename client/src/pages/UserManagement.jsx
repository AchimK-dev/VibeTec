import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, deleteUser, updateUserRole } from '@/data';
import { useAuth } from '@/context';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'admin', 'user'

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully!');
        loadUsers(); // Reload users
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const action = newRole === 'admin' ? 'promote to admin' : 'remove admin rights';
    if (window.confirm(`Are you sure you want to ${action} for this user?`)) {
      try {
        await updateUserRole(userId, newRole);
        toast.success(`User role updated successfully!`);
        loadUsers(); // Reload users
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const filteredUsers = users.filter(userData => {
    if (filter === 'admin') return userData.role === 'ADMIN';
    if (filter === 'user') return userData.role !== 'ADMIN';
    return true; // 'all'
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="page-container-no-padding">
        <div className="w-full min-h-screen">
          <div className="bg-white rounded-xl shadow-lg p-12 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-[#BDFF00]"></div>
              <p className="text-xl text-gray-600 mt-4">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if current user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="page-container-no-padding">
        <div className="w-full min-h-screen">
          <div className="bg-white rounded-xl shadow-lg p-12 min-h-screen flex items-center justify-center">
            <div className="text-center bg-red-50 rounded-xl p-12 border-2 border-red-200">
              <div className="text-6xl mb-6">🚫</div>
              <h2 className="text-3xl font-bold text-red-700 mb-4">Access Denied</h2>
              <p className="text-xl text-red-600 mb-6">You need admin privileges to access this page.</p>
              <button 
                onClick={() => window.history.back()}
                className="btn text-black font-bold border-2 border-black hover:scale-105 transition-all duration-200 rounded-lg px-8 py-3"
                style={{backgroundColor: '#BDFF00'}}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-no-padding">
      {/* Eine große Kachel über die gesamte Breite */}
      <div className="w-full min-h-screen">
        
        {/* User Management Kachel (volle Breite) */}
        <div className="bg-white rounded-xl shadow-lg p-12 min-h-screen flex flex-col">
          <div className="w-full max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">User Management</h1>
              <p className="text-xl text-gray-600">Manage all system users</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center mb-8">
              <div className="tabs tabs-boxed bg-gray-100 p-2 rounded-xl">
                <button 
                  className={`tab tab-lg px-6 ${filter === 'all' ? 'tab-active bg-[#BDFF00] text-black font-bold' : 'text-gray-600'}`}
                  onClick={() => setFilter('all')}
                >
                  All Users ({users.length})
                </button>
                <button 
                  className={`tab tab-lg px-6 ${filter === 'admin' ? 'tab-active bg-[#BDFF00] text-black font-bold' : 'text-gray-600'}`}
                  onClick={() => setFilter('admin')}
                >
                  Admins ({users.filter(u => u.role === 'ADMIN').length})
                </button>
                <button 
                  className={`tab tab-lg px-6 ${filter === 'user' ? 'tab-active bg-[#BDFF00] text-black font-bold' : 'text-gray-600'}`}
                  onClick={() => setFilter('user')}
                >
                  Users ({users.filter(u => u.role !== 'ADMIN').length})
                </button>
              </div>
            </div>

            {/* Users Content */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <div className="text-6xl mb-4">👥</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No users found</h2>
                <p className="text-gray-600">
                  {filter === 'admin' 
                    ? 'No admin users found' 
                    : filter === 'user' 
                    ? 'No regular users found' 
                    : 'No users in the system'
                  }
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 shadow-md">
                <div className="overflow-x-auto">
                  <table className="table table-zebra bg-white w-full rounded-lg overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="py-4 px-6 text-left">User</th>
                        <th className="py-4 px-6 text-left">Email</th>
                        <th className="py-4 px-6 text-left">Role</th>
                        <th className="py-4 px-6 text-left">Member Since</th>
                        <th className="py-4 px-6 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((userData) => (
                        <tr key={userData._id} className="hover:bg-gray-50 border-b border-gray-200">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#BDFF00] to-[#a3e600] rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-black">
                                  {userData.firstName?.[0]}{userData.lastName?.[0]}
                                </span>
                              </div>
                              <div className="font-bold text-gray-800">
                                {userData.firstName} {userData.lastName}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-700">{userData.email}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className={`badge badge-lg px-4 py-2 ${userData.role === 'ADMIN' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                              {userData.role === 'ADMIN' ? 'Admin' : 'User'}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-700">
                              {formatDate(userData.createdAt)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              {userData._id !== user.id && (
                                <>
                                  {userData.role === 'ADMIN' ? (
                                    <button
                                      onClick={() => handleRoleChange(userData._id, 'user')}
                                      className="btn btn-warning btn-sm hover:scale-105 transition-transform"
                                      title="Remove admin rights"
                                    >
                                      Remove Admin
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleRoleChange(userData._id, 'admin')}
                                      className="btn btn-success btn-sm hover:scale-105 transition-transform"
                                      title="Make admin"
                                    >
                                      Make Admin
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteUser(userData._id)}
                                    className="btn btn-error btn-sm hover:scale-105 transition-transform"
                                    title="Delete user"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                              {userData._id === user.id && (
                                <span className="text-sm text-gray-500 italic bg-gray-100 px-3 py-1 rounded-full">Current User</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default UserManagement;
