import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaEye } from "react-icons/fa";

const ProjectSection = ({ projects }) => {
  return (
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
  );
};

export default ProjectSection;