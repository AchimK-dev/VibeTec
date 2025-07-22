import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { getAllBookings, confirmBooking, rejectBooking, getAllUsers, deleteUser, updateUserRole, createArtist } from '@/data';
import { useAuth } from '@/context';

const ModernAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State für aktiven Tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('all');
  const [bookingsLoading, setBookingsLoading] = useState(false);
  
  // Users State
  const [users, setUsers] = useState([]);
  const [userFilter, setUserFilter] = useState('all');
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Create Artist State
  const [artistForm, setArtistForm] = useState({
    name: '',
    musicGenre: '',
    image: '',
    description: '',
    pricePerHour: ''
  });
  const [artistLoading, setArtistLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadBookings();
    loadUsers();
  }, []);

  // Bookings Functions
  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleConfirmBooking = async (artistId, bookingId) => {
    try {
      await confirmBooking(artistId, bookingId);
      toast.success('Booking confirmed successfully!');
      loadBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRejectBooking = async (artistId, bookingId) => {
    if (window.confirm('Are you sure you want to reject this booking?')) {
      try {
        await rejectBooking(artistId, bookingId);
        toast.success('Booking rejected successfully!');
        loadBookings();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Users Functions
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully!');
        loadUsers();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const action = newRole === 'admin' ? 'promote to admin' : 'remove admin rights';
    if (window.confirm(`Are you sure you want to ${action}?`)) {
      try {
        await updateUserRole(userId, newRole);
        toast.success('User role updated successfully!');
        loadUsers();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Create Artist Functions
  const handleArtistChange = (e) => {
    setArtistForm({ ...artistForm, [e.target.name]: e.target.value });
  };

  const handleCreateArtist = async (e) => {
    e.preventDefault();
    try {
      const { name, musicGenre, image, description, pricePerHour } = artistForm;
      if (!name || !musicGenre || !image || !description || !pricePerHour) {
        throw new Error('All fields are required');
      }
      if (parseFloat(pricePerHour) <= 0) {
        throw new Error('Price per hour must be greater than 0');
      }
      setArtistLoading(true);
      const newArtist = await createArtist({ 
        name, 
        musicGenre, 
        image, 
        description, 
        pricePerHour: parseFloat(pricePerHour) 
      });
      setArtistForm({ name: '', musicGenre: '', image: '', description: '', pricePerHour: '' });
      toast.success('Artist created successfully!');
      navigate(`/artist/${newArtist._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setArtistLoading(false);
    }
  };

  // Filter functions
  const filteredBookings = bookings.filter(booking => {
    if (bookingFilter === 'pending') return !booking.isConfirmed;
    if (bookingFilter === 'confirmed') return booking.isConfirmed;
    return true;
  });

  const filteredUsers = users.filter(userData => {
    if (userFilter === 'admin') return userData.role === 'ADMIN';
    if (userFilter === 'user') return userData.role !== 'ADMIN';
    return true;
  });

  // Format functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeRange = (booking) => {
    return `${booking.startTime} - ${booking.endTime}`;
  };

  // Stats calculations
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => !b.isConfirmed).length;
  const confirmedBookings = bookings.filter(b => b.isConfirmed).length;
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'ADMIN').length;
  const regularUsers = users.filter(u => u.role !== 'ADMIN').length;

  return (
    <div className="page-container-no-padding">
      <div className="w-full min-h-screen">
        <div className="bg-white rounded-xl shadow-lg p-12 min-h-screen">
          <div className="w-full max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
              <p className="text-xl text-gray-600">Comprehensive management center for VibeTec</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-12">
              <div className="bg-gray-100 rounded-xl p-2 flex space-x-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'overview' 
                      ? 'bg-[#BDFF00] text-black shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'bookings' 
                      ? 'bg-[#BDFF00] text-black shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📅 Bookings
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'users' 
                      ? 'bg-[#BDFF00] text-black shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  👥 Users
                </button>
                <button
                  onClick={() => setActiveTab('artists')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'artists' 
                      ? 'bg-[#BDFF00] text-black shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🎵 Create Artist
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Bookings</p>
                        <p className="text-3xl font-bold">{totalBookings}</p>
                      </div>
                      <div className="text-4xl">📅</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100">Pending</p>
                        <p className="text-3xl font-bold">{pendingBookings}</p>
                      </div>
                      <div className="text-4xl">⏳</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Confirmed</p>
                        <p className="text-3xl font-bold">{confirmedBookings}</p>
                      </div>
                      <div className="text-4xl">✅</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Total Users</p>
                        <p className="text-3xl font-bold">{totalUsers}</p>
                      </div>
                      <div className="text-4xl">👥</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#BDFF00] pb-3">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="bg-white rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                    >
                      <div className="text-3xl mb-3">📅</div>
                      <h3 className="font-bold text-gray-800 mb-2">Manage Bookings</h3>
                      <p className="text-gray-600 text-sm">View and confirm artist bookings</p>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('users')}
                      className="bg-white rounded-lg p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow"
                    >
                      <div className="text-3xl mb-3">👥</div>
                      <h3 className="font-bold text-gray-800 mb-2">Manage Users</h3>
                      <p className="text-gray-600 text-sm">Control user accounts and permissions</p>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('artists')}
                      className="bg-white rounded-lg p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow"
                    >
                      <div className="text-3xl mb-3">🎵</div>
                      <h3 className="font-bold text-gray-800 mb-2">Add Artists</h3>
                      <p className="text-gray-600 text-sm">Create new artist profiles</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-800">Booking Management</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setBookingFilter('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        bookingFilter === 'all' ? 'bg-[#BDFF00] text-black' : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      All ({totalBookings})
                    </button>
                    <button
                      onClick={() => setBookingFilter('pending')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        bookingFilter === 'pending' ? 'bg-[#BDFF00] text-black' : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      Pending ({pendingBookings})
                    </button>
                    <button
                      onClick={() => setBookingFilter('confirmed')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        bookingFilter === 'confirmed' ? 'bg-[#BDFF00] text-black' : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      Confirmed ({confirmedBookings})
                    </button>
                  </div>
                </div>

                {bookingsLoading ? (
                  <div className="text-center py-12">
                    <div className="loading loading-spinner loading-lg"></div>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No bookings found</h3>
                    <p className="text-gray-800">
                      {bookingFilter === 'pending' 
                        ? 'No pending bookings at the moment' 
                        : bookingFilter === 'confirmed' 
                        ? 'No confirmed bookings yet' 
                        : 'No bookings have been made yet'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-gray-800 font-bold">Status</th>
                            <th className="text-gray-800 font-bold">Artist</th>
                            <th className="text-gray-800 font-bold">Date & Time</th>
                            <th className="text-gray-800 font-bold">Price</th>
                            <th className="text-gray-800 font-bold">Client</th>
                            <th className="text-gray-800 font-bold">Event Details</th>
                            <th className="text-gray-800 font-bold">Booking Date</th>
                            <th className="text-gray-800 font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50">
                              <td>
                                <div className={`badge ${booking.isConfirmed ? 'badge-success' : 'badge-warning'}`}>
                                  {booking.isConfirmed ? 'Confirmed' : 'Pending'}
                                </div>
                              </td>
                              <td>
                                <div className="font-bold text-gray-800">{booking.artistName}</div>
                              </td>
                              <td>
                                <div className="font-medium">
                                  {booking.isMultiDay ? (
                                    <>
                                      {formatDate(booking.date)} - {formatDate(booking.endDate)}
                                    </>
                                  ) : (
                                    formatDate(booking.date)
                                  )}
                                </div>
                                <div className="text-sm text-gray-800">
                                  {formatTimeRange(booking)}
                                </div>
                              </td>
                              <td>
                                {booking.totalPrice ? (
                                  <div className="text-lg font-bold text-green-600">
                                    {booking.totalPrice}€
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-800">-</div>
                                )}
                              </td>
                              <td>
                                <div className="font-medium">{booking.clientName}</div>
                                {booking.clientEmail && (
                                  <div className="text-sm text-gray-800">{booking.clientEmail}</div>
                                )}
                                {booking.clientPhone && (
                                  <div className="text-sm text-gray-800">{booking.clientPhone}</div>
                                )}
                              </td>
                              <td>
                                <div className="max-w-xs truncate text-gray-800">
                                  {booking.eventDetails || 'No details provided'}
                                </div>
                              </td>
                              <td>
                                <div className="text-sm text-gray-800">
                                  {formatDateTime(booking.createdAt)}
                                </div>
                              </td>
                              <td>
                                <div className="flex gap-2">
                                  {!booking.isConfirmed ? (
                                    <>
                                      <button
                                        onClick={() => handleConfirmBooking(booking.artistId, booking._id)}
                                        className="btn btn-success btn-sm"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() => handleRejectBooking(booking.artistId, booking._id)}
                                        className="btn btn-error btn-sm"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleRejectBooking(booking.artistId, booking._id)}
                                      className="btn btn-error btn-sm"
                                    >
                                      Cancel
                                    </button>
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
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setUserFilter('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        userFilter === 'all' ? 'bg-[#BDFF00] text-black' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      All ({totalUsers})
                    </button>
                    <button
                      onClick={() => setUserFilter('admin')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        userFilter === 'admin' ? 'bg-[#BDFF00] text-black' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Admins ({adminUsers})
                    </button>
                    <button
                      onClick={() => setUserFilter('user')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        userFilter === 'user' ? 'bg-[#BDFF00] text-black' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Users ({regularUsers})
                    </button>
                  </div>
                </div>

                {usersLoading ? (
                  <div className="text-center py-12">
                    <div className="loading loading-spinner loading-lg"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No users found</h3>
                    <p className="text-gray-500">
                      {userFilter === 'admin' 
                        ? 'No admin users found' 
                        : userFilter === 'user' 
                        ? 'No regular users found' 
                        : 'No users in the system'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-gray-700 font-bold">User</th>
                            <th className="text-gray-700 font-bold">Email</th>
                            <th className="text-gray-700 font-bold">Role</th>
                            <th className="text-gray-700 font-bold">Member Since</th>
                            <th className="text-gray-700 font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((userData) => (
                            <tr key={userData._id} className="hover:bg-gray-50">
                              <td>
                                <div className="font-bold text-gray-800">
                                  {userData.firstName} {userData.lastName}
                                </div>
                              </td>
                              <td>
                                <span className="text-gray-700">{userData.email}</span>
                              </td>
                              <td>
                                <div className={`badge ${userData.role === 'ADMIN' ? 'badge-primary' : 'badge-secondary'}`}>
                                  {userData.role === 'ADMIN' ? 'Admin' : 'User'}
                                </div>
                              </td>
                              <td>
                                <span className="text-gray-700">
                                  {formatDate(userData.createdAt)}
                                </span>
                              </td>
                              <td>
                                <div className="flex gap-2">
                                  {userData._id !== user.id && (
                                    <>
                                      {userData.role === 'ADMIN' ? (
                                        <button
                                          onClick={() => handleRoleChange(userData._id, 'user')}
                                          className="btn btn-warning btn-sm"
                                          title="Remove admin rights"
                                        >
                                          Remove Admin
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleRoleChange(userData._id, 'admin')}
                                          className="btn btn-success btn-sm"
                                          title="Make admin"
                                        >
                                          Make Admin
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteUser(userData._id)}
                                        className="btn btn-error btn-sm"
                                        title="Delete user"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                  {userData._id === user.id && (
                                    <span className="text-sm text-gray-400 italic">Current User</span>
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
            )}

            {/* Create Artist Tab */}
            {activeTab === 'artists' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Artist</h2>
                  <p className="text-gray-600">Add a new artist to the VibeTec platform</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-gray-50 rounded-xl p-8 shadow-md">
                    <form onSubmit={handleCreateArtist} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                            Artist Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={artistForm.name}
                            onChange={handleArtistChange}
                            className="input w-full bg-white border-2 border-gray-300 text-black placeholder-gray-400 focus:border-[#BDFF00] focus:ring-2 focus:ring-[#BDFF00] focus:ring-opacity-50 rounded-lg p-4"
                            placeholder="Enter artist name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                            Music Genre *
                          </label>
                          <input
                            type="text"
                            name="musicGenre"
                            value={artistForm.musicGenre}
                            onChange={handleArtistChange}
                            className="input w-full bg-white border-2 border-gray-300 text-black placeholder-gray-400 focus:border-[#BDFF00] focus:ring-2 focus:ring-[#BDFF00] focus:ring-opacity-50 rounded-lg p-4"
                            placeholder="e.g., Electronic, Hip-Hop, Rock"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                          Image URL *
                        </label>
                        <input
                          type="url"
                          name="image"
                          value={artistForm.image}
                          onChange={handleArtistChange}
                          className="input w-full bg-white border-2 border-gray-300 text-black placeholder-gray-400 focus:border-[#BDFF00] focus:ring-2 focus:ring-[#BDFF00] focus:ring-opacity-50 rounded-lg p-4"
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                          Price per Hour (€) *
                        </label>
                        <input
                          type="number"
                          name="pricePerHour"
                          value={artistForm.pricePerHour}
                          onChange={handleArtistChange}
                          className="input w-full bg-white border-2 border-gray-300 text-black placeholder-gray-400 focus:border-[#BDFF00] focus:ring-2 focus:ring-[#BDFF00] focus:ring-opacity-50 rounded-lg p-4"
                          placeholder="150"
                          min="1"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={artistForm.description}
                          onChange={handleArtistChange}
                          className="textarea w-full bg-white border-2 border-gray-300 text-black placeholder-gray-400 focus:border-[#BDFF00] focus:ring-2 focus:ring-[#BDFF00] focus:ring-opacity-50 rounded-lg p-4 h-32"
                          placeholder="Describe the artist's style, experience, and what makes them unique..."
                          required
                        />
                      </div>

                      <div className="flex gap-4 pt-6">
                        <button
                          type="button"
                          onClick={() => setArtistForm({ name: '', musicGenre: '', image: '', description: '', pricePerHour: '' })}
                          className="btn flex-1 bg-gray-400 hover:bg-gray-500 text-white border-gray-400 hover:border-gray-500 rounded-3xl py-3 font-semibold transition-all duration-200"
                        >
                          Clear Form
                        </button>
                        <button
                          type="submit"
                          className="btn flex-1 text-black font-bold hover:scale-105 transition-all duration-200 rounded-3xl py-3"
                          style={{backgroundColor: '#BDFF00', border: 'none'}}
                          disabled={artistLoading}
                        >
                          {artistLoading ? 'Creating...' : 'Create Artist'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAdminDashboard;
