import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "@components/Header";
import HeroHome from "@components/Landing/HeroHome";
import HowItWorks from "@components/Landing/HowItWorks";
import FeaturesHome from "@components/Landing/Features";
import FAQ from "@components/Landing/FAQ";
import Footer from "@components/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bonout</title>
        <meta name="description" content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités et en respectant ta vie privée!" />
        <meta property="og:title" content="Bonout" />
        <meta
          property="og:image"
          content="https://bonout.com/header-30112021.png"
        />
        <meta property="og:type" content="siteweb" />
        <meta property="og:description" content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités et en respectant ta vie privée" />
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
