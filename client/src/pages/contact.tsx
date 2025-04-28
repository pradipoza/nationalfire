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

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 font-montserrat">
              How Can We Help You?
            </h2>
            <p className="mt-2 text-gray-500">
              Choose the department that best matches your inquiry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 8h14"/><path d="M5 12h14"/><path d="M5 16h14"/><path d="M3 4h18v16H3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sales Department</h3>
              <p className="text-gray-500 mb-4">
                For inquiries about our products, pricing, and availability.
              </p>
              <div className="text-gray-700">
                <p className="flex items-center mb-2">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  +1 (555) 123-4560
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  sales@nationalfire.com
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Support Team</h3>
              <p className="text-gray-500 mb-4">
                For technical assistance, parts, and servicing requests.
              </p>
              <div className="text-gray-700">
                <p className="flex items-center mb-2">
                  <Phone className="h-4 w-4 mr-2 text-secondary" />
                  +1 (555) 123-4561
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-secondary" />
                  support@nationalfire.com
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 17a5 5 0 0 1 0-10h8a5 5 0 0 1 0 10h-8"/><path d="M12 17v4"/><path d="M16 7V3"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Partnerships</h3>
              <p className="text-gray-500 mb-4">
                For business development, collaborations, and dealer inquiries.
              </p>
              <div className="text-gray-700">
                <p className="flex items-center mb-2">
                  <Phone className="h-4 w-4 mr-2 text-green-600" />
                  +1 (555) 123-4562
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-green-600" />
                  partnerships@nationalfire.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
