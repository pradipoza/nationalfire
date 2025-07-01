import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Check } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerSection from "@/components/CustomerSection";

const AboutPreview: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat">
            About National Fire Safe Pvt. Ltd.
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Safety and innovation drive everything we do - protecting lives and property across Nepal since 2009
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">
              Our Company
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              At National Fire Safe Pvt. Ltd., safety and innovation drive everything we do. Since 2009, we've been dedicated to protecting lives and property across Nepal with top-tier fire safety, electric vehicles, and emergency solutions.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              As a premier provider in Nepal, we supply comprehensive solutions including firefighting equipment, emergency vehicles, and eco-friendly transport options, complemented by expert consultation, professional installation, and reliable after-sales maintenance.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-600 flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="ml-3 text-gray-700">Firefighting equipment & suppression systems</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="ml-3 text-gray-700">Electric ambulances for rapid medical response</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-600 flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="ml-3 text-gray-700">Eco-friendly electric buses & transport solutions</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="ml-3 text-gray-700">Expert consultation & professional installation</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link href="/about">
                <Button className="bg-gradient-to-r from-red-600 to-blue-600 text-white hover:from-red-700 hover:to-blue-700">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1624028293340-ebe943e68e5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Factory floor" 
              className="rounded-lg shadow-md w-full h-48 md:h-64 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1622555086398-f80213455158?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Emergency vehicle" 
              className="rounded-lg shadow-md w-full h-48 md:h-64 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1617721303438-8626d6c5fb77?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Workshop" 
              className="rounded-lg shadow-md w-full h-48 md:h-64 object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1577201235224-78255892ef9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Team" 
              className="rounded-lg shadow-md w-full h-48 md:h-64 object-cover" 
            />
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
