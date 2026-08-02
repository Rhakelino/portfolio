import React from "react";
import { GitHubCalendar } from "react-github-calendar";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const GithubSection = () => {
  const { isDarkMode } = useTheme();

  return (
    <section className="py-12 md:py-16 overflow-hidden" id="github">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="inline-block text-primary font-semibold tracking-wider uppercase text-sm mb-3">
          Code Journey
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Open Source Activity
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto px-4 text-base md:text-lg mb-8">
          Konsistensi dan dedikasi dalam membangun solusi perangkat lunak, tercermin dari jejak komit harian.
        </p>

        <div className="w-full max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex justify-center p-6 md:p-10 bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.05)]">
            <div className="w-full overflow-hidden flex justify-center [&>article]:w-full [&>article]:max-w-full">
              <GitHubCalendar 
                username="Rhakelino" 
                colorScheme={isDarkMode ? "dark" : "light"}
                blockSize={15}
                blockMargin={5}
                blockRadius={4}
                fontSize={14}
                showWeekdayLabels={true}
                theme={{
                  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default GithubSection;
