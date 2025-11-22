import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { supabase } from "../supabaseClient";
import OptimizedImage from "./OptimizedImage";

// Komponen Skeleton (tetap sama)
const ProjectSkeleton = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <div className="h-12 w-64 mx-auto bg-gray-300 dark:bg-neutral-700 animate-pulse rounded-lg"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div 
            key={item}
            className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-gray-300 dark:bg-neutral-700"></div>
            <div className="p-6">
              <div className="h-6 w-3/4 bg-gray-300 dark:bg-neutral-700 mb-2"></div>
              <div className="h-4 w-full bg-gray-300 dark:bg-neutral-700 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-4 w-16 bg-gray-300 dark:bg-neutral-700 rounded-full"></div>
                <div className="h-4 w-16 bg-gray-300 dark:bg-neutral-700 rounded-full"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-24 bg-gray-300 dark:bg-neutral-700 rounded-lg"></div>
                <div className="h-8 w-24 bg-gray-300 dark:bg-neutral-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const projectsPerPage = 6;

  useEffect(() => {
    fetchTotalProjects();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  const fetchTotalProjects = async () => {
    try {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact' });

      if (error) {
        throw error;
      }

      setTotalProjects(count || 0);
    } catch (error) {
      console.error("Error fetching total projects:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Hitung range untuk pagination
      const from = (currentPage - 1) * projectsPerPage;
      const to = from + projectsPerPage - 1;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      setProjects(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Fungsi untuk mengubah halaman
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Hitung total halaman
  const totalPages = Math.ceil(totalProjects / projectsPerPage);

  // Gunakan ProjectSkeleton saat loading
  if (loading) {
    return <ProjectSkeleton />;
  }

  // Error State
  if (error) {
    return (
      <section className="py-16 text-center">
        <p className="text-red-500">Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="py-16">
      <h2 className="text-4xl py-2 font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        My Projects
      </h2>

      {projects.length === 0 ? (
        <div className="text-center text-gray-500">
          No projects available
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden"
              >
                <OptimizedImage
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48"
                  width={600}
                  height={400}
                  quality={80}
                  objectFit="cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex gap-2 mb-4 flex-wrap">
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
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <FaGithub className="mr-2" /> GitHub
                    </a>
                    <a
                      href={project.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm dark:btn-warning"
                    >
                      <FaEye className="mr-2" /> Live Demo
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline btn-primary"
              >
                <FaChevronLeft className="mr-2" /> Previous
              </button>
              <div className="btn btn-ghost">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-outline btn-primary"
              >
                Next <FaChevronRight className="ml-2" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProjectSection;