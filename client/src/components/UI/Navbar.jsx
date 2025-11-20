import { Link, NavLink, useLocation } from "react-router";
import { useAuth, useTheme } from "@/context";
import { useState } from "react";

const Navbar = () => {
  const { user, isDemo, signout } = useAuth();
  const { theme, changeTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await signout();
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    changeTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="sticky top-0 z-50 max-width-wrapper">
      <div className="bg-base-100 text-base-content mb-3 rounded-b-xl font-bold shadow-lg">
        <div className="page-container">
          <div className="navbar min-h-16 md:min-h-20 lg:min-h-30">
            <div className="flex-1">
              <Link
                to="/"
                className="hover:bg-transparent flex items-center"
                onClick={closeMenu}
              >
                <img
                  src="/images/logos/vibetec-logo.png"
                  alt="VibeTec"
                  className="h-10 md:h-12 lg:h-15 w-auto"
                />
              </Link>
            </div>

            <div className="flex-none lg:hidden">
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-circle mr-2"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={toggleMenu}
                className="btn btn-ghost btn-circle"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            <div className="hidden lg:flex flex-none items-center">
              <ul className="menu menu-horizontal text-base xl:text-xl 2xl:text-2xl pr-2 xl:pr-4 2xl:pr-8">
                <li>
                  <NavLink
                    to="/"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/artists"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Artists
                  </NavLink>
                </li>
                {user ? (
                  <>
                    {(user.role === "ADMIN" || user.role === "DEMO") && (
                      <li>
                        <NavLink
                          to="/admin-dashboard"
                          className="hover:text-primary transition-colors duration-300"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink
                        to="/my-bookings"
                        className="hover:text-primary transition-colors duration-300"
                      >
                        My Bookings
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/user-profile"
                        className="hover:text-primary transition-colors duration-300"
                      >
                        <span className="font-bold">
                          {user.role === "ADMIN"
                            ? "Admin User"
                            : `${user.firstName} ${user.lastName}`}
                          {isDemo && (
                            <span className="ml-2 text-xs bg-warning text-warning-content px-2 py-1 rounded-full">
                              DEMO
                            </span>
                          )}
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="hover:text-primary transition-colors duration-300"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    {location.pathname === "/login" ? (
                      <li>
                        <NavLink
                          to="/register"
                          className="hover:text-primary transition-colors duration-300"
                        >
                          Register
                        </NavLink>
                      </li>
                    ) : (
                      <li>
                        <NavLink
                          to="/login"
                          className="hover:text-primary transition-colors duration-300"
                        >
                          Login
                        </NavLink>
                      </li>
                    )}
                  </>
                )}
              </ul>
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-circle ml-2 xl:ml-4 2xl:ml-8 mr-2 xl:mr-4 2xl:mr-8"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden pb-4 px-4">
              <ul className="menu menu-vertical text-lg space-y-2">
                <li>
                  <NavLink
                    to="/"
                    className="hover:text-primary transition-colors duration-300"
                    onClick={closeMenu}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/artists"
                    className="hover:text-primary transition-colors duration-300"
                    onClick={closeMenu}
                  >
                    Artists
                  </NavLink>
                </li>
                {user ? (
                  <>
                    {(user.role === "ADMIN" || user.role === "DEMO") && (
                      <li>
                        <NavLink
                          to="/admin-dashboard"
                          className="hover:text-primary transition-colors duration-300"
                          onClick={closeMenu}
                        >
                          Dashboard
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink
                        to="/my-bookings"
                        className="hover:text-primary transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        My Bookings
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/user-profile"
                        className="hover:text-primary transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        <span className="font-bold">
                          {user.role === "ADMIN"
                            ? "Admin User"
                            : `${user.firstName} ${user.lastName}`}
                          {isDemo && (
                            <span className="ml-2 text-xs bg-warning text-warning-content px-2 py-1 rounded-full">
                              DEMO
                            </span>
                          )}
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          closeMenu();
                          handleLogout();
                        }}
                        className="hover:text-primary transition-colors duration-300 text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    {location.pathname === "/login" ? (
                      <li>
                        <NavLink
                          to="/register"
                          className="hover:text-primary transition-colors duration-300"
                          onClick={closeMenu}
                        >
                          Register
                        </NavLink>
                      </li>
                    ) : (
                      <li>
                        <NavLink
                          to="/login"
                          className="hover:text-primary transition-colors duration-300"
                          onClick={closeMenu}
                        >
                          Login
                        </NavLink>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
