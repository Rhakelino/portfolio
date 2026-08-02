import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaGithub, FaEye } from "react-icons/fa";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";
import OptimizedImage from "../components/OptimizedImage";

const ProjectDetailSkeleton = () => {
    return (
        <div className="bg-background min-h-screen text-foreground transition-colors duration-200">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl py-24">
                <Skeleton className="h-10 w-24 mb-8" />
                <Skeleton className="h-12 w-3/4 md:w-1/2 mb-4" />
                <div className="flex gap-2 mb-8">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="w-full aspect-video rounded-xl mb-12" />
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                    <div className="md:col-span-1 space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isDarkMode, setIsDarkMode } = useTheme();

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
        fetchProjectDetail();
    }, [id]);

    const fetchProjectDetail = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            setProject(data);
        } catch (err) {
            console.error("Error fetching project:", err);
            setError("Proyek tidak ditemukan atau terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} className="fixed top-5 right-5 z-50 rounded-full shadow-md backdrop-blur-md bg-background/50 border-border/50" />
                <ProjectDetailSkeleton />
            </>
        );
    }

    if (error || !project) {
        return (
            <div className="bg-background min-h-screen text-foreground transition-colors duration-200">
                <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} className="fixed top-5 right-5 z-50 rounded-full shadow-md backdrop-blur-md bg-background/50 border-border/50" />
                <div className="container mx-auto px-4 md:px-8 max-w-6xl py-32 text-center">
                    <h1 className="text-4xl font-bold mb-4">Oops!</h1>
                    <p className="text-muted-foreground mb-8">{error}</p>
                    <Button asChild>
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
                        </Link>
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    // Format date correctly
    const formattedDate = new Date(project.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors duration-200">
            <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} className="fixed top-5 right-5 z-50 rounded-full shadow-md backdrop-blur-md bg-background/50 border-border/50" />

            <main className="container mx-auto px-4 md:px-8 max-w-5xl py-24 sm:py-32">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 sm:mb-12 group"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Portfolio
                </Link>

                {/* Header Section */}
                <header className="mb-12">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
                        {project.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                        </div>
                        <span>•</span>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="px-2.5 py-0.5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full border border-border"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Hero Image */}
                <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 mb-16 group relative bg-muted/10 flex justify-center items-center p-4 sm:p-8">
                  <OptimizedImage
                        src={project.image || 'https://via.placeholder.com/1200x600?text=No+Image'}
                        alt={project.title}
                        className="w-full h-auto max-h-[70vh] object-contain transition-transform duration-700 ease-in-out group-hover:scale-[1.02] rounded-lg shadow-lg"
                        objectFit="contain"
                    />
                </div>

                {/* Content Section */}
                <div className="grid md:grid-cols-3 gap-12 sm:gap-16">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold mb-6">About this project</h2>
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            {project.description.split('\n').map((paragraph, index) => (
                                <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-base sm:text-lg">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar / Links */}
                    <div className="md:col-span-1">
                        <div className="sticky top-32 p-6 rounded-2xl border border-border bg-card/50 backdrop-blur shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Project Links</h3>
                            <div className="flex flex-col gap-3">
                                {project.live_link ? (
                                    <Button asChild size="lg" className="w-full shadow-md font-semibold group relative overflow-hidden transition-all hover:scale-[1.02]">
                                        <a href={project.live_link} target="_blank" rel="noopener noreferrer">
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                            <FaEye className="mr-2 h-5 w-5 relative z-10" />
                                            <span className="relative z-10">Live Preview</span>
                                        </a>
                                    </Button>
                                ) : (
                                    <Button disabled size="lg" className="w-full font-semibold">
                                        <FaEye className="mr-2 h-5 w-5" /> No Live Link
                                    </Button>
                                )}

                                {project.github_link ? (
                                    <Button asChild variant="outline" size="lg" className="w-full hover:bg-secondary transition-colors font-semibold">
                                        <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                                            <FaGithub className="mr-2 h-5 w-5" /> View Source Code
                                        </a>
                                    </Button>
                                ) : (
                                    <Button disabled variant="outline" size="lg" className="w-full font-semibold">
                                        <FaGithub className="mr-2 h-5 w-5" /> No Source Code
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProjectDetail;
