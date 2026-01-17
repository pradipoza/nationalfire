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
            <h4 className="text-lg font-medium text-gray-900">Phone Numbers</h4>
            {isLoading ? (
              <Skeleton className="h-5 w-36 mt-1" />
            ) : (
              <div className="text-gray-500 mt-1 space-y-1">
                {(contactInfo?.phones && contactInfo.phones.length > 0) 
                  ? contactInfo.phones.map((phone: string, index: number) => (
                      <p key={index}>{phone}</p>
                    ))
                  : <p>{config.contactPhone}</p>
                }
              </div>
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
              Sunday - Friday: {config.businessHours.weekdays}<br />
        
              Saturday: {config.businessHours.sunday}
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
            href={contactInfo?.twitter || config.social.twitter}
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
              fill="currentColor"
              className="text-white"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
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
