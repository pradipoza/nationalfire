import React from "react";
import SEOHead from "@/components/seo/SEOHead";
import HeroSection from "@/components/home/HeroSection";
import ProductsPreview from "@/components/home/ProductsPreview";
import BlogsPreview from "@/components/home/BlogsPreview";
import GalleryPreview from "@/components/home/GalleryPreview";
import AboutPreview from "@/components/home/AboutPreview";
import CounterSection from "@/components/home/CounterSection";
import ContactPreview from "@/components/home/ContactPreview";
import { pageKeywords, generateStructuredData } from "@/data/seoKeywords";

const Home: React.FC = () => {
  const structuredData = generateStructuredData('localBusiness');

  return (
    <>
      <SEOHead
        title="Fire Safety Equipment Nepal | Emergency Vehicles & Fire Protection Services | National Fire"
        description="Leading fire safety equipment supplier in Nepal. We provide fire extinguishers, emergency vehicles, ambulances, fire trucks, and complete fire protection services in Kathmandu, Bhaktpur and across Nepal."
        keywords={pageKeywords.home}
        canonicalUrl="https://nationalfire.com.np"
        structuredData={structuredData}
      />
      <main className="min-w-fit">
        {/* H1 for SEO - Hidden but accessible */}
        <h1 className="sr-only">
          Fire Safety Equipment Nepal - Emergency Vehicles & Fire Protection Services by National Fire
        </h1>
        <HeroSection />
        <ProductsPreview />
        <BlogsPreview />
        <GalleryPreview />
        <AboutPreview />
        <CounterSection />
        <ContactPreview />
      </main>
    </>
  );
};

export default Home;
