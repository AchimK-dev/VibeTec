import { createContext, use } from "react";
import AuthContextProvider from "./AuthProvider";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import { ConnectionProvider, ConnectionContext } from "./ConnectionProvider";

const AuthContext = createContext();

const useAuth = () => {
  const context = use(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthContextProvider");
  return context;
};

const useConnection = () => {
  const context = use(ConnectionContext);
  if (!context)
    throw new Error("useConnection must be used within ConnectionProvider");
  return context;
};

export {
  AuthContext,
  AuthContextProvider,
  useAuth,
  ThemeProvider,
  useTheme,
  ConnectionProvider,
  useConnection,
};
