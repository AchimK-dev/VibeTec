import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { Footer, Navbar } from '@/components';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from '@/context';

const RootLayout = () => {
  return (
    <AuthContextProvider>
      <div>
        <ToastContainer position='bottom-left' autoClose={1500} theme='colored' />
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthContextProvider>
  );
};

export default RootLayout;
