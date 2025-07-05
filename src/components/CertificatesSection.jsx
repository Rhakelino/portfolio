import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const CertificatesSection = ({ certificates }) => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

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

  return (
    <section className="py-16">
      <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        Certificates
      </h2>

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