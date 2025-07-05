import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import ProjectSection from "./components/ProjectSection";
import SkillsSection from "./components/SkillsSection";
import CertificatesSection from "./components/CertificatesSection";
import ThemeToggle from "./components/ThemeToggle";
import Footer from "./components/Footer";
import { projectsData, skillsData, certificatesData } from "./data/data";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-[#000000] dark:to-[#121212] min-h-screen text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Header />
        <ProjectSection projects={projectsData} />
        <SkillsSection skills={skillsData} />
        <CertificatesSection certificates={certificatesData} />
        <Footer />
      </div>
    </div>
  );
}

export default App;