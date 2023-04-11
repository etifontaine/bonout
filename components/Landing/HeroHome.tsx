import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

function HeroHome() {
  const router = useRouter();
  return (
    <section className="pt-24 md:mt-0 md:h-screen flex flex-col justify-center text-center md:text-left md:flex-row md:justify-between md:items-center lg:px-48 md:px-12 px-4 bg-secondary">
      <div className="md:flex-1 md:mr-10">
        <h1 className="font-pt-serif text-5xl font-bold mb-7">
          Bonout, organise tes
          <span className="bg-underline1 bg-left-bottom bg-no-repeat pb-2 bg-100%">
            {" "}
            événements!
          </span>
        </h1>
        <p className="font-pt-serif font-normal mb-7">
          Bonout t'aide à organiser ton prochain événement, gratuit et sans
          inscription!
        </p>
        <div className="font-montserrat">
          <Link
            href="/events/create"
            className="bg-black px-6 py-4 rounded-lg border-2 border-black border-solid text-white mr-2 mb-2"
          >
            Créer un événement
          </Link>
        </div>
      </div>
      <div className="flex justify-around md:block mt-8 md:mt-0 md:flex-1">
        <Image
          src={`/images/iphone-fr.png`}
          height="438"
          width="219"
          alt="iPhone"
        />
      </div>
    </section>
  );
}

export default HeroHome;
