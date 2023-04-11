import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";


const Privacy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bonout - Politique de confidentialité</title>
        <meta name="description" content="Politique de confidentialité - Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités et en respectant ta vie privée!" />
        <meta property="og:title" content="Bonout - Politique de confidentialité" />
        <meta
          property="og:image"
          content="https://bonout.com/header-30112021.png"
        />
        <meta property="og:type" content="siteweb" />
        <meta property="og:description" content="Politique de confidentialité - Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités et en respectant ta vie privée!" />
        <link
          rel="alternate"
          href="https://bonout.com/fr/privacy"
          hrefLang="fr"
        />
      </Head>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Header />
        <section className="pt-24 md:mt-10 md:h-screen flex flex-col text-left lg:px-48 md:px-12 px-4 bg-secondary">
          <div className="md:mr-10">
            <h1 className="font-pt-serif text-5xl font-bold mb-7">
              Politique de confidentialité
            </h1>
          </div>
          <div>
            <p>La protection de vos données personnelles est importante pour Bonout et nous réalisons nos traitements dans le respect de vos droits, tels que prévus par le Règlement européen 2016/679 du 27 avril 2016 (le « RGPD ») et la loi française n° 78-17 du 6 janvier 1978 modifiée en dernier lieu par la loi française n°2018-493 du 20 juin 2018 relative à la protection des données (ensemble dénommé le « Cadre légal »). C'est la raison pour laquelle nous expliquons, en détail, dans ce document (notre « Politique de confidentialité »), les types d'informations personnelles que nous collectons et ce qui peut arriver à ces informations personnelles lors de l'utilisation de nos sites Web et des applications et ressources associées (collectivement, le "Prestations de service").</p>
          </div>
        </section>
        {/*  Site footer */}
        <Footer />
      </div>
    </>
  );
};

export default Privacy;
