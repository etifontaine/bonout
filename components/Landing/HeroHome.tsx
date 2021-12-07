import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

function HeroHome() {
  const { t } = useTranslation("landing");
  const router = useRouter()
  return (
    <section className="pt-24 md:mt-0 md:h-screen flex flex-col justify-center text-center md:text-left md:flex-row md:justify-between md:items-center lg:px-48 md:px-12 px-4 bg-secondary">
      <div className="md:flex-1 md:mr-10">
        <h1 className="font-pt-serif text-5xl font-bold mb-7">
          {t("head.part1")}
          <span className="bg-underline1 bg-left-bottom bg-no-repeat pb-2 bg-100%">
            {" "}
            {t("head.part2")}
          </span>
        </h1>
        <p className="font-pt-serif font-normal mb-7">
          {t("head.description")}
        </p>
        <div className="font-montserrat">
          <Link href="/events/create">
            <a className="bg-black px-6 py-4 rounded-lg border-2 border-black border-solid text-white mr-2 mb-2">
              {t("head.create_event")}
            </a>
          </Link>
        </div>
      </div>
      <div className="flex justify-around md:block mt-8 md:mt-0 md:flex-1">
        <div className="relative">
          <img
            src="/images/Highlight1.svg"
            alt="Highlight1"
            className="absolute -top-16 -left-10"
          />
        </div>
        <Image
          src={`/images/iphone-${router.locale}.webp`}
          height="438"
          width="219"
          alt="iPhone"
        />
        <div className="relative">
          <img
            src="/images/Highlight2.svg"
            alt="Highlight2"
            className="absolute -bottom-10 left-52"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroHome;
