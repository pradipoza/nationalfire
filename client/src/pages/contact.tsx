import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { config } from "@/lib/config";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ContactPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.CONTACT_INFO],
  });

  const contactInfo = data?.contactInfo;
  
  return (
    <div>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
              Reach out to discuss your emergency vehicle needs or request more information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-6">
                Send Us a Message
              </h3>
              <ContactForm />
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm h-full">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">
              Our Location
            </h2>
            <p className="text-gray-500">
              Visit our headquarters and manufacturing facility
            </p>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-md h-[400px] relative">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyC8eVi6rG2ZrGcAjRVjqcMQEBlxT17hc0I'}&q=${encodeURIComponent(contactInfo?.address || config.contactAddress)}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Company Location"
            ></iframe>
          </div>
        </div>
      </section>


    </div>
  );
};

export default ContactPage;
