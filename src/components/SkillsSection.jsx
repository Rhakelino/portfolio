import React from "react";
import { motion } from "framer-motion";

const SkillsSection = ({ skills }) => {
  return (
    <section className="py-16">
      <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        My Skills
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(skills).map(([category, skillList], index) => (
          <motion.div
            key={index}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
            }}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg transition-all duration-300 hover:border-purple-500 border-2 border-transparent"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-purple-600">
              {category.charAt(0).toUpperCase() + category.slice(1)} Skills
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {skillList.map((skill, skillIndex) => (
                <motion.div
                  key={skillIndex}
                  whileHover={{ scale: 1.15 }}
                  className="flex flex-col items-center group"
                >
                  <div className="bg-purple-100 dark:bg-neutral-700 p-4 rounded-full mb-2 transition-all group-hover:rotate-12">
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-12 h-12 group-hover:scale-110 transition-all"
                    />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 text-center">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;