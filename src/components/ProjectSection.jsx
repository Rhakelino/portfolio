import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { supabase } from "../supabaseClient";

// Komponen Skeleton (tetap sama)
const ProjectSkeleton = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <div className="h-12 w-64 mx-auto bg-muted animate-pulse rounded-lg"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-card rounded-xl shadow-lg overflow-hidden animate-pulse border border-border"
          >
            <div className="w-full h-48 bg-muted"></div>
            <div className="p-6">
              <div className="h-6 w-3/4 bg-muted mb-2"></div>
              <div className="h-4 w-full bg-muted mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-4 w-16 bg-muted rounded-full"></div>
                <div className="h-4 w-16 bg-muted rounded-full"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-24 bg-muted rounded-lg"></div>
                <div className="h-8 w-24 bg-muted rounded-lg"></div>
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
    <section className="py-16" id="projects">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-4xl py-2 font-bold text-center mb-12 text-foreground"
      >
        My Projects
      </motion.h2>

      {projects.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No projects available
        </div>
      ) : (
        <>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" }
                  }
                }}
                className="bg-card rounded-xl shadow-lg border border-border overflow-hidden transition-all duration-200 hover:scale-105 flex flex-col h-full"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full md:h-72 h-fit object-cover object-top"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-card-foreground line-clamp-2 min-h-[3.5rem]">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex gap-2 mb-4 flex-wrap min-h-[2rem]">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full border border-border h-fit"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-auto">
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    >
                      <FaGithub className="mr-2" /> GitHub
                    </a>
                    <a
                      href={project.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                    >
                      <FaEye className="mr-2" /> Live Demo
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 disabled:opacity-50"
              >
                <FaChevronLeft className="mr-2" /> Previous
              </button>
              <div className="inline-flex items-center justify-center text-sm font-medium text-foreground h-10 px-4">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 disabled:opacity-50"
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