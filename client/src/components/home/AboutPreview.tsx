import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerSection from "@/components/CustomerSection";
import fireExtinguisherImg from "@assets/ChatGPT Image Jul 2, 2025, 06_55_51 PM_1751462265443.png";
import fireTruckImg from "@assets/ChatGPT Image Jul 2, 2025, 06_44_37 PM_1751462265444.png";
import electricBusImg from "@assets/national fire 3_1751462265443.jpg";
import ambulanceImg from "@assets/nationalfire2_1751462265445.webp";

const AboutPreview: React.FC = () => {
  const { data: aboutContentData } = useQuery<{ aboutContent: { introTitle: string; content: string } | null }>({
    queryKey: [API_ENDPOINTS.ABOUT_CONTENT],
  });

  const aboutContent = aboutContentData?.aboutContent;

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat">
            About National Fire Safe Pvt. Ltd.
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Safety and innovation drive everything we do - protecting lives and
            property across Nepal since 2009
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">
              {aboutContent?.introTitle || "Our Company"}
            </h3>
            {aboutContent?.content ? (
              <div 
                className="text-gray-600 mb-6 leading-relaxed prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: aboutContent.content }}
              />
            ) : (
              <>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  At National Fire Safe Pvt. Ltd., safety and innovation drive
                  everything we do. Since 2009, we've been dedicated to protecting
                  lives and property across Nepal with top-tier fire safety,
                  electric vehicles, and emergency solutions.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  As a premier provider in Nepal, we supply comprehensive solutions
                  including firefighting equipment, emergency vehicles, and
                  eco-friendly transport options, complemented by expert
                  consultation, professional installation, and reliable after-sales
                  maintenance.
                </p>
              </>
            )}
            <div className="mt-8">
              <Link href="/about">
                <Button className="bg-gradient-to-r from-red-600 to-blue-600 text-white hover:from-red-700 hover:to-blue-700">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={fireExtinguisherImg}
                alt="Fire extinguisher in action - demonstrating our firefighting equipment effectiveness"
                className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-semibold text-sm">
                    Fire Safety Equipment
                  </h4>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={fireTruckImg}
                alt="Fire truck responding to emergency - showcasing our emergency vehicle expertise"
                className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-semibold text-sm">Emergency Response</h4>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={electricBusImg}
                alt="Electric buses - demonstrating our eco-friendly transportation solutions"
                className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-semibold text-sm">Electric Buses</h4>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={ambulanceImg}
                alt="Electric ambulance - showcasing our medical emergency vehicle capabilities"
                className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-semibold text-sm"> Ambulances</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Section */}
        <CustomerSection
          title="Trusted by Leading Organizations"
          subtitle="Proud to serve emergency services and government agencies nationwide"
          className="pt-16"
        />
      </div>
    </section>
  );
};

export default AboutPreview;
