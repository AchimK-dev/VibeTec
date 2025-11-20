import { useAuth } from "@/context";
import { useUsers } from "@/hooks/useUsers";
import { LoadingState, EmptyState } from "@/components";
import DemoUserTooltip from "@/components/UI/DemoUserTooltip";
import SortableTableHeader from "@/components/Shared/SortableTableHeader";
import TableFilters from "@/components/Shared/TableFilters";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const UserManagement = () => {
  const { user: currentUser, isDemo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    users,
    loading,
    filter,
    setFilter,
    search,
    handleSearch,
    sortField,
    sortOrder,
    handleSort,
    searchSuggestions,
    showSuggestions,
    setShowSuggestions,
    setSearch,
    handleRoleChange,
    handleDeleteUser,
  } = useUsers();

  if (!currentUser) {
    return (
      <div className="page-container-no-padding">
        <div className="w-full min-h-screen">
          <div className="bg-base-100 rounded-xl shadow-lg p-12 min-h-screen flex items-center justify-center">
            <div className="text-center bg-red-900/20 rounded-xl p-12 border-2 border-red-500">
              <div className="text-error mb-6">
                <svg
                  className="w-24 h-24 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-error mb-4">
                Access Denied
              </h2>
              <p className="text-xl text-base-content mb-6">
                You need to be logged in to access this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container-no-padding">
        <div className="bg-base-100 rounded-xl min-h-screen">
          <LoadingState message="Loading users..." />
        </div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    regularUsers: users.filter((u) => u.role !== "ADMIN").length,
  };

  return (
    <div className="page-container-no-padding">
      <div className="w-full min-h-screen">
        <div className="bg-base-100 rounded-xl shadow-lg p-4 sm:p-6 md:p-12 min-h-screen">
          <div className="w-full max-w-7xl mx-auto">
            {isDemo && (
              <div className="bg-warning/10 border-2 border-warning rounded-lg p-3 sm:p-4 mb-6 md:mb-8">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="text-warning flex-shrink-0">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-warning font-bold text-sm sm:text-base md:text-lg">
                      Demo Mode - Read-only Access
                    </p>
                    <p className="text-xs sm:text-sm text-base-content">
                      All sensitive data is anonymized. Modification actions are
                      disabled.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-base-content mb-2 md:mb-4">
                Admin Dashboard
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-base-content">
                Comprehensive management center for VibeTec
              </p>
            </div>

            <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto">
              <div className="bg-base-100 border-1 border-primary rounded-xl p-1 sm:p-2 flex space-x-1 sm:space-x-2 min-w-max">
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 text-base-content hover:text-base-content/60 flex items-center gap-1 sm:gap-2 text-sm md:text-base"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Overview</span>
                </button>
                <button
                  onClick={() => navigate("/admin-dashboard?tab=bookings")}
                  className="px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 text-base-content hover:text-base-content/60 flex items-center gap-1 sm:gap-2 text-sm md:text-base"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Bookings</span>
                </button>
                <button className="px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 bg-primary text-primary-content shadow-md flex items-center gap-1 sm:gap-2 text-sm md:text-base">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="hidden sm:inline">User Management</span>
                </button>
                <button
                  onClick={() => navigate("/admin-dashboard?tab=artists")}
                  className="px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 text-base-content hover:text-base-content/60 flex items-center gap-1 sm:gap-2 text-sm md:text-base"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="hidden sm:inline">Create Artist</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-base-200 rounded-xl p-3 sm:p-4 md:p-6 text-center">
                <p className="text-base-content/60 text-xs sm:text-sm mb-1 sm:mb-2">
                  Total Users
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
                  {stats.total}
                </p>
              </div>
              <div className="bg-base-200 rounded-xl p-3 sm:p-4 md:p-6 text-center">
                <p className="text-base-content/60 text-xs sm:text-sm mb-1 sm:mb-2">
                  Administrators
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                  {stats.admins}
                </p>
              </div>
              <div className="bg-base-200 rounded-xl p-3 sm:p-4 md:p-6 text-center">
                <p className="text-base-content/60 text-xs sm:text-sm mb-1 sm:mb-2">
                  Regular Users
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
                  {stats.regularUsers}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 md:mb-8 items-stretch md:items-center justify-between">
              <TableFilters
                searchValue={search}
                onSearchChange={handleSearch}
                suggestions={searchSuggestions}
                showSuggestions={showSuggestions}
                onSuggestionSelect={(suggestion) => {
                  setSearch(suggestion.text);
                  setShowSuggestions(false);
                }}
                onClearSearch={() => {
                  setSearch("");
                  setShowSuggestions(false);
                }}
                placeholder="Search by name or email..."
                className="w-full max-w-md"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base ${
                    filter === "all"
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content hover:bg-neutral"
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilter("admin")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base ${
                    filter === "admin"
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content hover:bg-neutral"
                  }`}
                >
                  Admins ({stats.admins})
                </button>
                <button
                  onClick={() => setFilter("user")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base ${
                    filter === "user"
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content hover:bg-neutral"
                  }`}
                >
                  Users ({stats.regularUsers})
                </button>
              </div>
            </div>

            {users.length === 0 ? (
              <EmptyState
                icon="users"
                title="No Users Found"
                message="No users match your search criteria."
              />
            ) : (
              <div className="bg-base-200 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="table w-full text-xs sm:text-sm md:text-base">
                    <thead className="bg-base-300">
                      <tr>
                        <SortableTableHeader
                          label="Name"
                          field="name"
                          currentSortField={sortField}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                        <SortableTableHeader
                          label="Email"
                          field="email"
                          currentSortField={sortField}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                        <SortableTableHeader
                          label="Role"
                          field="role"
                          currentSortField={sortField}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                        <SortableTableHeader
                          label="Joined"
                          field="createdAt"
                          currentSortField={sortField}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                        <th className="text-base-content font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userData) => (
                        <tr
                          key={userData._id}
                          className="hover:bg-base-300 transition-colors"
                        >
                          <td>
                            <div className="text-base-content text-sm font-bold">
                              {userData.firstName} {userData.lastName}
                            </div>
                          </td>
                          <td>
                            <div className="text-base-content text-sm">
                              {userData.email}
                            </div>
                          </td>
                          <td>
                            <div
                              className={`badge ${
                                userData.role === "DEMO"
                                  ? "badge-warning"
                                  : userData.role === "ADMIN"
                                  ? "badge-primary"
                                  : "badge-neutral"
                              } badge-sm`}
                            >
                              {userData.role === "DEMO"
                                ? "Demo"
                                : userData.role === "ADMIN"
                                ? "Admin"
                                : "User"}
                            </div>
                          </td>
                          <td>
                            <div className="text-base-content text-xs">
                              {new Date(userData.createdAt).toLocaleDateString(
                                "de-DE",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </div>
                            <div className="text-xs text-base-content/60">
                              {new Date(userData.createdAt).toLocaleTimeString(
                                "de-DE",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="flex gap-2 justify-center">
                              <select
                                value={userData.role.toLowerCase()}
                                onChange={(e) =>
                                  handleRoleChange(userData._id, e.target.value)
                                }
                                className="select select-sm select-bordered"
                                disabled={
                                  userData._id === currentUser?._id || isDemo
                                }
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="demo">Demo</option>
                              </select>
                              <button
                                onClick={() => handleDeleteUser(userData._id)}
                                className="btn btn-sm btn-error"
                                disabled={
                                  userData._id === currentUser?._id || isDemo
                                }
                              >
                                ✕
                              </button>
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
