import React from "react";
import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-black sectionSize">
      <div className="mb-4">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          className="h-4"
          width="40"
          height="40"
        />
      </div>
      <div className="text-white font-montserrat text-sm">
        © 2021 Bonout. Tout droits réservés
      </div>
    </footer>
  );
}

export default Footer;
