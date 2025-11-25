import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div className="fixed top-5 right-5 z-50">
      <label className="swap swap-rotate">
        <input
          type="checkbox"
          className="theme-controller"
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
        />
        
        {/* Sun icon */}
        <FaSun className="swap-off fill-current w-6 h-6" />
        
        {/* Moon icon */}
        <FaMoon className="swap-on fill-current w-6 h-6" />
      </label>
    </div>
  );
};

export default ThemeToggle;