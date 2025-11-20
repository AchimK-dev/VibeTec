import { useEffect, useState } from "react";
import { me, signin, signup, signout } from "../data";
import { AuthContext } from ".";

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkSession, setCheckSession] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedinUser = await me();
        loggedinUser && setUser(loggedinUser);
      } catch (error) {
        if (error?.response?.status === 401) {
          setUser(null);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [checkSession]);

  const refreshUser = async () => {
    try {
      const loggedinUser = await me();
      loggedinUser && setUser(loggedinUser);
    } catch {
      // Silent fail
    }
  };

  const isDemo = user?.role === "DEMO";
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext
      value={{
        user,
        isDemo,
        isAdmin,
        signin,
        signup,
        signout,
        me,
        setCheckSession,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext>
  );
};

export default AuthContextProvider;
