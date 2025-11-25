import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from '../supabaseClient'

// Komponen Skeleton
const SkillsSkeleton = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <div className="h-12 w-64 mx-auto bg-muted animate-pulse rounded-lg"></div>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {['Frontend', 'Backend', 'Mobile'].map((category, index) => (
          <div
            key={index}
            className="bg-card rounded-2xl p-8 shadow-lg animate-pulse border border-border"
          >
            <div className="h-8 w-3/4 mx-auto bg-muted mb-6 rounded-lg"></div>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex flex-col items-center">
                  <div className="bg-muted p-4 rounded-full mb-2 w-16 h-16"></div>
                  <div className="h-4 w-20 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const SkillsSection = () => {
  const [skills, setSkills] = useState({
    frontend: [],
    backend: [],
    mobile: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Fetch skills from Supabase
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('created_at', { ascending: true })

        if (error) {
          throw error
        }

        // Group skills by category
        const groupedSkills = data.reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = []
          }
          acc[skill.category].push(skill)
          return acc
        }, { frontend: [], backend: [], mobile: [] })

        setSkills(groupedSkills)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching skills:', error)
        setError(error)
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  // Loading State - Gunakan SkillsSkeleton
  if (loading) {
    return <SkillsSkeleton />;
  }

  // Error State
  if (error) {
    return (
      <section className="py-16 text-center">
        <h2 className="text-2xl text-red-500">
          Error loading skills. Please try again later.
        </h2>
      </section>
    )
  }

  return (
    <section className="py-16">
      <h2 className="text-4xl py-2 font-bold text-center mb-12 text-foreground">
        My Skills
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(skills).map(([category, skillList], index) => (
          skillList.length > 0 && (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:border-foreground border-2 border-border"
            >
              <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
                {category.charAt(0).toUpperCase() + category.slice(1)} Skills
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {skillList.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="flex flex-col items-center group"
                  >
                    <div className="bg-secondary p-4 rounded-full mb-2 transition-all group-hover:rotate-12">
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-12 h-12 group-hover:scale-110 transition-all"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground text-center">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;