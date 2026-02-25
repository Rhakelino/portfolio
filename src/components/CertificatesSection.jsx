import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { supabase } from "../supabaseClient";

// Komponen Skeleton
const CertificatesSkeleton = () => {
  return (
    <section className="py-24 overflow-hidden" id="certificates">
      <div className="text-center mb-16">
        <div className="h-12 w-64 mx-auto bg-muted animate-pulse rounded-lg"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl overflow-hidden shadow-xl animate-pulse bg-card/50 aspect-[4/3]"
          >
            <div className="w-full h-full bg-muted"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CertificatesSection = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCertificates(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const openCertificateModal = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const closeCertificateModal = () => {
    setSelectedCertificate(null);
  };

  const CertificateModal = ({ certificate, onClose }) => {
    if (!certificate) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-5xl w-full bg-card rounded-2xl shadow-2xl overflow-hidden border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-border/50">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{certificate.title}</h3>
                <p className="text-muted-foreground">{certificate.provider} • {certificate.date}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="bg-muted/30 p-4 sm:p-8 flex justify-center items-center">
              <img
                src={certificate.image}
                alt={certificate.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Loading State - Gunakan CertificatesSkeleton
  if (loading) {
    return <CertificatesSkeleton />;
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
    <section className="py-24 overflow-hidden" id="certificates">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="inline-block text-primary font-semibold tracking-wider uppercase text-sm mb-3">
          Achievements
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
          Certificates & Awards
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto px-4 text-base md:text-lg">
          Bukti dedikasi dan perjalanan saya dalam terus belajar dan mengasah keterampilan di bidang teknologi.
        </p>
      </motion.div>

      {certificates.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No certificates available
        </div>
      ) : (
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto"
        >
          {certificates.map((certificate, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="group relative rounded-2xl overflow-hidden shadow-lg bg-card border border-border/30 aspect-[4/3] cursor-pointer"
              onClick={() => openCertificateModal(certificate)}
            >
              {/* Image Container with Zoom effect */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>

              {/* Default State Content (Bottom) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full text-white transition-all duration-300 group-hover:-translate-y-4">
                <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 drop-shadow-md">
                  {certificate.provider}
                </span>
                <h3 className="text-xl md:text-2xl font-bold leading-tight drop-shadow-md">
                  {certificate.title}
                </h3>

                {/* Hover Reveal Content */}
                <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-4">
                  <p className="text-sm text-gray-300 line-clamp-3 mb-4">
                    {certificate.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {certificate.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {certificate.skills.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs font-medium">
                        +{certificate.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Overlay Date Badge */}
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 text-xs font-semibold text-foreground shadow-sm">
                {certificate.date}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={closeCertificateModal}
        />
      )}
    </section>
  );
};

export default CertificatesSection;