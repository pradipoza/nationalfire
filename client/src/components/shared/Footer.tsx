import React from "react";
import { Link } from "wouter";
import { config } from "@/lib/config";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 2c.5 0 .9 0 1.4.1a4 4 0 0 1 3.5 3.5c.2 1 .1 2.2-.3 3.4a4 4 0 0 1 2.1 2.1c1.2-.4 2.3-.5 3.4-.3a4 4 0 0 1 3.5 3.5c.4 2.7-2.1 5.8-6.5 7.8-1.3.6-2.8 1-4.1 1.1-1.3.1-2.6 0-3.7-.4A4 4 0 0 1 9 21c-1.1.4-2.4.5-3.7.4-1.3-.1-2.8-.5-4.1-1.1-4.4-2-6.9-5.1-6.5-7.8a4 4 0 0 1 3.5-3.5c1.1-.2 2.3-.1 3.4.3a4 4 0 0 1 2.1-2.1c-.4-1.2-.5-2.3-.3-3.4a4 4 0 0 1 3.5-3.5c.5-.1.9-.1 1.4-.1Z" />
                  <path d="M12 7c1.5 0 2.3.8 2.7 1.7" />
                  <path d="M9.3 8.7c.4-.9 1.2-1.7 2.7-1.7" />
                  <path d="M7.8 15.1c-1.1 0-2-.9-2-2 0-1.2.9-2 2-2h8.4c1.1 0 2 .9 2 2 0 1.1-.9 2-2 2" />
                  <path d="M12 7v10" />
                  <path d="M4.5 13a2.5 2.5 0 0 0 0-5" />
                  <path d="M19.5 13a2.5 2.5 0 0 1 0-5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white font-montserrat">
                NATIONAL FIRE
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Leading manufacturer of emergency vehicles, fire trucks, ambulances, and electric buses.
            </p>
            <div className="flex space-x-4">
              <a 
                href={config.social.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition"
              >
                <Twitter size={20} />
              </a>
              <a 
                href={config.social.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition"
              >
                <Instagram size={20} />
              </a>
              <a 
                href={config.social.linkedin} 
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
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-gray-400 hover:text-white transition">Products</a>
                </Link>
              </li>
              <li>
                <Link href="/blogs">
                  <a className="text-gray-400 hover:text-white transition">Blogs</a>
                </Link>
              </li>
              <li>
                <Link href="/gallery">
                  <a className="text-gray-400 hover:text-white transition">Gallery</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-white transition">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-white transition">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white font-montserrat mb-6">
              Our Products
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=fire-trucks">
                  <a className="text-gray-400 hover:text-white transition">Fire Trucks</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=ambulances">
                  <a className="text-gray-400 hover:text-white transition">Ambulances</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=electric-buses">
                  <a className="text-gray-400 hover:text-white transition">Electric Buses</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=rescue-equipment">
                  <a className="text-gray-400 hover:text-white transition">Rescue Equipment</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=spare-parts">
                  <a className="text-gray-400 hover:text-white transition">Spare Parts</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=custom-solutions">
                  <a className="text-gray-400 hover:text-white transition">Custom Solutions</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white font-montserrat mb-6">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-primary" size={18} />
                <span className="text-gray-400">{config.contactAddress}</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-primary" size={18} />
                <span className="text-gray-400">{config.contactPhone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-primary" size={18} />
                <span className="text-gray-400">{config.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} National Fire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
