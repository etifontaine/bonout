import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "@components/Header";
import HeroHome from "@components/Landing/HeroHome";
import Footer from "@components/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["terms", "common"])),
  },
});

const Privacy: NextPage = () => {
  const { t } = useTranslation(["terms"]);

  return (
    <>
      <Head>
        <title>{t("site.title")}</title>
        <meta name="description" content={t("site.description")} />
        <meta property="og:title" content={t("site.title")} />
        <meta
          property="og:image"
          content="https://bonout.com/header-30112021.png"
        />
        <meta property="og:type" content="siteweb" />
        <meta property="og:description" content={t("site.description")} />
        <link
          rel="alternate"
          href="https://bonout.com/fr/terms"
          hrefLang="fr"
        />
        <link rel="alternate" href="https://bonout.com/terms" hrefLang="en" />
      </Head>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Header />
        <section className="pt-24 md:mt-10 md:h-screen flex flex-col text-left lg:px-48 md:px-12 px-4 bg-secondary">
          <div className="md:mr-10">
            <h1 className="font-pt-serif text-5xl font-bold mb-7">
              {t("title")}
            </h1>
          </div>
          <div>
            <p>{t("content")}</p>
          </div>
        </section>

        {/*  Site footer */}
        <Footer />
      </div>
    </>
  );
};

export default Privacy;
