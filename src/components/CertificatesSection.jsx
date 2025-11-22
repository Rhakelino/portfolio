import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { supabase } from "../supabaseClient";

// Komponen Skeleton
const CertificatesSkeleton = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <div className="h-12 w-64 mx-auto bg-gray-300 dark:bg-neutral-700 animate-pulse rounded-lg"></div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xl animate-pulse"
          >
            <div className="w-full h-64 bg-gray-300 dark:bg-neutral-700"></div>
            <div className="p-6">
              <div className="h-6 w-3/4 bg-gray-300 dark:bg-neutral-700 mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-300 dark:bg-neutral-700 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-4 w-16 bg-gray-300 dark:bg-neutral-700 rounded-full"></div>
                <div className="h-4 w-16 bg-gray-300 dark:bg-neutral-700 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-300 dark:bg-neutral-700"></div>
                <div className="h-8 w-24 bg-gray-300 dark:bg-neutral-700 rounded-lg"></div>
              </div>
            </div>
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
    <section className="py-16">
      <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        Certificates
      </h2>

      {certificates.length === 0 ? (
        <div className="text-center text-gray-500">
          No certificates available
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {certificates.map((certificate, index) => (
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