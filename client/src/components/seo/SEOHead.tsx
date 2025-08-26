import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: any;
  noindex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "National Fire - Fire Safety Equipment & Emergency Vehicles Nepal | Best Fire Protection Services",
  description = "Leading fire safety equipment supplier in Nepal. We provide fire extinguishers, emergency vehicles, ambulances, fire trucks, and complete fire protection services in Kathmandu, Bhaktpur and across Nepal.",
  keywords = [
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
    "firefighting boat Nepal"
  ],
  canonicalUrl,
  ogImage = "/api/og-image",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
  noindex = false
}) => {

  React.useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords.join(', '));

    // Add Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: canonicalUrl || window.location.href },
      { property: 'og:site_name', content: 'National Fire Nepal' },
      { property: 'og:locale', content: 'en_US' }
    ];

    ogTags.forEach(tag => {
      let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', tag.property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', tag.content);
    });

    // Add Twitter Card meta tags
    const twitterTags = [
      { name: 'twitter:card', content: twitterCard },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage }
    ];

    twitterTags.forEach(tag => {
      let twitterTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', tag.name);
        document.head.appendChild(twitterTag);
      }
      twitterTag.setAttribute('content', tag.content);
    });

    // Add canonical URL
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // Add robots meta tag
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // Add structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Add additional SEO meta tags
    const additionalTags = [
      { name: 'author', content: 'National Fire Nepal' },
      { name: 'copyright', content: 'National Fire Nepal' },
      { name: 'language', content: 'English' },
      { name: 'geo.region', content: 'NP' },
      { name: 'geo.placename', content: 'Nepal' },
      { name: 'geo.position', content: '27.7172;85.3240' },
      { name: 'ICBM', content: '27.7172, 85.3240' }
    ];

    additionalTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });

  }, [title, description, keywords, canonicalUrl, ogImage, ogType, twitterCard, structuredData, noindex]);

  return null;
};

export default SEOHead;