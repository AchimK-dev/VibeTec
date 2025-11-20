import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { changePassword, updateProfile } from "@/data";
import { useAuth } from "@/context";
import { useNavigate } from "react-router";

const UserProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        password: "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!profileForm.password) {
      toast.error("Please enter your password to confirm changes");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phoneNumber: profileForm.phoneNumber,
        password: profileForm.password,
      });

      toast.success("Profile updated successfully!");
      setProfileForm({ ...profileForm, password: "" });

      if (refreshUser) {
        await refreshUser();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-no-padding">
      <div className="w-full min-h-screen">
        <div className="bg-base-100 rounded-xl shadow-lg p-4 sm:p-6 md:p-12 min-h-screen">
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-base-content mb-2 md:mb-4">
                User Profile
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-base-content">
                Manage your account settings
              </p>
            </div>

            <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto">
              <div className="bg-base-100 border-1 border-primary rounded-xl p-1 sm:p-2 flex space-x-1 sm:space-x-2 min-w-max">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm md:text-base ${
                    activeTab === "overview"
                      ? "bg-primary text-primary-content shadow-md"
                      : "text-base-content hover:text-base-content/60"
                  }`}
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm md:text-base ${
                    activeTab === "profile"
                      ? "bg-primary text-primary-content shadow-md"
                      : "text-base-content hover:text-base-content/60"
                  }`}
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm md:text-base ${
                    activeTab === "password"
                      ? "bg-primary text-primary-content shadow-md"
                      : "text-base-content hover:text-base-content/60"
                  }`}
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
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
                  <span className="hidden sm:inline">Password</span>
                </button>
              </div>
            </div>

            {activeTab === "overview" && (
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-base-100 border-1 border-primary rounded-xl p-4 sm:p-6 md:p-8 shadow-md">
                    <div className="flex flex-col items-center mb-4 md:mb-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary to-accent rounded-full mb-3 md:mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-2xl sm:text-3xl font-bold text-primary-content">
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-base-content text-center">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <div
                        className={`badge badge-md sm:badge-lg px-3 sm:px-4 py-1 sm:py-2 mt-2 sm:mt-3 ${
                          user?.role === "ADMIN"
                            ? "badge-error"
                            : user?.role === "DEMO"
                            ? "badge-warning"
                            : "badge-info"
                        }`}
                      >
                        {user?.role === "ADMIN"
                          ? "Administrator"
                          : user?.role === "DEMO"
                          ? "Demo User"
                          : "User"}
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 sm:gap-3 text-base-content">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-base-content flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-xs sm:text-sm break-all">
                          {user?.email}
                        </span>
                      </div>

                      {user?.phoneNumber && (
                        <div className="flex items-center gap-2 sm:gap-3 text-base-content">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-base-content flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="text-xs sm:text-sm">
                            {user?.phoneNumber}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 sm:gap-3 text-base-content">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-base-content flex-shrink-0"
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
                        <span className="text-xs sm:text-sm">
                          Member since{" "}
                          {new Date(user?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-base-100 border-1 border-primary rounded-xl p-4 sm:p-6 md:p-8 shadow-md">
                    <h3 className="text-lg sm:text-xl font-bold text-base-content mb-4 sm:mb-6">
                      Quick Actions
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <button
                        onClick={() => setActiveTab("profile")}
                        className="btn btn-outline btn-primary w-full justify-start text-sm sm:text-base h-auto min-h-[2.5rem] sm:min-h-[3rem] py-2"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span className="text-base-content">
                          Edit Profile Information
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab("password")}
                        className="btn btn-outline btn-primary w-full justify-start text-sm sm:text-base h-auto min-h-[2.5rem] sm:min-h-[3rem] py-2"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
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
                        <span className="text-base-content">
                          Change Password
                        </span>
                      </button>
                      <button
                        onClick={() => navigate("/my-bookings")}
                        className="btn btn-outline btn-primary w-full justify-start text-sm sm:text-base h-auto min-h-[2.5rem] sm:min-h-[3rem] py-2"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
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
                        <span className="text-base-content">
                          View My Bookings
                        </span>
                      </button>
                    </div>

                    <div className="divider my-4 sm:my-6"></div>

                    <h3 className="text-lg sm:text-xl font-bold text-base-content mb-4 sm:mb-6">
                      Account Information
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-base-content">
                          Account Status
                        </span>
                        <span className="badge badge-success text-xs sm:text-sm">
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-base-content">
                          Role
                        </span>
                        <span className="font-semibold text-base-content text-xs sm:text-sm">
                          {user?.role === "ADMIN"
                            ? "Administrator"
                            : user?.role === "DEMO"
                            ? "Demo User"
                            : "User"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-base-100 border-1 border-primary rounded-xl p-4 sm:p-6 md:p-8 shadow-md">
                  <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-4 sm:mb-6 text-center">
                    Edit Personal Information
                  </h2>

                  <form
                    onSubmit={handleProfileUpdate}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-base-content mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              firstName: e.target.value,
                            })
                          }
                          className="input input-bordered w-full text-sm sm:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-base-content mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              lastName: e.target.value,
                            })
                          }
                          className="input input-bordered w-full text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-base-content mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        className="input input-bordered w-full text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-base-content mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phoneNumber}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="input input-bordered w-full text-sm sm:text-base"
                        placeholder="+49 123 4567890"
                      />
                    </div>

                    <div className="bg-warning/10 border-2 border-warning rounded-lg p-3 sm:p-4">
                      <label className="block text-xs sm:text-sm font-bold text-warning mb-2">
                        Confirm with Password *
                      </label>
                      <input
                        type="password"
                        value={profileForm.password}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            password: e.target.value,
                          })
                        }
                        className="input input-bordered w-full text-sm sm:text-base"
                        placeholder="Enter your password to confirm changes"
                        required
                      />
                      <p className="text-xs text-base-content mt-2">
                        For security reasons, you must enter your password to
                        save changes
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileForm({
                            firstName: user?.firstName || "",
                            lastName: user?.lastName || "",
                            email: user?.email || "",
                            phoneNumber: user?.phoneNumber || "",
                            password: "",
                          });
                        }}
                        className="btn btn-neutral flex-1 text-sm sm:text-base"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex-1 text-sm sm:text-base"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-base-100 border-1 border-primary rounded-xl p-4 sm:p-6 md:p-8 shadow-md">
                  <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-4 sm:mb-6 text-center">
                    Change Password
                  </h2>
                  <form
                    onSubmit={handlePasswordChange}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-base-content mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        className="input input-bordered w-full text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-base-content mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="input input-bordered w-full text-sm sm:text-base"
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-base-content mt-1">
                        Must be at least 8 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-base-content mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="input input-bordered w-full text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordForm({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="btn btn-neutral flex-1 text-sm sm:text-base"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex-1 text-sm sm:text-base"
                        disabled={loading}
                      >
                        {loading ? "Changing..." : "Change Password"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
