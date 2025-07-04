import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaEye,
  FaLinkedin,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  // State untuk modal sertifikat
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Fungsi untuk membuka modal sertifikat
  const openCertificateModal = (certificate) => {
    setSelectedCertificate(certificate);
  };

  // Fungsi untuk menutup modal sertifikat
  const closeCertificateModal = () => {
    setSelectedCertificate(null);
  };

  // Komponen Modal Sertifikat
  const CertificateModal = ({ certificate, onClose }) => {
    if (!certificate) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 text-white hover:text-red-500 z-50"
            >
              <FaTimes className="text-3xl" />
            </button>

            <img
              src={certificate.image}
              alt={certificate.title}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };
  const projects = [
    {
      title: "Quran Digital",
      description:
        "Web-based Al-Quran application with comprehensive reading and listening features.",
      technologies: ["React", "Tailwind", "JavaScript"],
      image: "./images/quran.png",
      githubLink: "https://github.com/Rhakelino/alquran-digital",
      liveLink: "https://al-qurran.netlify.app/",
    },
    {
      title: "Juju Otaku",
      description:
        "Anime search website providing detailed information about various anime.",
      technologies: ["React", "Tailwind", "DaisyUI"],
      image: "./images/anime2.png",
      githubLink: "https://github.com/Rhakelino/juju-otaku",
      liveLink: "https://juju-otaku.netlify.app/",
    },
    {
      title: "Juju News",
      description:
        "News website offering latest updates across multiple categories.",
      technologies: ["React", "Tailwind", "DaisyUI"],
      image: "./images/juju-news.png",
      githubLink: "https://github.com/Rhakelino/juju-news",
      liveLink: "https://juju-news.netlify.app/",
    },
  ];

  const skills = {
    frontend: [
      { name: "HTML", icon: "./images/html.svg" },
      { name: "CSS", icon: "./images/css.svg" },
      { name: "JavaScript", icon: "./images/js.svg" },
      { name: "React", icon: "./images/react.svg" },
      { name: "Tailwind", icon: "./images/tailwind.svg" },
    ],
    backend: [
      { name: "PHP", icon: "./images/php.svg" },
      { name: "MySQL", icon: "./images/mysql.svg" },
      { name: "Node.js", icon: "./images/node.svg" },
    ],
    mobile: [
      { name: "React Native", icon: "./images/native.svg" },
      { name: "Expo", icon: "./images/expo.svg" },
    ],
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-[#000000] dark:to-[#121212] min-h-screen text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Theme Toggle */}
        <div className="fixed top-5 right-5 z-50">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full transition-all hover:rotate-45"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Almalikul Mulki Rhakelino
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Passionate web developer crafting innovative digital experiences
              with modern technologies.
            </p>

            <div className="flex justify-center gap-4">
              <a
                href="/files/22101152630273_AlmalikulMulkiRhakelino_Magang.pdf"
                download
                className="btn btn-primary shadow-lg hover:scale-105 transition"
              >
                Download CV
              </a>

              <div className="flex gap-4 items-center">
                <a
                  href="#"
                  className="text-2xl hover:text-purple-600 transition"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="#"
                  className="text-2xl hover:text-purple-600 transition"
                >
                  <FaEnvelope />
                </a>
                <a
                  href="#"
                  className="text-2xl hover:text-purple-600 transition"
                >
                  <FaGithub />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Section */}
        <section className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            My Projects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex gap-2 mb-4">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-purple-100 dark:bg-neutral-800 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      className="btn btn-outline btn-sm"
                    >
                      <FaGithub className="mr-2" /> GitHub
                    </a>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      className="btn btn-primary btn-sm dark:btn-warning"
                    >
                      <FaEye className="mr-2" /> Live Demo
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-16">
          {" "}
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            {" "}
            My Skills{" "}
          </h2>{" "}
          <div className="grid md:grid-cols-3 gap-8">
            {" "}
            {Object.entries(skills).map(([category, skillList], index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg transition-all duration-300 hover:border-purple-500 border-2 border-transparent"
              >
                {" "}
                <h3 className="text-2xl font-bold mb-6 text-center text-purple-600">
                  {" "}
                  {category.charAt(0).toUpperCase() +
                    category.slice(1)} Skills{" "}
                </h3>{" "}
                <div className="grid grid-cols-3 gap-6">
                  {" "}
                  {skillList.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      whileHover={{ scale: 1.15 }}
                      className="flex flex-col items-center group"
                    >
                      {" "}
                      <div className="bg-purple-100 dark:bg-neutral-700 p-4 rounded-full mb-2 transition-all group-hover:rotate-12">
                        {" "}
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="w-12 h-12 group-hover:scale-110 transition-all"
                        />{" "}
                      </div>{" "}
                      <span className="text-sm text-gray-700 dark:text-gray-300 text-center">
                        {" "}
                        {skill.name}{" "}
                      </span>{" "}
                    </motion.div>
                  ))}{" "}
                </div>{" "}
              </motion.div>
            ))}{" "}
          </div>
        </section>

        {/* Certificates Section */}
        <section className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Certificates
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Belajar Dasar Pemrograman Web",
                provider: "Dicoding",
                date: "14 September 2023",
                image: "./images/web.png",
                description:
                  "Comprehensive course covering fundamental web development principles and practices.",
                skills: ["HTML", "CSS", "JavaScript"],
              },
              {
                title: "Belajar Membuat Frontend",
                provider: "Dicoding",
                date: "14 September 2023",
                image: "./images/frontend.png",
                description:
                  "Advanced frontend development course focusing on modern web technologies.",
                skills: ["React", "Tailwind", "UI/UX"],
              },
            ].map((certificate, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                }}
                className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
                    <h3 className="text-2xl font-bold">{certificate.title}</h3>
                    <p className="text-sm opacity-80">{certificate.provider}</p>
                  </div>
                </div>

                <div className="p-6 flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {certificate.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {certificate.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Issued: {certificate.date}
                    </span>
                    <button
                      onClick={() => openCertificateModal(certificate)}
                      className="btn btn-sm btn-outline btn-primary"
                    >
                      View Certificate
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} Almalikul Mulki Rhakelino. All Rights
            Reserved.
          </p>
        </footer>
      </div>

      {/* Modal Sertifikat */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={closeCertificateModal}
        />
      )}
    </div>
  );
}

export default App;
