import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { config } from "@/lib/config";
import { Phone, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";

const HeroSection: React.FC = () => {
  const { data } = useQuery({
    queryKey: [API_ENDPOINTS.CONTACT_INFO],
  });

  const contactInfo = data?.contactInfo;
  const whatsappUrl = contactInfo?.whatsapp || config.social.whatsapp;

  return (
    <section className="hero-section h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center md:text-left md:max-w-2xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-montserrat leading-tight">
            Fire Safety Equipment Nepal - Emergency Vehicles & Fire Protection Services
          </h2>
          <p className="mt-6 text-xl text-gray-200 max-w-3xl">
            Leading supplier of fire extinguishers, emergency vehicles, ambulances, and complete fire protection services in Kathmandu, Bhaktpur and across Nepal. Government approved fire safety equipment for hospitals, municipalities and industries.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium rounded-md text-lg shadow">
                <Phone className="mr-2 h-5 w-5" /> Contact Now
              </Button>
            </Link>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-md text-lg shadow">
                <MessageSquare className="mr-2 h-5 w-5" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
