import React from "react";

const Footer = () => {
  return (
    <footer className="py-8 text-center">
      <p className="text-gray-600 dark:text-gray-300">
        © {new Date().getFullYear()} Almalikul Mulki Rhakelino. All Rights
        Reserved.
      </p>
    </footer>
  );
};

export default Footer;