import { createContext, useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";

const ConnectionContext = createContext();

export { ConnectionContext };

export const ConnectionProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Initial connection check
    const checkConnection = async () => {
      try {
        await axiosInstance.get("/health");
        setIsOnline(true);
      } catch (error) {
        if (!error.response) {
          setIsOnline(false);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();

    // Add axios interceptor to detect connection errors globally
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          // Network error - no response from server
          setIsOnline(false);
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  const retry = async () => {
    setIsChecking(true);
    try {
      await axiosInstance.get("/health");
      setIsOnline(true);
    } catch (error) {
      if (!error.response) {
        setIsOnline(false);
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <ConnectionContext.Provider value={{ isOnline, isChecking, retry }}>
      {children}
    </ConnectionContext.Provider>
  );
};
