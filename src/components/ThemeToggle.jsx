import React from "react";

const ThemeToggle = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div className="fixed top-5 right-5 z-50">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full transition-all hover:rotate-45"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    </div>
  );
};

export default ThemeToggle;