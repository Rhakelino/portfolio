import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { supabase } from "../supabaseClient";
import OptimizedImage from "./OptimizedImage";
import { useQuery } from '@tanstack/react-query';

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
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  // Query untuk total projects
  const { data: totalProjects = 0 } = useQuery({
    queryKey: ['projects', 'count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  // Query untuk projects pada halaman saat ini
  const { data: projects = [], isLoading: loading } = useQuery({
    queryKey: ['projects', 'page', currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * projectsPerPage;
      const to = from + projectsPerPage - 1;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      return data || [];
    },
    placeholderData: (previousData) => previousData
  });

  const totalPages = Math.ceil(totalProjects / projectsPerPage);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);

      // Auto-scroll to the top of the section
      const section = document.getElementById("projects");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Gunakan ProjectSkeleton saat loading
  if (loading && projects.length === 0) {
    return <ProjectSkeleton />;
  }

  // Jika error (meski TanStack nangkap error di state .error, kita fallback saja jika array kosong)
  if (!loading && projects.length === 0) {
    return (
      <section className="py-16 text-center">
        <p className="text-red-500">Tidak ada project untuk ditampilkan.</p>
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
        Projects Showcase
      </motion.h2>

      {projects.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No projects available
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-card rounded-xl shadow-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full group"
                >
                  <div className="relative overflow-hidden w-full md:h-72 h-fit">
                    <OptimizedImage
                      src={project.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <Link
                      to={`/project/${project.id}`}
                      className="text-white font-medium flex items-center hover:underline"
                    >
                      View Details <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow relative z-10 bg-card">
                  <Link to={`/project/${project.id}`} className="hover:text-primary transition-colors">
                    <h3 className="text-xl font-bold mb-2 text-card-foreground line-clamp-2 min-h-[3.5rem]">{project.title}</h3>
                  </Link>
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
                      onClick={(e) => !project.github_link && e.preventDefault()}
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-9 px-3 border border-input ${project.github_link
                        ? "bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                    >
                      <FaGithub className="mr-2" /> GitHub
                    </a>
                    <a
                      href={project.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => !project.live_link && e.preventDefault()}
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-9 px-3 ${project.live_link
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                    >
                      <FaEye className="mr-2" /> Live Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

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