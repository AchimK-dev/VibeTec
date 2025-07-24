import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { changePassword, getUserBookings } from '@/data';
import { useAuth } from '@/context';

const UserProfile = () => {
  const { user } = useAuth();
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookingStats();
  }, []);

  const loadBookingStats = async () => {
    try {
      const bookings = await getUserBookings();
      
      const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'PENDING').length,
        confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
        rejected: bookings.filter(b => b.status === 'REJECTED').length
      };
      
      setBookingStats(stats);
    } catch (error) {
      // Keep stats at 0 if API fails
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-no-padding">
      {/* Eine große Kachel über die gesamte Breite */}
      <div className="w-full min-h-screen">
        
        {/* User Profil Kachel (volle Breite) */}
        <div className="bg-[#0C0F1A] rounded-xl shadow-lg p-6 lg:p-12 min-h-screen flex flex-col">
          <div className="w-full max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 lg:mb-8">User Profile</h1>
              
              {/* User Avatar and Basic Info */}
              <div className="flex flex-col items-center mb-6 lg:mb-8">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-[#BDFF00] to-[#a3e600] rounded-full mb-4 lg:mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl lg:text-4xl font-bold text-black">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text- mb-3">
                  {user?.firstName} {user?.lastName}
                </h2>
                <div className={`badge badge-lg px-4 lg:px-6 py-2 lg:py-3 text-base lg:text-lg ${user?.role === 'ADMIN' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                  {user?.role === 'ADMIN' ? 'Administrator' : 'User'}
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
              
              {/* Account Information Section */}
              <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-xl p-6 lg:p-8 shadow-md">
                <h2 className="text-xl lg:text-2xl font-bold mb-6 text-white border-b-2 border-[#BDFF00] pb-3">Account Information</h2>
                <div className="space-y-4 lg:space-y-6">
                  <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-lg p-4 lg:p-6">
                    <label className="block text-xs lg:text-sm font-bold text-white mb-2 uppercase tracking-wide">
                      Email Address
                    </label>
                    <p className="text-lg lg:text-xl text-white font-medium break-all">{user?.email}</p>
                  </div>

                  <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-lg p-4 lg:p-6">
                    <label className="block text-xs lg:text-sm font-bold text-white mb-2 uppercase tracking-wide">
                      Member Since
                    </label>
                    <p className="text-lg lg:text-xl text-white font-medium">
                      {new Date(user?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {user?.role === 'ADMIN' && (
                    <div className="bg-[#0C0F1A] rounded-lg p-4 lg:p-6 border-1 border-red-500">
                      <label className="block text-xs lg:text-sm font-bold text-red-700 mb-3 uppercase tracking-wide">
                        Administrator Privileges
                      </label>
                      <ul className="text-xs lg:text-sm text-red-600 space-y-2">
                        <li className="flex items-center"><span className="mr-2">🔧</span> Manage all artists</li>
                        <li className="flex items-center"><span className="mr-2">📅</span> View and confirm bookings</li>
                        <li className="flex items-center"><span className="mr-2">📊</span> Access admin dashboard</li>
                        <li className="flex items-center"><span className="mr-2">👥</span> Manage user accounts</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* My Bookings Quick Access Section */}
              <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-xl p-6 lg:p-8 shadow-md">
                <h2 className="text-xl lg:text-2xl font-bold mb-6 text-white border-b-2 border-[#BDFF00] pb-3">My Bookings</h2>
                <div className="space-y-4 lg:space-y-6">
                  
                  {/* Quick Stats */}
                  <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-lg p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl lg:text-4xl">📅</span>
                      <div className="text-right">
                        <p className="text-xl lg:text-2xl font-bold text-white">{bookingStats.total}</p>
                        <p className="text-xs lg:text-sm text-white">Total Bookings</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 lg:gap-3 text-center text-xs lg:text-sm">
                      <div>
                        <p className="font-bold text-yellow-600">{bookingStats.pending}</p>
                        <p className="text-white">Pending</p>
                      </div>
                      <div>
                        <p className="font-bold text-green-600">{bookingStats.confirmed}</p>
                        <p className="text-white">Confirmed</p>
                      </div>
                      <div>
                        <p className="font-bold text-red-600">{bookingStats.rejected}</p>
                        <p className="text-white">Rejected</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <button 
                      className="btn w-full text-black font-bold hover:scale-105 transition-all duration-200 rounded-3xl py-2 lg:py-3 text-sm lg:text-base"
                      style={{backgroundColor: '#BDFF00', border: 'none'}}
                      onClick={() => window.location.href = '/my-bookings'}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>📋</span>
                        View All Bookings
                      </span>
                    </button>
                    <button 
                      className="btn w-full text-black font-bold hover:scale-105 transition-all duration-200 rounded-3xl py-2 lg:py-3 text-sm lg:text-base"
                      style={{backgroundColor: '#BDFF00', border: 'none'}}
                      onClick={() => window.location.href = '/artists'}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>🎵</span>
                        Book New Artist
                      </span>
                    </button>
                  </div>

                  {/* Recent Activity Hint */}
                  <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-lg p-3 lg:p-4">
                    <h4 className="font-bold text-gray-400 mb-2 text-sm lg:text-base">💡 Quick Tip</h4>
                    <p className="text-xs lg:text-sm text-gray-400">
                      View and manage all your artist bookings from one place. Track booking status, edit event details, and communicate with artists.
                    </p>
                  </div>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-xl p-6 lg:p-8 shadow-md">
                <h2 className="text-xl lg:text-2xl font-bold mb-6 text-white border-b-2 border-[#BDFF00] pb-3">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4 lg:space-y-6">
                  <div>
                    <label className="block text-xs lg:text-sm font-bold text-white mb-2 uppercase tracking-wide">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      className="input w-full bg-[#0C0F1A] border-1 border-[#BDFF00] text-white placeholder-gray-400 focus:border-[#BDFF00] focus:ring-2 focus:ring-[#BDFF00] focus:ring-opacity-50 rounded-lg p-4"
                      placeholder="Enter current password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        currentPassword: e.target.value
                      }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-bold text-white mb-2 uppercase tracking-wide">
                      New Password *
                    </label>
                    <input
                      type="password"
                      className="input w-full bg-[#0C0F1A] border-1 border-[#BDFF00] text-white placeholder-gray-400 focus:border-[#BDFF00] focus:ring-2 focus:ring-[#BDFF00] focus:ring-opacity-50 rounded-lg p-4"
                      placeholder="Enter new password (min 8 characters)"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        newPassword: e.target.value
                      }))}
                      required
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-bold text-white mb-2 uppercase tracking-wide">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      className="input w-full bg-[#0C0F1A] border-1 border-[#BDFF00] text-white placeholder-gray-400 focus:border-[#BDFF00] focus:ring-2 focus:ring-[#BDFF00] focus:ring-opacity-50 rounded-lg p-4"
                      placeholder="Confirm new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        confirmPassword: e.target.value
                      }))}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:pt-6">
                    <button
                      type="button"
                      className="btn flex-1 bg-[#0C0F1A] border-1 border-[#BDFF00] text-white font-bold hover:scale-105 transition-all duration-200 rounded-3xl py-3"
                      onClick={() => setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      })}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn flex-1 text-black font-bold hover:scale-105 transition-all duration-200 rounded-3xl py-3"
                      style={{backgroundColor: '#BDFF00', border: 'none'}}
                      disabled={loading}
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
              
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default UserProfile;
