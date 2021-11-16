import React, { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import HeroHome from "../components/Landing/HeroHome";
import FeaturesHome from "../components/Landing/Features";
import Testimonials from "../components/Landing/Testimonials";
import Footer from "../components/Footer";

import AOS from "aos";

const Home: NextPage = () => {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 500,
      easing: "ease-out-cubic",
    });
  });

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Bonout</title>
        <meta
          name="description"
          content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités!"
        />
        <meta charSet="utf-8" />
        <link rel="icon" href="/images/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">
        {/*  Page sections */}
        <HeroHome />
        <FeaturesHome />
        <Testimonials />
      </main>

      {/*  Site footer */}
      <Footer />
    </div>
  );
};

export default Home;
