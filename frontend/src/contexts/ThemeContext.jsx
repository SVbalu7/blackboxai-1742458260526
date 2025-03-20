import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useCustomHooks';
import { THEMES, STORAGE_KEYS } from '../utils/constants';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Get system theme preference
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  };

  // Initialize theme from local storage or system preference
  const [storedTheme, setStoredTheme] = useLocalStorage(
    STORAGE_KEYS.THEME,
    THEMES.SYSTEM
  );

  const [theme, setTheme] = useState(
    storedTheme === THEMES.SYSTEM ? getSystemTheme() : storedTheme
  );

  // Update theme when system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (storedTheme === THEMES.SYSTEM) {
        setTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storedTheme]);

  // Update document classes when theme changes
  useEffect(() => {
    document.documentElement.classList.remove(THEMES.LIGHT, THEMES.DARK);
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setStoredTheme(newTheme);
      setTheme(newTheme === THEMES.SYSTEM ? getSystemTheme() : newTheme);
    }
  };

  // Theme colors based on current theme
  const colors = {
    primary: theme === THEMES.DARK ? '#60a5fa' : '#3b82f6',
    background: theme === THEMES.DARK ? '#111827' : '#ffffff',
    text: theme === THEMES.DARK ? '#f3f4f6' : '#111827',
    border: theme === THEMES.DARK ? '#374151' : '#e5e7eb',
    success: theme === THEMES.DARK ? '#34d399' : '#10b981',
    warning: theme === THEMES.DARK ? '#fbbf24' : '#f59e0b',
    danger: theme === THEMES.DARK ? '#f87171' : '#ef4444'
  };

  // Custom CSS properties for theme
  useEffect(() => {
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  }, [theme]);

  const value = {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === THEMES.DARK,
    colors
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme toggle component
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === THEMES.DARK ? (
        <svg
          className="w-5 h-5 text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

// Theme selector component
export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-4">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="form-select rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        <option value={THEMES.SYSTEM}>System</option>
        <option value={THEMES.LIGHT}>Light</option>
        <option value={THEMES.DARK}>Dark</option>
      </select>
    </div>
  );
};

// Custom hook for theme-aware styling
export const useThemedStyle = (lightStyle, darkStyle) => {
  const { isDark } = useTheme();
  return isDark ? darkStyle : lightStyle;
};

// Custom hook for theme-aware classes
export const useThemedClass = (baseClass) => {
  const { isDark } = useTheme();
  return `${baseClass} ${isDark ? 'dark' : 'light'}`;
};