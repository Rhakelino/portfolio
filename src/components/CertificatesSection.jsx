import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { supabase } from "../supabaseClient";
import OptimizedImage from "./OptimizedImage";
import { useQuery } from '@tanstack/react-query';

const INITIAL_SHOW = 6;

const CertificatesSkeleton = () => {
  return (
    <section className="py-12 md:py-16 overflow-hidden" id="certificates">
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

const getThumbUrl = (url) => {
  if (!url) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}width=400&quality=60`;
};

const CertificatesSection = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const { data: certificates = [], isLoading: loading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  const visibleCerts = showAll ? certificates : certificates.slice(0, INITIAL_SHOW);
  const hasMore = certificates.length > INITIAL_SHOW;

  const closeCertificateModal = () => {
    setSelectedCertificate(null);
  };

  const CertificateModal = ({ certificate, onClose }) => {
    if (!certificate) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <div
          className="relative max-w-5xl w-full bg-card rounded-2xl shadow-2xl overflow-hidden border border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
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

          <div className="bg-muted/30 p-4 sm:p-8 flex justify-center items-center">
            <OptimizedImage
              src={certificate.image}
              alt={certificate.title}
              className="w-full h-auto max-h-[70vh] rounded-lg shadow-lg"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading && certificates.length === 0) {
    return <CertificatesSkeleton />;
  }

  if (!loading && certificates.length === 0) {
    return (
      <section className="py-16 text-center">
        <p className="text-red-500">Tidak ada sertifikat untuk ditampilkan.</p>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 overflow-hidden" id="certificates">
      <div className="text-center mb-16">
        <span className="inline-block text-primary font-semibold tracking-wider uppercase text-sm mb-3">
          Achievements
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
          Certificates &amp; Awards
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto px-4 text-base md:text-lg">
          Bukti dedikasi dan perjalanan saya dalam terus belajar dan mengasah keterampilan di bidang teknologi.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No certificates available
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
            {visibleCerts.map((certificate) => (
              <div
                key={certificate.id}
                className="group relative rounded-2xl overflow-hidden shadow-lg bg-card border border-border/30 aspect-[4/3] cursor-pointer"
                onClick={() => setSelectedCertificate(certificate)}
              >
                <div className="absolute inset-0 w-full h-full">
                  <OptimizedImage
                    src={getThumbUrl(certificate.image)}
                    alt={certificate.title}
                    className="w-full h-full transition-transform duration-700 md:group-hover:scale-110"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 md:group-hover:opacity-90 transition-opacity duration-300"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full text-white transition-all duration-300 md:group-hover:-translate-y-4">
                  <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 drop-shadow-md">
                    {certificate.provider}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight drop-shadow-md">
                    {certificate.title}
                  </h3>

                  <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 md:group-hover:max-h-40 md:group-hover:opacity-100 md:group-hover:mt-4">
                    <p className="text-sm text-gray-300 line-clamp-3 mb-4">
                      {certificate.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {certificate.skills.slice(0, 3).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-white/20 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {certificate.skills.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">
                          +{certificate.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-background/95 px-3 py-1.5 rounded-full border border-border/50 text-xs font-semibold text-foreground shadow-sm">
                  {certificate.date}
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
              >
                {showAll ? 'Show Less' : `Show All (${certificates.length})`}
              </button>
            </div>
          )}
        </>
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
