import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Check } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const AboutPreview: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat">
            About National Fire
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Committed to excellence in emergency vehicle manufacturing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">
              Our Company
            </h3>
            <p className="text-gray-500 mb-4">
              Founded in 1985, National Fire has been at the forefront of emergency vehicle manufacturing for over three decades. We specialize in designing and building high-quality fire trucks, ambulances, and modern electric buses that meet the demanding needs of emergency services and transportation providers worldwide.
            </p>
            <p className="text-gray-500 mb-6">
              Our commitment to innovation, quality, and reliability has made us a trusted partner for fire departments, emergency medical services, and municipal transport authorities across the country.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="ml-3 text-gray-600">Industry-leading safety standards</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="ml-3 text-gray-600">Custom-built to your specifications</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="ml-3 text-gray-600">Comprehensive after-sales support</span>
              </li>
            </ul>
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
      </div>
    </section>
  );
};

export default AboutPreview;
