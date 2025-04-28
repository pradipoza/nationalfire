import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { config } from "@/lib/config";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ContactInfo: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.CONTACT_INFO],
  });

  const contactInfo = data?.contactInfo;

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-6">
        Contact Information
      </h3>

      <div className="space-y-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Our Address</h4>
            {isLoading ? (
              <Skeleton className="h-5 w-64 mt-1" />
            ) : (
              <p className="text-gray-500 mt-1">
                {contactInfo?.address || config.contactAddress}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Phone Number</h4>
            {isLoading ? (
              <Skeleton className="h-5 w-36 mt-1" />
            ) : (
              <p className="text-gray-500 mt-1">
                {contactInfo?.phone || config.contactPhone}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Email Address</h4>
            {isLoading ? (
              <Skeleton className="h-5 w-48 mt-1" />
            ) : (
              <p className="text-gray-500 mt-1">
                {contactInfo?.email || config.contactEmail}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Business Hours</h4>
            <p className="text-gray-500 mt-1">
              Monday - Friday: {config.businessHours.weekdays}<br />
              Saturday: {config.businessHours.saturday}<br />
              Sunday: {config.businessHours.sunday}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Follow Us</h4>
        <div className="flex space-x-4">
          <a
            href={contactInfo?.facebook || config.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-[#4267B2] flex items-center justify-center text-white hover:bg-opacity-90 transition"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:bg-opacity-90 transition"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href={contactInfo?.whatsapp || config.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:bg-opacity-90 transition"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-message-circle"
            >
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
            </svg>
          </a>
          <a
            href={contactInfo?.linkedin || config.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:bg-opacity-90 transition"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
