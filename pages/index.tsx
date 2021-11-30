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
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/logos/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/logos/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/logos/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/logos/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/logos/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/logos/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/logos/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/logos/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/logos/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/logos/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/logos/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/logos/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/logos/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F3F2ED" />
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
