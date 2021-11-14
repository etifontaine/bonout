import React, { useEffect } from 'react';
import type { NextPage } from 'next'
import Header from '../components/Landing/Header';
import HeroHome from '../components/Landing/HeroHome';
import FeaturesHome from '../components/Landing/Features';
import Testimonials from '../components/Landing/Testimonials';
import Newsletter from '../components/Landing/Newsletter';
import Footer from '../components/Landing/Footer';

import AOS from 'aos';

const Home: NextPage = () => {

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
  });


  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

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
  )
}

export default Home
