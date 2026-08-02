import React from "react";
import Header from "./components/Header";
import ProjectSection from "./components/ProjectSection";
import SkillsSection from "./components/SkillsSection";
import GithubSection from "./components/GithubSection";
import CertificatesSection from "./components/CertificatesSection";
import ThemeToggle from "./components/ThemeToggle";
import Footer from "./components/Footer";
import { useTheme } from "./contexts/ThemeContext";

function App() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-200">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} className="fixed top-5 right-5 z-50 rounded-full shadow-md backdrop-blur-md bg-background/50 border-border/50" />
        <Header />
        <ProjectSection />
        <SkillsSection />
        <GithubSection />
        <CertificatesSection />
        <Footer />
      </div>
    </div>
  );
}

export default App;