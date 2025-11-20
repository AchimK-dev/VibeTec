import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("vibetec-theme");
    return savedTheme || "light";
  });

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("vibetec-theme", theme);
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
