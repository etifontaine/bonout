import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "@components/Header";
import HeroHome from "@components/Landing/HeroHome";
import HowItWorks from "@components/Landing/HowItWorks";
import FeaturesHome from "@components/Landing/Features";
import FAQ from "@components/Landing/FAQ";
import Footer from "@components/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "landing", "faq"])),
  },
});

const Home: NextPage = () => {
  const { t } = useTranslation(["common", "faq"]);
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
        <link rel="alternate" href="https://bonout.com/fr" hrefLang="fr" />
        <link rel="alternate" href="https://bonout.com/" hrefLang="en" />
        <script type="application/ld+json">
          {{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
              "@type": "Question",
              "name": t("howIsItDifferent.title"),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t("howIsItDifferent.answer")
              }
            }, {
              "@type": "Question",
              "name": t("howToInvite.title"),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t("howToInvite.answer")
              }
            }, {
              "@type": "Question",
              "name": t("howIsItFinanced.title"),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t("howIsItFinanced.answer")
              }
            }, {
              "@type": "Question",
              "name": t("isAccountRequired.title"),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t("isAccountRequired.answer")
              }
            }, {
              "@type": "Question",
              "name": t("howToSaveUserID.title"),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t("howToSaveUserID.answer")
              }
            }, {
              "@type": "Question",
              "name": t("isThereAnApp.title"),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t("isThereAnApp.answer")
              }
            },
            ]
          }}
        </script>
      </Head >
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
