import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { config } from "@/lib/config";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import SEOHead from "@/components/seo/SEOHead";
import { pageKeywords, generateStructuredData } from "@/data/seoKeywords";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ContactPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.CONTACT_INFO],
  });

  const contactInfo = data?.contactInfo || null;
  const structuredData = generateStructuredData('service', {
    name: "Fire Safety Consultation Services",
    description: "Professional fire safety consultation and emergency vehicle services in Nepal"
  });
  
  return (
    <>
      <SEOHead
        title="Contact National Fire Nepal | Fire Safety Consultation Services Kathmandu | Emergency Vehicle Maintenance"
        description="Contact National Fire Nepal for fire safety consultation services in Kathmandu, emergency vehicle maintenance, fire equipment installation and professional fire protection services across Nepal."
        keywords={pageKeywords.contact}
        canonicalUrl="https://nationalfire.com.np/contact"
        structuredData={structuredData}
      />
      <div>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
              Contact National Fire Nepal | Fire Safety Consultation Services
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
              Contact us for fire safety consultation services in Kathmandu, emergency vehicle maintenance, fire equipment installation and professional fire protection services across Nepal.
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
          
          <div className="rounded-lg overflow-hidden shadow-md h-[450px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d429.1491423711422!2d85.3834551158536!3d27.661864516286794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1ba428e0de19%3A0xca78845c5b764d54!2sNational%20Fire%20Safe%20Pvt.Ltd!5e0!3m2!1sen!2snp!4v1751468448638!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="National Fire Safe Pvt.Ltd Location"
            ></iframe>
          </div>
        </div>
      </section>


    </div>
    </>
  );
};

export default ContactPage;
