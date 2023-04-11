import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";


const Privacy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bonout - Conditions générales d'utilisation</title>
        <meta name="description" content="Conditions générales d'utilisation - Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités et en respectant ta vie privée!" />
        <meta property="og:title" content="Bonout - Conditions générales d'utilisation" />
        <meta
          property="og:image"
          content="https://bonout.com/header-30112021.png"
        />
        <meta property="og:type" content="siteweb" />
        <meta property="og:description" content="Conditions générales d'utilisation - Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités et en respectant ta vie privée!" />
        <link
          rel="alternate"
          href="https://bonout.com/fr/terms"
          hrefLang="fr"
        />
      </Head>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Header />
        <section className="pt-24 md:mt-10 md:h-screen flex flex-col text-left lg:px-48 md:px-12 px-4 bg-secondary">
          <div className="md:mr-10">
            <h1 className="font-pt-serif text-5xl font-bold mb-7">
            Conditions générales d'utilisation
            </h1>
          </div>
          <div>
            <p>Le document suivant décrit les conditions d'utilisation de notre Site Internet.</p>
          </div>
        </section>

        {/*  Site footer */}
        <Footer />
      </div>
    </>
  );
};

export default Privacy;
