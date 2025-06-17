import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const AboutPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.ABOUT_STATS],
  });

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
    <div>
      {/* Company Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
              About National Fire
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
              Committed to excellence in emergency vehicle manufacturing since 1985
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">Our Company</h3>
              <p className="text-gray-500 mb-4">
                Founded in 1985, National Fire has been at the forefront of emergency vehicle manufacturing for over three decades. We specialize in designing and building high-quality fire trucks, ambulances, and modern electric buses that meet the demanding needs of emergency services and transportation providers worldwide.
              </p>
              <p className="text-gray-500 mb-4">
                Our state-of-the-art manufacturing facilities combine advanced technology with skilled craftsmanship to create vehicles that are reliable, efficient, and built to last. We understand that our products are used in critical situations where performance and dependability are non-negotiable.
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
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-gray-600">Environmentally conscious manufacturing</span>
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

      {/* Our Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-montserrat">Our Mission & Values</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
              Guiding principles that drive our company forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-500">
                We strive for excellence in everything we do, from the design and manufacturing of our vehicles to our customer service and support.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.58 12a3.99 3.99 0 0 1-1.59 8H8.5A6.5 6.5 0 1 1 8.5 5H12"/>
                  <path d="m17 8 4 4-4 4"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-500">
                We continuously invest in research and development to create cutting-edge emergency vehicles that incorporate the latest technology and safety features.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safety</h3>
              <p className="text-gray-500">
                Safety is at the core of our mission. We are committed to building vehicles that protect both emergency responders and the communities they serve.
              </p>
            </div>
          </div>
        </div>
      </section>

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
  );
};

export default AboutPage;
