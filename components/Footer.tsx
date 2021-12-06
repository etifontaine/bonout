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
      <div className="text-white font-montserrat text-sm">
        <Link href={`${router.asPath}`} locale="en">
          {t(`locale.en`)}
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
