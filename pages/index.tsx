import React from "react";
import type { NextPage } from "next";
import dynamic from 'next/dynamic'
import Header from "@components/Header";
import HeroHome from "@components/Landing/HeroHome";
import HowItWorks from "@components/Landing/HowItWorks";
const FeaturesHome = dynamic(() => import('@components/Landing/Features'))
const FAQ = dynamic(() => import('@components/Landing/FAQ'))
const Footer = dynamic(() => import('@components/Footer'))
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
      <Header />

      {/*  Page content */}
      <HeroHome />
      <HowItWorks />
      <FeaturesHome />
      <FAQ />

      {/*  Site footer */}
      <Footer />
    </div>
  );
};

export default Home;
