import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

const ContactPreview: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Reach out to discuss your emergency vehicle needs or request more information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-6">
              Send Us a Message
            </h3>
            <ContactForm />
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm h-full">
            <ContactInfo />
          </div>
        </div>
        
        <div className="mt-12 rounded-lg overflow-hidden shadow-md h-[450px] relative">
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
  );
};

export default ContactPreview;
