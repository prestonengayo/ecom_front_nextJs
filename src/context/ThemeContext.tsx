import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Clear existing classes
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.body.classList.remove('light-mode', 'dark-mode');

    // Add the appropriate class based on the theme
    const className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';
    document.documentElement.classList.add(className);
    document.body.classList.add(className);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Clear and reapply classes as needed
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.body.classList.remove('light-mode', 'dark-mode');
    const className = newTheme === 'dark' ? 'dark-mode' : 'light-mode';
    document.documentElement.classList.add(className);
    document.body.classList.add(className);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
