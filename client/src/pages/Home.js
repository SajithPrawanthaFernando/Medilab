import React from "react";

import Hero from "../components/sections/Hero";
import AboutSection from "../components/sections/AboutSection";
import ServicesSection from "../components/sections/ServicesSection";
import HowitWorks from "../components/sections/HowitWorks";
import Testimonials from "../components/sections/Testimonials";
import BlogSection from "../components/sections/BlogSection";

const Home = () => {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <HowitWorks />
      <Testimonials />
      <BlogSection />
    </>
  );
};

export default Home;
