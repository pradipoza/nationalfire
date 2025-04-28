import React from "react";
import HeroSection from "@/components/home/HeroSection";
import ProductsPreview from "@/components/home/ProductsPreview";
import BlogsPreview from "@/components/home/BlogsPreview";
import GalleryPreview from "@/components/home/GalleryPreview";
import AboutPreview from "@/components/home/AboutPreview";
import CounterSection from "@/components/home/CounterSection";
import ContactPreview from "@/components/home/ContactPreview";

const Home: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <ProductsPreview />
      <BlogsPreview />
      <GalleryPreview />
      <AboutPreview />
      <CounterSection />
      <ContactPreview />
    </main>
  );
};

export default Home;
