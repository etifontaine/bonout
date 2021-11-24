import React from "react";
import type { NextPage } from "next";
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
