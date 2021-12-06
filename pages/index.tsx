import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import Header from "@components/Header";
import HeroHome from "@components/Landing/HeroHome";
import HowItWorks from "@components/Landing/HowItWorks";
const FeaturesHome = dynamic(() => import("@components/Landing/Features"));
const FAQ = dynamic(() => import("@components/Landing/FAQ"));
const Footer = dynamic(() => import("@components/Footer"));
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "landing", "faq"])),
  },
});

const Home: NextPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{t("site.title")}</title>
        <meta name="description" content={t("site.description")} />
        <meta property="og:title" content={t("site.title")} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/header-30112021.png`}
        />
        <meta property="og:type" content="siteweb" />
        <meta property="og:description" content={t("site.description")} />
      </Head>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Header />

        {/*  Page content */}
        <HeroHome />
        <HowItWorks />
        <FeaturesHome />
        <FAQ />

        {/*  Site footer */}
        <Footer />
      </div>
    </>
  );
};

export default Home;
