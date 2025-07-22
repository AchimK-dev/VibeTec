import { BrowserRouter, Routes, Route } from 'react-router';
import { ProtectedLayout, RootLayout, AdminLayout } from '@/layouts';
import { AdminDashboard, ModernAdminDashboard, BookingConfirmation, Community, Contact, Cookies, CreateArtist, EditArtist, ArtistDetail, Home, Login, MyBookings, NotFound, Artists, Privacy, Register, Terms, UserProfile, UserManagement } from '@/pages';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='artists' element={<Artists />} />
        <Route path='artist/:id' element={<ArtistDetail />} />
        <Route path='community' element={<Community />} />
        <Route path='contact' element={<Contact />} />
        <Route path='privacy' element={<Privacy />} />
        <Route path='terms' element={<Terms />} />
        <Route path='cookies' element={<Cookies />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route element={<ProtectedLayout />}>
          <Route path='user-profile' element={<UserProfile />} />
          <Route path='my-bookings' element={<MyBookings />} />
          <Route path='booking-confirmation/:id' element={<BookingConfirmation />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path='admin-dashboard' element={<ModernAdminDashboard />} />
          <Route path='user-management' element={<UserManagement />} />
          <Route path='create-artist' element={<CreateArtist />} />
          <Route path='edit-artist/:id' element={<EditArtist />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
