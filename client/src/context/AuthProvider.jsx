import { useEffect, useState } from 'react';
import { me, signin, signup, signout } from '../data';
import { AuthContext } from '.';

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
        // Silently handle authentication errors for non-logged-in users
        if (error?.response?.status === 401) {
          // User is not authenticated - this is normal for public pages
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
  return (
    <AuthContext
      value={{
        user,
        signin,
        signup,
        signout,
        me,
        setCheckSession,
        loading,
      }}
    >
      {children}
    </AuthContext>
  );
};

export default AuthContextProvider;
