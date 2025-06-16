import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { Skeleton } from "@/components/ui/skeleton";

const CounterSection: React.FC = () => {
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
  );
};

export default CounterSection;
