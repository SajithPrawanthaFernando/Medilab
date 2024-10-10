import React from "react";
import PageTopBanner from "../components/common/PageTopBanner";
import AboutSection from "../components/sections/AboutSection";
import HowitWorks from "../components/sections/HowitWorks";
import Testimonials from "../components/sections/Testimonials";
import BlogSection from "../components/sections/BlogSection";

const About = () => {
  return (
    <>
      <PageTopBanner title="About Us" path="/about" />
      <AboutSection />
      <HowitWorks />
      <Testimonials />
      <BlogSection />
    </>
  );
};

export default About;
