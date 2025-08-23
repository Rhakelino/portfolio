import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaEnvelope, FaGithub } from "react-icons/fa";

const HeaderParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Ukuran canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Konfigurasi partikel
    const particles = [];
    const particleCount = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `rgba(138, 43, 226, ${Math.random()})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Pantul di tepi
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Inisialisasi partikel
    function init() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    // Animasi
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }

    init();
    animate();

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: "transparent",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 min-h-screen flex items-center justify-center"
      >
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Almalikul Mulki Rhakelino
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Pengembang web yang bersemangat menciptakan pengalaman digital inovatif dengan teknologi modern.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/files/CV_ALMALIKUL_RHAKELINO_2025.pdf"
              download
              className="btn btn-primary shadow-lg hover:scale-105 transition"
            >
              Download CV
            </a>

            <div className="flex gap-4 items-center">
              <a href="https://www.linkedin.com/in/almalikul-mulki-rhakelino-a91104291/" target="_blank" className="text-2xl hover:text-purple-600 transition">
                <FaLinkedin />
              </a>
              <a
                href="mailto:almalikulrhakelino@gmail.com"
                className="text-2xl hover:text-purple-600 transition"
              >
                <FaEnvelope />
              </a>
              <a href="https://github.com/Rhakelino" target="_blank" className="text-2xl hover:text-purple-600 transition">
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeaderParticles;