import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import HeroHome from "../components/Landing/HeroHome";
import FeaturesHome from "../components/Landing/Features";
import Testimonials from "../components/Landing/Testimonials";
import Footer from "../components/Footer";
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
      <Header />

      {/*  Page content */}
      <main className="flex-grow">
        <HeroHome />
        <FeaturesHome />
        <Testimonials countEvents={data.countEvents} />
      </main>

      {/*  Site footer */}
      <Footer />
    </div>
  );
};

export default Home;
