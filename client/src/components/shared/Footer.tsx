import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { config } from "@/lib/config";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import type { ContactInfo, Product, SiteSettings } from "@shared/schema";
import defaultLogoImg from "@assets/image_1768730169464.png";

const Footer: React.FC = () => {
  const { data } = useQuery<{ contactInfo: ContactInfo } | undefined>({
    queryKey: [API_ENDPOINTS.CONTACT_INFO],
  });

  const { data: productsData } = useQuery<{ products: Product[] }>({
    queryKey: [API_ENDPOINTS.PRODUCTS],
  });

  const { data: siteSettingsData } = useQuery<{ siteSettings: SiteSettings | null }>({
    queryKey: [API_ENDPOINTS.SITE_SETTINGS],
  });

  const contactInfo = data?.contactInfo;
  const products = productsData?.products || [];
  const siteSettings = siteSettingsData?.siteSettings;
  const logoFromSettings = siteSettings?.logo;
  const isValidLogo = logoFromSettings && (
    logoFromSettings.startsWith("data:image/") || 
    logoFromSettings.startsWith("http")
  );
  const logoSrc = isValidLogo ? logoFromSettings : defaultLogoImg;

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-6">
              <img 
                src={logoSrc} 
                alt={siteSettings?.companyName || "National Fire Safe Pvt Ltd"} 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-6">
              Leading manufacturer of emergency vehicles, fire trucks, ambulances, and electric buses.
            </p>
            <div className="flex space-x-4">
              <a 
                href={contactInfo?.facebook || config.social.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition"
              >
                <Facebook size={20} />
              </a>
              <a 
                href={config.social.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition"
              >
                <Twitter size={20} />
              </a>
              <a 
                href={contactInfo?.instagram || config.social.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition"
              >
                <Instagram size={20} />
              </a>
              <a 
                href={contactInfo?.linkedin || config.social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white font-montserrat mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-400 hover:text-white transition">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-gray-400 hover:text-white transition">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white transition">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white font-montserrat mb-6">
              Our Products
            </h4>
            <ul className="space-y-3">
              {products.slice(0, 6).map((product) => (
                <li key={product.id}>
                  <Link href={`/products/${product.id}`} className="text-gray-400 hover:text-white transition">
                    {product.name}
                  </Link>
                </li>
              ))}
              {products.length > 6 && (
                <li>
                  <Link href="/products" className="text-gray-400 hover:text-white transition font-semibold">
                    View All Products →
                  </Link>
                </li>
              )}
              {products.length === 0 && (
                <li className="text-gray-500 text-sm">
                  Products will appear here once added
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white font-montserrat mb-6">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-primary" size={18} />
                <span className="text-gray-400">{contactInfo?.address || config.contactAddress}</span>
              </li>
              {contactInfo?.phones && contactInfo.phones.length > 0 ? (
                contactInfo.phones.map((phone, index) => (
                  <li key={index} className="flex items-center">
                    <Phone className="mr-3 text-primary" size={18} />
                    <span className="text-gray-400">{phone}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-center">
                  <Phone className="mr-3 text-primary" size={18} />
                  <span className="text-gray-400">{config.contactPhone}</span>
                </li>
              )}
              <li className="flex items-center">
                <Mail className="mr-3 text-primary" size={18} />
                <span className="text-gray-400">{contactInfo?.email || config.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} National Fire Pvt Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
