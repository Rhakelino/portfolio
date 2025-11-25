import React from "react";

const Footer = () => {
  return (
    <footer className="py-8 text-center border-t border-border">
      <p className="text-muted-foreground">
        © {new Date().getFullYear()} Almalikul Mulki Rhakelino. All Rights
        Reserved.
      </p>
    </footer>
  );
};

export default Footer;