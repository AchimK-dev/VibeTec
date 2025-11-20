import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { createArtist, deleteBookingByAdmin } from "@/data";
import { useAuth } from "@/context";
import { LoadingState, EmptyState } from "@/components";
import { useBookings } from "@/hooks/useBookings";
import TableFilters from "@/components/Shared/TableFilters";
import SortableTableHeader from "@/components/Shared/SortableTableHeader";

const AdminDashboard = () => {
  const { isDemo } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("tab") || "overview";
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");

  const {
    bookings,
    allBookings, // Unfiltered bookings for statistics
    loading: bookingsLoading,
    filter: bookingFilter,
    setFilter: setBookingFilter,
    search: bookingSearch,
    handleSearch: handleBookingSearch,
    sortField: bookingSortField,
    sortOrder: bookingSortOrder,
    handleSort: handleBookingSort,
    searchSuggestions,
    showSuggestions,
    setShowSuggestions,
    setSearch: setBookingSearch,
    handleConfirm: handleConfirmBooking,
    handleReject: handleRejectBooking,
    reload: loadBookings,
  } = useBookings();

  const [artistForm, setArtistForm] = useState({
    name: "",
    musicGenre: "",
    image: "",
    description: "",
    pricePerHour: "",
  });
  const [artistLoading, setArtistLoading] = useState(false);

  // Helper function to mask sensitive data for demo users
  const maskData = (data, type = "text") => {
    if (!isDemo) return data;

    if (!data) return "N/A";

    switch (type) {
      case "email": {
        const emailParts = data.split("@");
        if (emailParts.length === 2) {
          const localPart = emailParts[0];
          const domainPart = emailParts[1];
          const maskedLocal =
            localPart.charAt(0) + "*".repeat(Math.max(localPart.length - 1, 3));
          return `${maskedLocal}@${domainPart}`;
        }
        return "demo@********.com";
      }
      case "phone":
        return "+49 *** *******";
      case "name": {
        const nameParts = data.trim().split(" ");
        const maskedParts = nameParts.map(
          (part) => part.charAt(0) + "*".repeat(Math.max(part.length - 1, 3))
        );
        return maskedParts.join(" ");
      }
      default:
        return "********";
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["overview", "bookings", "artists"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (autoRefresh && (activeTab === "overview" || activeTab === "bookings")) {
      const refreshInterval = setInterval(() => {
        loadBookings();
      }, 30000);

      return () => clearInterval(refreshInterval);
    }
  }, [autoRefresh, activeTab, loadBookings]);

  const handleArtistChange = (e) => {
    setArtistForm({ ...artistForm, [e.target.name]: e.target.value });
  };

  const handleCreateArtist = async (e) => {
    e.preventDefault();
    try {
      const { name, musicGenre, image, description, pricePerHour } = artistForm;
      if (!name || !musicGenre || !image || !description || !pricePerHour) {
        throw new Error("All fields are required");
      }
      if (parseFloat(pricePerHour) <= 0) {
        throw new Error("Price per hour must be greater than 0");
      }
      setArtistLoading(true);
      const newArtist = await createArtist({
        name,
        musicGenre,
        image,
        description,
        pricePerHour: parseFloat(pricePerHour),
      });
      setArtistForm({
        name: "",
        musicGenre: "",
        image: "",
        description: "",
        pricePerHour: "",
      });
      toast.success("Artist created successfully!");
      navigate(`/artist/${newArtist._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setArtistLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBookingByAdmin(bookingId);
      toast.success("Booking deleted successfully!");
      loadBookings();
      setShowBookingModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const openConfirmModal = (title, message, action) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const totalBookings = allBookings.length;
  const pendingBookings = allBookings.filter(
    (b) => !b.isConfirmed && !b.isRejected && !b.isCancelled
  ).length;
  const confirmedBookings = allBookings.filter(
    (b) => b.isConfirmed && !b.isCancelled
  ).length;
  const rejectedBookings = allBookings.filter((b) => b.isRejected).length;
  const cancelledBookings = allBookings.filter((b) => b.isCancelled).length;

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
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm md:text-base ${
                    activeTab === "overview"
                      ? "bg-primary text-primary-content shadow-md"
                      : "text-base-content hover:text-base-content/60"
                  }`}
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
                  onClick={() => setActiveTab("bookings")}
                  className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm md:text-base ${
                    activeTab === "bookings"
                      ? "bg-primary text-primary-content shadow-md"
                      : "text-base-content hover:text-base-content/60"
                  }`}
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
                <button
                  onClick={() => navigate("/user-management")}
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="hidden sm:inline">User Management</span>
                </button>
                <button
                  onClick={() => setActiveTab("artists")}
                  className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm md:text-base ${
                    activeTab === "artists"
                      ? "bg-primary text-primary-content shadow-md"
                      : "text-base-content hover:text-base-content/60"
                  }`}
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="hidden sm:inline">Create Artist</span>
                </button>
              </div>
            </div>

            {activeTab === "overview" && (
              <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  <div className="bg-base-100 border-1 border-primary rounded-xl p-3 sm:p-4 md:p-6 text-base-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base-content text-xs sm:text-sm">
                          Total Bookings
                        </p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                          {totalBookings}
                        </p>
                      </div>
                      <div className="text-primary flex-shrink-0">
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
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
                      </div>
                    </div>
                  </div>

                  <div className="bg-base-100 border-1 border-primary rounded-xl p-3 sm:p-4 md:p-6 text-base-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base-content text-xs sm:text-sm">
                          Pending
                        </p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                          {pendingBookings}
                        </p>
                      </div>
                      <div className="text-warning flex-shrink-0">
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-base-100 border-1 border-primary rounded-xl p-3 sm:p-4 md:p-6 text-base-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base-content text-xs sm:text-sm">
                          Confirmed
                        </p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                          {confirmedBookings}
                        </p>
                      </div>
                      <div className="text-success flex-shrink-0">
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-base-100 border-1 border-primary rounded-xl p-3 sm:p-4 md:p-6 text-base-content">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base-content text-xs sm:text-sm">
                          Cancelled
                        </p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                          {cancelledBookings}
                        </p>
                      </div>
                      <div className="text-error flex-shrink-0">
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-base-100 border-1 border-primary rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-White mb-6 border-b-2 border-primary pb-3">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="bg-base-100 rounded-lg p-6 border-1 border-primary hover:shadow-md transition-shadow"
                    >
                      <div className="text-primary mb-3">
                        <svg
                          className="w-10 h-10 mx-auto"
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
                      </div>
                      <h3 className="font-bold text-base-content mb-2">
                        Manage Bookings
                      </h3>
                      <p className="text-base-content text-sm">
                        View and confirm artist bookings
                      </p>
                    </button>

                    <button
                      onClick={() => navigate("/user-management")}
                      className="bg-base-100 rounded-lg p-6 border-1 border-primary hover:shadow-md transition-shadow"
                    >
                      <div className="text-primary mb-3">
                        <svg
                          className="w-10 h-10 mx-auto"
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
                      </div>
                      <h3 className="font-bold text-base-content mb-2">
                        User Management
                      </h3>
                      <p className="text-base-content text-sm">
                        Manage user accounts and roles
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab("artists")}
                      className="bg-base-100 rounded-lg p-6 border-1 border-primary hover:shadow-md transition-shadow"
                    >
                      <div className="text-primary mb-3">
                        <svg
                          className="w-10 h-10 mx-auto"
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
                      </div>
                      <h3 className="font-bold text-base-content mb-2">
                        Create Artist
                      </h3>
                      <p className="text-base-content text-sm">
                        Add new artists to the platform
                      </p>
                    </button>

                    <button
                      onClick={() => navigate("/artists")}
                      className="bg-base-100 rounded-lg p-6 border-1 border-primary hover:shadow-md transition-shadow"
                    >
                      <div className="text-primary mb-3">
                        <svg
                          className="w-10 h-10 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-base-content mb-2">
                        View Artists
                      </h3>
                      <p className="text-base-content text-sm">
                        Browse all artists and their bookings
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
                      Booking Management
                    </h2>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 bg-base-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                        <span className="text-xs sm:text-sm text-base-content">
                          Auto-Refresh
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary toggle-sm"
                          checked={autoRefresh}
                          onChange={(e) => setAutoRefresh(e.target.checked)}
                          title="Automatic refresh every 30 seconds"
                        />
                        {autoRefresh && (
                          <span className="text-xs text-primary">30s</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 md:mb-8 items-stretch md:items-center justify-between">
                    <TableFilters
                      searchValue={bookingSearch}
                      onSearchChange={handleBookingSearch}
                      suggestions={searchSuggestions}
                      showSuggestions={showSuggestions}
                      onSuggestionSelect={(suggestion) => {
                        setBookingSearch(suggestion);
                        setShowSuggestions(false);
                      }}
                      onClearSearch={() => {
                        setBookingSearch("");
                        setShowSuggestions(false);
                      }}
                      placeholder="Search by VT number, name, email, phone, or artist..."
                      className="w-full max-w-md"
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setBookingFilter("all")}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base ${
                          bookingFilter === "all"
                            ? "bg-primary text-primary-content"
                            : "bg-base-200 text-base-content hover:bg-primary hover:text-primary-content"
                        }`}
                      >
                        All ({totalBookings})
                      </button>
                      <button
                        onClick={() => setBookingFilter("pending")}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base ${
                          bookingFilter === "pending"
                            ? "bg-primary text-primary-content"
                            : "bg-base-200 text-base-content hover:bg-primary hover:text-primary-content"
                        }`}
                      >
                        Pending ({pendingBookings})
                      </button>
                      <button
                        onClick={() => setBookingFilter("confirmed")}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base ${
                          bookingFilter === "confirmed"
                            ? "bg-primary text-primary-content"
                            : "bg-base-200 text-base-content hover:bg-primary hover:text-primary-content"
                        }`}
                      >
                        Confirmed ({confirmedBookings})
                      </button>
                      <button
                        onClick={() => setBookingFilter("rejected")}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base ${
                          bookingFilter === "rejected"
                            ? "bg-primary text-primary-content"
                            : "bg-base-200 text-base-content hover:bg-primary hover:text-primary-content"
                        }`}
                      >
                        Rejected ({rejectedBookings})
                      </button>
                      <button
                        onClick={() => setBookingFilter("cancelled")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          bookingFilter === "cancelled"
                            ? "bg-primary text-primary-content"
                            : "bg-base-200 text-base-content hover:bg-primary hover:text-primary-content"
                        }`}
                      >
                        Cancelled ({cancelledBookings})
                      </button>
                    </div>
                  </div>

                  {bookingsLoading ? (
                    <LoadingState message="Loading bookings..." />
                  ) : bookings.length === 0 ? (
                    <EmptyState
                      icon="calendar"
                      title="No Bookings Found"
                      message={
                        bookingSearch
                          ? `No bookings found matching "${bookingSearch}"`
                          : bookingFilter === "pending"
                          ? "No pending bookings at the moment. New requests will appear here."
                          : bookingFilter === "confirmed"
                          ? "No confirmed bookings yet. Confirmed bookings will be displayed here."
                          : bookingFilter === "rejected"
                          ? "No rejected bookings. Rejected bookings will appear here."
                          : bookingFilter === "cancelled"
                          ? "No cancelled bookings. Cancelled bookings will appear here."
                          : "No bookings have been made yet. Bookings from customers will appear here."
                      }
                    />
                  ) : (
                    <div className="bg-base-200 rounded-xl shadow-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="table w-full text-xs sm:text-sm md:text-base">
                          <thead className="bg-base-300">
                            <tr>
                              <th
                                className="text-base-content font-bold cursor-pointer text-xs sm:text-sm"
                                onClick={() =>
                                  handleBookingSort("bookingNumber")
                                }
                              >
                                Booking #{" "}
                                {bookingSortField === "bookingNumber" &&
                                  (bookingSortOrder === "asc" ? "↑" : "↓")}
                              </th>
                              <th
                                className="text-base-content font-bold cursor-pointer"
                                onClick={() => handleBookingSort("createdAt")}
                              >
                                Created{" "}
                                {bookingSortField === "createdAt" &&
                                  (bookingSortOrder === "asc" ? "↑" : "↓")}
                              </th>
                              <th
                                className="text-base-content font-bold cursor-pointer"
                                onClick={() => handleBookingSort("status")}
                              >
                                Status{" "}
                                {bookingSortField === "status" &&
                                  (bookingSortOrder === "asc" ? "↑" : "↓")}
                              </th>
                              <th
                                className="text-base-content font-bold cursor-pointer"
                                onClick={() => handleBookingSort("artist")}
                              >
                                Artist{" "}
                                {bookingSortField === "artist" &&
                                  (bookingSortOrder === "asc" ? "↑" : "↓")}
                              </th>
                              <th
                                className="text-base-content font-bold cursor-pointer"
                                onClick={() => handleBookingSort("date")}
                              >
                                Date{" "}
                                {bookingSortField === "date" &&
                                  (bookingSortOrder === "asc" ? "↑" : "↓")}
                              </th>
                              <th
                                className="text-base-content font-bold cursor-pointer"
                                onClick={() => handleBookingSort("client")}
                              >
                                Client{" "}
                                {bookingSortField === "client" &&
                                  (bookingSortOrder === "asc" ? "↑" : "↓")}
                              </th>
                              <th
                                className="text-base-content font-bold cursor-pointer"
                                onClick={() => handleBookingSort("price")}
                              >
                                Price{" "}
                                {bookingSortField === "price" &&
                                  (bookingSortOrder === "asc" ? "↑" : "↓")}
                              </th>
                              <th className="text-base-content font-bold text-center">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((booking) => (
                              <tr
                                key={booking._id}
                                className="hover:bg-base-300 cursor-pointer transition-colors"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowBookingModal(true);
                                }}
                              >
                                <td>
                                  <div className="font-mono text-base-content text-sm">
                                    {booking.bookingNumber || "N/A"}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-base-content text-xs">
                                    {new Date(
                                      booking.createdAt
                                    ).toLocaleDateString("de-DE", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                  </div>
                                  <div className="text-xs text-base-content/60">
                                    {new Date(
                                      booking.createdAt
                                    ).toLocaleTimeString("de-DE", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className={`badge ${
                                      booking.isCancelled
                                        ? "badge-neutral"
                                        : booking.isRejected
                                        ? "badge-error"
                                        : booking.isConfirmed
                                        ? "badge-success"
                                        : "badge-warning"
                                    } badge-sm`}
                                  >
                                    {booking.isCancelled
                                      ? "Cancelled"
                                      : booking.isRejected
                                      ? "Rejected"
                                      : booking.isConfirmed
                                      ? "Confirmed"
                                      : "Pending"}
                                  </div>
                                </td>
                                <td>
                                  <div className="font-bold text-base-content text-sm">
                                    {booking.artistName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-base-content text-sm">
                                    {formatDate(booking.date)}
                                  </div>
                                  <div className="text-xs text-base-content/60">
                                    {booking.startTime} - {booking.endTime}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-base-content text-sm">
                                    {maskData(booking.clientName, "name")}
                                  </div>
                                  <div className="text-xs text-base-content/60">
                                    {maskData(booking.clientEmail, "email")}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-lg font-bold text-base-content">
                                    €{booking.totalPrice || 0}
                                  </div>
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                  <div className="flex gap-2 justify-center">
                                    {!booking.isConfirmed &&
                                      !booking.isRejected &&
                                      !booking.isCancelled && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleConfirmBooking(
                                              booking.artistId,
                                              booking._id
                                            );
                                          }}
                                          className="btn btn-success btn-xs"
                                          disabled={isDemo}
                                          title={
                                            isDemo
                                              ? "Demo users cannot modify bookings"
                                              : "Confirm booking"
                                          }
                                        >
                                          ✓
                                        </button>
                                      )}
                                    {!booking.isRejected &&
                                      !booking.isCancelled &&
                                      booking.isConfirmed && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRejectBooking(
                                              booking.artistId,
                                              booking._id
                                            );
                                          }}
                                          className="btn btn-error btn-xs"
                                          disabled={isDemo}
                                          title={
                                            isDemo
                                              ? "Demo users cannot modify bookings"
                                              : "Cancel booking"
                                          }
                                        >
                                          ✕
                                        </button>
                                      )}
                                    {!booking.isRejected &&
                                      !booking.isCancelled &&
                                      !booking.isConfirmed && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRejectBooking(
                                              booking.artistId,
                                              booking._id
                                            );
                                          }}
                                          className="btn btn-error btn-xs"
                                          disabled={isDemo}
                                          title={
                                            isDemo
                                              ? "Demo users cannot modify bookings"
                                              : "Reject booking"
                                          }
                                        >
                                          ✕
                                        </button>
                                      )}
                                    {(booking.isCancelled ||
                                      booking.isRejected) && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openConfirmModal(
                                            "Delete Booking",
                                            `Are you sure you want to permanently delete this ${
                                              booking.isCancelled
                                                ? "cancelled"
                                                : "rejected"
                                            } booking? This action cannot be undone.`,
                                            () => {
                                              handleDeleteBooking(booking._id);
                                            }
                                          );
                                        }}
                                        className="btn btn-error btn-xs"
                                        disabled={isDemo}
                                        title={
                                          isDemo
                                            ? "Demo users cannot delete bookings"
                                            : `Delete ${
                                                booking.isCancelled
                                                  ? "cancelled"
                                                  : "rejected"
                                              } booking`
                                        }
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
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
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
              </div>
            )}

            {showBookingModal && selectedBooking && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-base-100 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-primary">
                  <div className="sticky top-0 bg-base-200 p-6 border-b border-base-content/20 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-base-content">
                      Booking Details
                    </h3>
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="btn btn-circle btn-sm btn-ghost text-base-content"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-base-content/60 mb-1">
                          Booking Number
                        </label>
                        <div className="text-base-content font-mono bg-base-200 rounded-lg px-3 py-2">
                          {selectedBooking.bookingNumber || "N/A"}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-base-content/60 mb-1">
                          Status
                        </label>
                        <div>
                          <div
                            className={`badge ${
                              selectedBooking.isCancelled
                                ? "badge-neutral"
                                : selectedBooking.isRejected
                                ? "badge-error"
                                : selectedBooking.isConfirmed
                                ? "badge-success"
                                : "badge-warning"
                            } badge-lg`}
                          >
                            {selectedBooking.isCancelled
                              ? "Cancelled"
                              : selectedBooking.isRejected
                              ? "Rejected"
                              : selectedBooking.isConfirmed
                              ? "Confirmed"
                              : "Pending"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-base-content/60 mb-1">
                          Artist
                        </label>
                        <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                          {selectedBooking.artistName}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-base-content/60 mb-1">
                          Date
                        </label>
                        <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                          {selectedBooking.isMultiDay ? (
                            <>
                              {formatDate(selectedBooking.date)} -{" "}
                              {formatDate(selectedBooking.endDate)}
                            </>
                          ) : (
                            formatDate(selectedBooking.date)
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-base-content/60 mb-1">
                          Start Time
                        </label>
                        <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                          {selectedBooking.startTime}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-base-content/60 mb-1">
                          End Time
                        </label>
                        <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                          {selectedBooking.endTime}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-base-content/60 mb-1">
                          Total Price
                        </label>
                        <div className="text-base-content font-bold text-lg bg-base-200 rounded-lg px-3 py-2">
                          €{selectedBooking.totalPrice || 0}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-base-content/60 mb-1">
                          Created At
                        </label>
                        <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                          {new Date(selectedBooking.createdAt).toLocaleString(
                            "de-DE"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-base-content mb-3 pb-2 border-b border-base-content/20">
                        Client Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-base-content/60 mb-1">
                            Name
                          </label>
                          <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                            {maskData(selectedBooking.clientName, "name")}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-base-content/60 mb-1">
                            Email
                          </label>
                          <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                            {maskData(
                              selectedBooking.clientEmail || "N/A",
                              "email"
                            )}
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-base-content/60 mb-1">
                            Phone
                          </label>
                          <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                            {maskData(
                              selectedBooking.clientPhone || "N/A",
                              "phone"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-base-content mb-3 pb-2 border-b border-base-content/20">
                        Event Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-base-content/60 mb-1">
                            Event Type
                          </label>
                          <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                            {selectedBooking.eventType || "N/A"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-base-content/60 mb-1">
                            Location
                          </label>
                          <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                            {isDemo
                              ? "************"
                              : selectedBooking.eventLocation || "N/A"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-base-content/60 mb-1">
                            Number of Guests
                          </label>
                          <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                            {selectedBooking.numberOfGuests || "N/A"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-base-content/60 mb-1">
                            Music Preferences
                          </label>
                          <div className="text-base-content bg-base-200 rounded-lg px-3 py-2">
                            {selectedBooking.musicPreferences || "N/A"}
                          </div>
                        </div>

                        {selectedBooking.eventDetails && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-base-content/60 mb-1">
                              Additional Details
                            </label>
                            <div className="text-base-content bg-base-200 rounded-lg px-3 py-2 min-h-[60px] whitespace-pre-wrap">
                              {selectedBooking.eventDetails}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-base-content/60 mb-1">
                        Notes
                      </label>
                      <div className="text-base-content bg-base-200 rounded-lg px-3 py-2 min-h-[60px] whitespace-pre-wrap">
                        {selectedBooking.notes || "No notes"}
                      </div>
                    </div>

                    {!isDemo && (
                      <div className="flex gap-3 pt-4 border-t border-base-content/20">
                        {!selectedBooking.isCancelled &&
                          !selectedBooking.isConfirmed &&
                          !selectedBooking.isRejected && (
                            <button
                              onClick={() => {
                                openConfirmModal(
                                  "Confirm Booking",
                                  "Are you sure you want to confirm this booking?",
                                  () => {
                                    handleConfirmBooking(
                                      selectedBooking.artistId,
                                      selectedBooking._id
                                    );
                                    setShowBookingModal(false);
                                  }
                                );
                              }}
                              className="btn btn-success flex-1"
                            >
                              Confirm Booking
                            </button>
                          )}
                        {!selectedBooking.isRejected &&
                          !selectedBooking.isCancelled && (
                            <button
                              onClick={() => {
                                const action = selectedBooking.isConfirmed
                                  ? "cancel"
                                  : "reject";
                                openConfirmModal(
                                  selectedBooking.isConfirmed
                                    ? "Cancel Booking"
                                    : "Reject Booking",
                                  `Are you sure you want to ${action} this booking?`,
                                  () => {
                                    handleRejectBooking(
                                      selectedBooking.artistId,
                                      selectedBooking._id
                                    );
                                    setShowBookingModal(false);
                                  }
                                );
                              }}
                              className="btn btn-error flex-1"
                            >
                              {selectedBooking.isConfirmed
                                ? "Cancel Booking"
                                : "Reject Booking"}
                            </button>
                          )}
                        {selectedBooking.isCancelled && (
                          <button
                            onClick={() => {
                              openConfirmModal(
                                "Delete Booking",
                                "Are you sure you want to permanently delete this cancelled booking? This action cannot be undone.",
                                () => {
                                  handleDeleteBooking(selectedBooking._id);
                                }
                              );
                            }}
                            className="btn btn-error flex-1"
                          >
                            Delete Booking
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "artists" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
                    Create New Artist
                  </h2>
                  <p className="text-base-content text-sm sm:text-base">
                    Add a new artist to the VibeTec platform
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-base-100 border-1 border-primary rounded-xl p-4 sm:p-6 md:p-8 shadow-md">
                    <form
                      onSubmit={handleCreateArtist}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-base-content/40 mb-2 uppercase tracking-wide">
                            Artist Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={artistForm.name}
                            onChange={handleArtistChange}
                            className="input w-full bg-base-100 border-1 border-primary text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-lg p-3 sm:p-4 text-sm sm:text-base"
                            placeholder="Enter artist name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-base-content/40 mb-2 uppercase tracking-wide">
                            Music Genre *
                          </label>
                          <input
                            type="text"
                            name="musicGenre"
                            value={artistForm.musicGenre}
                            onChange={handleArtistChange}
                            className="input w-full bg-base-100 border-1 border-primary text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-lg p-3 sm:p-4 text-sm sm:text-base"
                            placeholder="e.g., Electronic, Hip-Hop, Rock"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-base-content/40 mb-2 uppercase tracking-wide">
                          Image URL *
                        </label>
                        <input
                          type="url"
                          name="image"
                          value={artistForm.image}
                          onChange={handleArtistChange}
                          className="input w-full bg-base-100 border-1 border-primary text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-lg p-3 sm:p-4 text-sm sm:text-base"
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-base-content/40 mb-2 uppercase tracking-wide">
                          Price per Hour (€) *
                        </label>
                        <input
                          type="number"
                          name="pricePerHour"
                          value={artistForm.pricePerHour}
                          onChange={handleArtistChange}
                          className="input w-full bg-base-100 border-1 border-primary text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-lg p-3 sm:p-4 text-sm sm:text-base"
                          placeholder="150"
                          min="1"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-base-content/40 mb-2 uppercase tracking-wide">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={artistForm.description}
                          onChange={handleArtistChange}
                          className="textarea w-full bg-base-100 border-1 border-primary text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-lg p-3 sm:p-4 h-32 text-sm sm:text-base"
                          placeholder="Describe the artist's style, experience, and what makes them unique..."
                          required
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                        <button
                          type="button"
                          onClick={() =>
                            setArtistForm({
                              name: "",
                              musicGenre: "",
                              image: "",
                              description: "",
                              pricePerHour: "",
                            })
                          }
                          className="btn flex-1 bg-base-100 border-1 border-primary text-base-content font-bold hover:scale-105 transition-all duration-200 rounded-3xl py-3 text-sm sm:text-base"
                        >
                          Clear Form
                        </button>
                        <button
                          type="submit"
                          className="btn flex-1 text-primary-content font-bold hover:scale-105 transition-all duration-200 rounded-3xl py-3 btn-primary text-primary-content text-sm sm:text-base"
                          disabled={artistLoading || isDemo}
                          title={
                            isDemo
                              ? "Demo-Account: Read-only access"
                              : "Create Artist"
                          }
                        >
                          {artistLoading ? "Creating..." : "Create Artist"}
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

      {showConfirmModal && (
        <div
          className="modal modal-open"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="modal-box bg-base-100 border border-primary max-w-sm sm:max-w-md md:max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg sm:text-xl text-base-content mb-3 sm:mb-4">
              {confirmTitle}
            </h3>
            <p className="text-base-content mb-4 sm:mb-6 text-sm sm:text-base">
              {confirmMessage}
            </p>
            <div className="modal-action flex-col sm:flex-row gap-2 sm:gap-0">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn bg-base-200 text-base-content hover:bg-base-200/80 w-full sm:w-auto text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="btn bg-primary text-primary-content hover:bg-primary/80 w-full sm:w-auto text-sm sm:text-base"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmAction();
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
