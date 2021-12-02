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
import { getEventsCount } from "src/models/events";

export async function getServerSideProps() {
  const res = await getEventsCount();
  const data: Data = { countEvents: res };
  return { props: { data } };
}

type Data = {
  countEvents: number;
};

const Home: NextPage<{ data: Data }> = ({ data }) => {
  return (
    <>
      <Head>
        <title>Bonout</title>
        <meta
          name="description"
          content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités!"
        />
        <meta property="og:title" content="Bonout" />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/header-30112021.png`}
        />
        <meta property="og:type" content="siteweb" />
        <meta
          property="og:description"
          content="Organise ton prochain événement sans prise de tête, un seul site avec toutes les fonctionnalités!"
        />
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
