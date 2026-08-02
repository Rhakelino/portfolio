import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = ({ isDarkMode, setIsDarkMode, className = "" }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={() => setIsDarkMode(!isDarkMode)}
    >
      {isDarkMode ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;