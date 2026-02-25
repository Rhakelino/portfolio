import { motion } from "framer-motion";
import { FaLinkedin, FaEnvelope, FaGithub, FaChevronDown } from "react-icons/fa";

const Header = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <div className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-4xl px-4 text-center space-y-8"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/80 text-secondary-foreground text-sm font-medium mb-4 backdrop-blur-sm border border-border">
            Welcome to my portfolio
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight px-2"
        >
          Almalikul Mulki <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Rhakelino</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4"
        >
          Pengembang web yang bersemangat menciptakan pengalaman digital inovatif dengan teknologi modern.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4"
        >
          <motion.a
            href="/files/CV_ALMALIKUL_RHAKELINO_2025.pdf"
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center rounded-full text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 shadow-lg w-full sm:w-auto"
          >
            Download CV
          </motion.a>

          <div className="flex gap-5 items-center">
            <motion.a
              href="https://www.linkedin.com/in/almalikul-mulki-rhakelino-a91104291/"
              target="_blank"
              whileHover={{ y: -5, color: "var(--foreground)" }}
              className="text-2xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaLinkedin />
            </motion.a>
            <motion.a
              href="https://github.com/Rhakelino"
              target="_blank"
              whileHover={{ y: -5, color: "var(--foreground)" }}
              className="text-2xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaGithub />
            </motion.a>
            <motion.a
              href="mailto:almalikulrhakelino@gmail.com"
              whileHover={{ y: -5, color: "var(--foreground)" }}
              className="text-2xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaEnvelope />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="hidden md:block text-xs font-semibold text-muted-foreground uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaChevronDown className="text-muted-foreground" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Header;