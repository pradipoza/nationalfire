import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import CustomerSection from "@/components/CustomerSection";
import SEOHead from "@/components/seo/SEOHead";
import { pageKeywords, generateStructuredData } from "@/data/seoKeywords";
import fireExtinguisherImg from "@assets/ChatGPT Image Jul 2, 2025, 06_55_51 PM_1751462265443.png";
import fireTruckImg from "@assets/ChatGPT Image Jul 2, 2025, 06_44_37 PM_1751462265444.png";
import electricBusImg from "@assets/national fire 3_1751462265443.jpg";
import ambulanceImg from "@assets/nationalfire2_1751462265445.webp";

const AboutPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.ABOUT_STATS],
  });

  const structuredData = generateStructuredData('organization');

  const aboutStats = data?.aboutStats;
  const counterRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!aboutStats || hasAnimated) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateValue("years-counter", 0, aboutStats.yearsExperience, 1500);
          animateValue("customers-counter", 0, aboutStats.customersServed, 1500);
          animateValue("products-counter", 0, aboutStats.productsSupplied, 1500);
          setHasAnimated(true);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [aboutStats, hasAnimated]);

  const animateValue = (id: string, start: number, end: number, duration: number) => {
    const obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      obj.innerHTML = currentValue.toString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  return (
    <>
      <SEOHead
        title="About National Fire Nepal | Fire Safety Company Bhaktpur | Government Fire Equipment Supplier"
        description="Leading fire safety company in Bhaktpur, Nepal since 2009. Government approved fire equipment supplier serving hospitals, municipalities and industries across Nepal. Professional fire safety training and consultation services."
        keywords={pageKeywords.about}
        canonicalUrl="https://nationalfire.com.np/about"
        structuredData={structuredData}
      />
      <div>
      {/* Company Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
              About National Fire Nepal | Fire Safety Company Bhaktpur
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
              Government approved fire equipment supplier and fire safety company in Bhaktpur, Nepal since 2009. Leading provider of fire protection services, emergency vehicles, and industrial fire safety solutions across Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">Our Company</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  At National Fire Safe Pvt. Ltd., safety and innovation drive everything we do. Since 2009, we've been dedicated to protecting lives and property across Nepal with top-tier fire safety, electric vehicles, and emergency solutions.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  As a premier provider in Nepal, we supply comprehensive solutions including firefighting equipment, emergency vehicles, and eco-friendly transport options, complemented by expert consultation, professional installation, and reliable after-sales maintenance.
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-blue-50 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Our Comprehensive Offerings:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-600 flex items-center justify-center mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="ml-3 text-gray-700">Firefighting equipment: extinguishers, hydrants, suppression systems, and accessories</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="ml-3 text-gray-700">Emergency vehicles: fully equipped electric ambulances for rapid medical response</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-600 flex items-center justify-center mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="ml-3 text-gray-700">Eco-friendly transport: electric buses for safe, sustainable transportation</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={fireExtinguisherImg} 
                  alt="Fire extinguisher in action - demonstrating our firefighting equipment effectiveness" 
                  className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">Fire Safety Equipment</h4>
                    <p className="text-sm opacity-90">Professional firefighting solutions</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={fireTruckImg} 
                  alt="Fire truck responding to emergency - showcasing our emergency vehicle expertise" 
                  className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">Emergency Response</h4>
                    <p className="text-sm opacity-90">Advanced fire trucks & equipment</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={electricBusImg} 
                  alt="Electric buses - demonstrating our eco-friendly transportation solutions" 
                  className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">Electric Buses</h4>
                    <p className="text-sm opacity-90">Sustainable transportation solutions</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={ambulanceImg} 
                  alt="Electric ambulance - showcasing our medical emergency vehicle capabilities" 
                  className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold"> Ambulances</h4>
                    <p className="text-sm opacity-90">Rapid medical response vehicles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white font-montserrat mb-6">Mission Statement</h2>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto">
              To protect Nepali communities and advance public safety by supplying high-quality, reliable, and sustainable fire protection products, electric emergency vehicles, and clean transportation solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-montserrat">Our Values</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
              Core principles that guide every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-red-600">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M12 14v8"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600">
                Ensuring every product and service protects lives and property
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-blue-600">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
              <p className="text-gray-600">
                Upholding transparency, honesty, and trust in all dealings
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-green-600">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Commitment</h3>
              <p className="text-gray-600">
                Delivering certified, dependable equipment and vehicles
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-purple-600">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <path d="M20 8v6"/>
                  <path d="M23 11h-6"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                Building long-term partnerships through tailored service and support
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-amber-600 md:col-span-2 lg:col-span-1">
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.58 12a3.99 3.99 0 0 1-1.59 8H8.5A6.5 6.5 0 1 1 8.5 5H12"/>
                  <path d="m17 8 4 4-4 4"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation & Sustainability</h3>
              <p className="text-gray-600">
                Embracing modern technology and eco-friendly solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Customers */}
      <CustomerSection className="bg-gray-50" />

      {/* Experience & Statistics */}
      <section ref={counterRef} className="counter-section py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold font-montserrat mb-2">
                {isLoading ? (
                  <Skeleton className="h-12 w-20 mx-auto bg-gray-700" />
                ) : (
                  <>
                    <span id="years-counter">0</span>+
                  </>
                )}
              </div>
              <p className="text-lg">Years of Experience</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold font-montserrat mb-2">
                {isLoading ? (
                  <Skeleton className="h-12 w-20 mx-auto bg-gray-700" />
                ) : (
                  <>
                    <span id="customers-counter">0</span>+
                  </>
                )}
              </div>
              <p className="text-lg">Customers Served</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold font-montserrat mb-2">
                {isLoading ? (
                  <Skeleton className="h-12 w-20 mx-auto bg-gray-700" />
                ) : (
                  <>
                    <span id="products-counter">0</span>+
                  </>
                )}
              </div>
              <p className="text-lg">Vehicles Supplied</p>
            </div>

          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold font-montserrat">Ready to learn more about our vehicles?</h2>
              <p className="mt-4 text-lg text-gray-300">
                Contact us today to discuss your emergency vehicle needs or to schedule a consultation with our team.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md text-lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default AboutPage;
