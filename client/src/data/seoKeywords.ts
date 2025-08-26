// SEO Keywords organized by priority and type
export const seoKeywords = {
  primary: [
    "fire safety equipment Nepal",
    "emergency vehicles Nepal", 
    "fire protection services Nepal",
    "ambulance services Nepal",
    "fire truck manufacturer Nepal",
    "fire safety company Bhaktpur",
    "emergency vehicles Kathmandu",
    "fire equipment supplier Nepal",
    "ambulance supplier Nepal",
    "fire protection Kathmandu valley",
    "fire extinguisher Nepal",
    "portable fire pump Nepal",
    "firefighting equipment Nepal",
    "electric ambulance Nepal",
    "fire safety boots Nepal",
    "fire protection suit Nepal",
    "generator supplier Nepal",
    "garbage compactor Nepal",
    "electric bus Nepal",
    "firefighting boat Nepal",
    "fire safety consultation Nepal",
    "emergency vehicle maintenance Nepal",
    "fire equipment installation Nepal",
    "fire safety training Nepal",
    "government fire equipment supplier",
    "municipality fire vehicles Nepal",
    "hospital ambulance supplier Nepal",
    "industrial fire safety Nepal",
    "commercial fire protection Nepal"
  ],
  longTail: [
    "best fire safety equipment company in Nepal",
    "portable fire fighting pump supplier Kathmandu",
    "Italian fire extinguisher distributor Nepal",
    "Japanese fire pump dealer Nepal",
    "electric ambulance manufacturer Nepal",
    "fire protection suit supplier Bhaktpur",
    "government approved fire equipment Nepal",
    "fire safety equipment for hospitals Nepal",
    "municipal garbage compactor supplier Nepal",
    "eco-friendly electric bus Nepal",
    "emergency vehicle spare parts Nepal",
    "fire safety consultation services Kathmandu",
    "firefighting equipment maintenance Nepal"
  ],
  locations: [
    "Nepal",
    "Kathmandu",
    "Bhaktpur", 
    "Kathmandu valley",
    "Pokhara",
    "Lalitpur",
    "Biratnagar",
    "Dharan",
    "Birgunj",
    "Chitwan"
  ],
  services: [
    "fire safety",
    "emergency vehicles",
    "fire protection",
    "ambulance services",
    "firefighting equipment",
    "fire safety training",
    "emergency response",
    "fire consultation",
    "safety equipment maintenance",
    "fire risk assessment"
  ]
};

// Page-specific keyword mappings
export const pageKeywords = {
  home: [
    "fire safety equipment Nepal",
    "emergency vehicles Nepal",
    "fire protection services Nepal",
    "best fire safety equipment company in Nepal",
    "fire safety company Bhaktpur"
  ],
  products: [
    "fire extinguisher Nepal",
    "portable fire pump Nepal",
    "firefighting equipment Nepal",
    "fire safety boots Nepal",
    "fire protection suit Nepal",
    "emergency vehicles Nepal"
  ],
  ambulance: [
    "ambulance services Nepal",
    "electric ambulance Nepal",
    "ambulance supplier Nepal",
    "hospital ambulance supplier Nepal",
    "emergency medical vehicles"
  ],
  generators: [
    "generator supplier Nepal",
    "emergency power systems",
    "backup generators Nepal",
    "industrial generators"
  ],
  electricBus: [
    "electric bus Nepal",
    "eco-friendly electric bus Nepal",
    "public transportation Nepal",
    "electric vehicle Nepal"
  ],
  contact: [
    "fire safety consultation Nepal",
    "fire safety consultation services Kathmandu",
    "emergency vehicle maintenance Nepal",
    "fire equipment installation Nepal"
  ],
  about: [
    "fire safety company Bhaktpur",
    "government fire equipment supplier",
    "fire safety training Nepal",
    "industrial fire safety Nepal"
  ]
};

// Generate structured data for different page types
export const generateStructuredData = (type: string, data: any = {}) => {
  const baseOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "National Fire Nepal",
    "description": "Leading fire safety equipment supplier and emergency vehicle manufacturer in Nepal",
    "url": "https://nationalfire.com.np",
    "logo": "https://nationalfire.com.np/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+977-1-4234567",
      "contactType": "customer service",
      "areaServed": "NP",
      "availableLanguage": ["en", "ne"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Suryabinayak-2, Bhaktapur",
      "addressLocality": "Bhaktapur", 
      "addressRegion": "Bagmati",
      "postalCode": "44800",
      "addressCountry": "NP"
    },
    "sameAs": [
      "https://www.facebook.com/nationalfire.nepal",
      "https://www.linkedin.com/company/national-fire-nepal"
    ]
  };

  switch (type) {
    case 'organization':
      return baseOrganization;
    
    case 'localBusiness':
      return {
        ...baseOrganization,
        "@type": "LocalBusiness",
        "priceRange": "$$",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "27.7172",
          "longitude": "85.3240"
        },
        "openingHours": ["Mo-Fr 09:00-17:00", "Sa 09:00-13:00"]
      };
    
    case 'product':
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": data.name || "Fire Safety Equipment",
        "description": data.description || "Professional fire safety equipment and emergency vehicles",
        "brand": {
          "@type": "Brand",
          "name": "National Fire Nepal"
        },
        "manufacturer": {
          "@type": "Organization",
          "name": "National Fire Nepal"
        },
        "category": "Fire Safety Equipment",
        "keywords": seoKeywords.primary.join(", ")
      };
    
    case 'service':
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": data.name || "Fire Safety Services",
        "description": data.description || "Comprehensive fire safety and emergency vehicle services",
        "provider": baseOrganization,
        "areaServed": {
          "@type": "Country",
          "name": "Nepal"
        },
        "serviceType": "Fire Safety Services"
      };
    
    default:
      return baseOrganization;
  }
};