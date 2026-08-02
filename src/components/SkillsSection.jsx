import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { supabase } from '../supabaseClient';
import { useQuery } from '@tanstack/react-query';

// Komponen Skeleton
const SkillsSkeleton = () => {
  return (
    <section className="py-12 md:py-16 overflow-hidden" id="skills">
      <div className="text-center mb-16">
        <div className="h-12 w-64 mx-auto bg-muted animate-pulse rounded-lg"></div>
      </div>
      <div className="flex flex-col gap-8">
        {[1, 2].map((row) => (
          <div key={row} className="flex gap-4 animate-pulse px-4">
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div key={item} className="h-24 w-32 md:w-48 bg-muted rounded-2xl flex-shrink-0"></div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

// Kartu Skill Individual
const SkillCard = ({ skill }) => (
  <div className="mx-4 md:mx-6 flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] transition-all duration-300 hover:scale-110 hover:border-primary/50 group min-w-[140px] md:min-w-[180px]">
    <img
      src={skill.icon}
      alt={skill.name}
      className="w-12 h-12 md:w-16 md:h-16 mb-4 object-contain group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
    />
    <span className="text-sm md:text-base font-semibold text-foreground tracking-wide">
      {skill.name}
    </span>
  </div>
);

const SkillsSection = () => {
  const { data: skills = [], isLoading: loading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data || [];
    }
  });

  if (loading) return <SkillsSkeleton />;

  if (skills.length === 0) {
    return null; // Don't show anything if no skills
  }

  // Split skills into two rows for dual-direction marquee if there are enough skills
  const midPoint = Math.ceil(skills.length / 2);
  const topRowSkills = skills.slice(0, midPoint);
  const bottomRowSkills = skills.slice(midPoint);

  return (
    <section className="py-12 md:py-16 overflow-hidden" id="skills">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="inline-block text-primary font-semibold tracking-wider uppercase text-sm mb-3">
          Technologies
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
          My Tech Stack
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto px-4 text-base md:text-lg">
          Kumpulan teknologi dan alat yang saya gunakan sehari-hari untuk merajut baris kode menjadi solusi digital yang nyata.
        </p>
      </motion.div>

      <div className="relative flex flex-col gap-8 md:gap-12 w-full mt-10">
        {/* Gradient overlays to make edges smooth */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Top Row Marquee - Moving Left */}
            <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              className="py-4 overflow-visible"
            >
              {[...topRowSkills, ...topRowSkills].map((skill, index) => (
                <SkillCard key={`top-${index}`} skill={skill} />
              ))}
            </Marquee>

            {/* Bottom Row Marquee - Moving Right (Only if we have enough skills to split) */}
            {bottomRowSkills.length > 0 && (
              <Marquee
                gradient={false}
                speed={40}
                direction="right"
                pauseOnHover={true}
                className="py-4 mt-4 overflow-visible"
              >
                {[...bottomRowSkills, ...bottomRowSkills].map((skill, index) => (
                  <SkillCard key={`bottom-${index}`} skill={skill} />
                ))}
              </Marquee>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;