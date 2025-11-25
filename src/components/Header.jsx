import { motion } from "framer-motion";
import { FaLinkedin, FaEnvelope, FaGithub } from "react-icons/fa";

const HeaderParticles = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 min-h-screen flex items-center justify-center"
      >
        <div className="text-center space-y-6">
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-extrabold text-foreground"
          >
            Almalikul Mulki Rhakelino
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Pengembang web yang bersemangat menciptakan pengalaman digital inovatif dengan teknologi modern.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex justify-center gap-4"
          >
            <motion.a
              href="/files/CV_ALMALIKUL_RHAKELINO_2025.pdf"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-lg"
            >
              Download CV
            </motion.a>

            <motion.div 
              variants={itemVariants}
              className="flex gap-4 items-center"
            >
              <motion.a 
                href="https://www.linkedin.com/in/almalikul-mulki-rhakelino-a91104291/" 
                target="_blank"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl text-foreground hover:text-muted-foreground transition"
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href="mailto:almalikulrhakelino@gmail.com"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl text-foreground hover:text-muted-foreground transition"
              >
                <FaEnvelope />
              </motion.a>
              <motion.a 
                href="https://github.com/Rhakelino" 
                target="_blank"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl text-foreground hover:text-muted-foreground transition"
              >
                <FaGithub />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeaderParticles;