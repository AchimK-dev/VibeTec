import { useAuth } from "@/context";
import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";

const Login = () => {
  const [{ email, password }, setForm] = useState({
    email: "",
    password: "",
  });
  const { signin, setCheckSession, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (user) {
    return <Navigate to={location.state?.next || "/"} />;
  }
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!email || !password) throw new Error("All fields are required");
      setLoading(true);
      const res = await signin({ email, password });
      if (res.error) {
        setError(res.error);
      } else {
        setCheckSession((prev) => !prev);
        navigate("/my-bookings");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-no-padding">
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 min-h-[calc(100vh-120px)]">
        <div className="lg:col-span-1 bg-primary rounded-lg md:rounded-xl shadow-lg p-6 md:p-8 flex flex-col justify-center items-center min-h-[300px] lg:min-h-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-content mb-4 md:mb-6 text-center">
            NEW TO
            <br />
            VIBETEC?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-primary-content mb-6 md:mb-8 text-center px-4">
            Join our community of music lovers and discover amazing DJs!
          </p>
          <div className="mb-3 md:mb-4">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-primary-content mx-auto"
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
          <Link
            to="/register"
            className="btn font-bold text-base-content text-base sm:text-lg lg:text-xl bg-base-100 rounded-3xl w-48 sm:w-56 md:w-60"
            style={{ border: "none" }}
          >
            Create Account
          </Link>
        </div>

        <div className="lg:col-span-2 bg-base-100 rounded-lg md:rounded-xl shadow-lg p-6 md:p-8 flex flex-col justify-center">
          <div className="w-full max-w-xs sm:max-w-sm mx-auto">
            <form
              className="flex flex-col gap-4 items-center"
              onSubmit={handleSubmit}
            >
              <h1 className="text-3xl font-bold text-center mb-6 text-base-content">
                Login
              </h1>
              <label className="input flex items-center gap-2 w-full bg-base border-1 border-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 text-base-content"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  name="email"
                  value={email}
                  onChange={handleChange}
                  type="email"
                  className="grow bg-base text-base-content placeholder:text-base-content/50"
                  placeholder="Email"
                />
              </label>
              <label className="input flex items-center gap-2 w-full bg-base border-1 border-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 text-base-content"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  name="password"
                  value={password}
                  onChange={handleChange}
                  type="password"
                  className="grow bg-base text-base-content placeholder:text-base-content/50"
                  placeholder="Password"
                />
              </label>
              <button
                className="btn btn-primary text-primary-content rounded-3xl w-40 font-bold mt-5"
                disabled={loading}
              >
                Login
              </button>
              {error && (
                <div className="alert alert-error mt-4 py-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
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
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
