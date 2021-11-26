import React from "react";
import Link from "next/link";
import Image from "next/image";

function HeroHome() {
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
          <Link href="/events/create">
            <a className="bg-black px-6 py-4 rounded-lg border-2 border-black border-solid text-white mr-2 mb-2">
              Créer un événement
            </a>
          </Link>
        </div>
      </div>
      <div className="flex justify-around md:block mt-8 md:mt-0 md:flex-1">
        <div className="relative">
          <img
            src="/images/Highlight1.svg"
            className="absolute -top-16 -left-10"
          />
        </div>
        <img src="/images/MacBookPro.png" alt="Macbook" />
        <div className="relative">
          <img
            src="/images/Highlight2.svg"
            className="absolute -bottom-10 -right-6"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroHome;
