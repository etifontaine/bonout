import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

function Footer() {
  const router = useRouter();
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
        © 2023 Bonout. Tout droits réservés
      </div>
      <div className="text-white font-montserrat text-xs mt-5">
        Bonout souhaite devenir la référence mondial pour organiser les
        événements privés, en respectant la vie privée.
      </div>
      <div className="text-white font-montserrat text-sm mt-10 w-full	flex flex-col md:flex-row justify-evenly">
        <Link className="mr-10 mb-5" href="/privacy">
          Politique de confidentialité
        </Link>
        <Link href="/terms">Conditions générales d'utilisation</Link>
      </div>
    </footer>
  );
}

export default Footer;
