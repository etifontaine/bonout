import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

function Footer() {
  const { t } = useTranslation("common");
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
        © 2021 Bonout. {t("footer.copyright")}
      </div>
      <div className="text-white font-montserrat text-xs mt-5">
        {t(`footer.why_bonout`)}
      </div>
      <div className="text-white font-montserrat text-sm mt-10 w-full	flex flex-col md:flex-row justify-evenly">
        <Link href={`privacy`}>
          <a className="mr-10 mb-5">
            {t(`privacy`)}
          </a>
        </Link>
        <Link href={`terms`}>
          {t(`terms`)}
        </Link>
      </div>
      <div className="text-white font-montserrat text-sm mt-10 flex flex-row justify-evenly">
        <Link href={`${router.asPath}`} locale="en">
        <a className="mr-10">
          {t(`locale.en`)}
          </a>
        </Link>
        <br />
        <Link href={`${router.asPath}`} locale="fr">
          {t(`locale.fr`)}
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
