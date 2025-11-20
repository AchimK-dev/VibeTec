import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { Footer, Navbar } from "@/components";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider, ThemeProvider } from "@/context";

const RootLayout = () => {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <div className="min-h-screen bg-base-300 text-base-content">
          <ToastContainer
            position="bottom-left"
            autoClose={1500}
            theme="colored"
          />
          <Navbar />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
