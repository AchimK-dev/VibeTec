import { BrowserRouter, Routes, Route } from "react-router";
import { ProtectedLayout, RootLayout, AdminLayout } from "@/layouts";
import { ConnectionProvider, useConnection } from "@/context";
import {
  AdminDashboard,
  BookingConfirmation,
  Contact,
  Cookies,
  CreateArtist,
  EditArtist,
  ArtistDetail,
  Home,
  Impressum,
  Login,
  MyBookings,
  NotFound,
  Artists,
  Privacy,
  Register,
  Terms,
  UserProfile,
  UserManagement,
} from "@/pages";

const ConnectionError = ({ onRetry }) => (
  <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div className="bg-base-100 rounded-xl shadow-2xl p-8 md:p-12 max-w-md w-full">
      <div className="text-error mb-6 flex justify-center">
        <svg
          className="w-24 h-24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-error mb-4 text-center">
        Connection Error
      </h1>
      <p className="text-base-content/70 text-center mb-8">
        Unable to connect to the server. Please check your internet connection
        or try again later.
      </p>
      <button
        onClick={onRetry}
        className="btn btn-error w-full text-base-content font-bold hover:scale-105 transition-all"
      >
        Try Again
      </button>
    </div>
  </div>
);

const AppContent = () => {
  const { isOnline, isChecking, retry } = useConnection();

  if (isChecking) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-base-content/60 text-lg">Connecting...</p>
        </div>
      </div>
    );
  }

  if (!isOnline) {
    return <ConnectionError onRetry={retry} />;
  }

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="artists" element={<Artists />} />
        <Route path="artist/:id" element={<ArtistDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="cookies" element={<Cookies />} />
        <Route path="impressum" element={<Impressum />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectedLayout />}>
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route
            path="booking-confirmation/:id"
            element={<BookingConfirmation />}
          />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="create-artist" element={<CreateArtist />} />
          <Route path="edit-artist/:id" element={<EditArtist />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <ConnectionProvider>
      <AppContent />
    </ConnectionProvider>
  </BrowserRouter>
);

export default App;
