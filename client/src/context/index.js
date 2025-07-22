import { createContext, use } from 'react';
import AuthContextProvider from './AuthProvider';
const AuthContext = createContext();

const useAuth = () => {
  const context = use(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthContextProvider');
  return context;
};

export { AuthContext, useAuth, AuthContextProvider };
