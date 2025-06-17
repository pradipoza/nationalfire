export const config = {
  siteName: "National Fire",
  siteDescription: "Emergency Vehicles & Equipment Specialists",
  contactEmail: "info@nationalfire.com",
  contactPhone: "+1 (555) 123-4567",
  contactAddress: "123 Emergency Avenue, Industrial Zone, Phoenix, AZ 85001, USA",
  contactLocation: {
    lat: 33.4484,
    lng: -112.0740,
  },
  social: {
    facebook: "https://facebook.com/nationalfire",
    twitter: "https://twitter.com/nationalfire",
    instagram: "https://instagram.com/nationalfire",
    whatsapp: "https://wa.me/15551234567",
    linkedin: "https://linkedin.com/company/nationalfire",
  },
  businessHours: {
    weekdays: "8:00 AM - 6:00 PM",
    saturday: "9:00 AM - 1:00 PM",
    sunday: "Closed",
  },
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/login",
  LOGOUT: "/api/logout",
  CURRENT_USER: "/api/me",

  // Products
  PRODUCTS: "/api/products",
  PRODUCT: (id: number | string) => `/api/products/${id}`,

  // Blogs
  BLOGS: "/api/blogs",
  BLOG: (id: number | string) => `/api/blogs/${id}`,

  // Gallery
  GALLERY: "/api/gallery",
  GALLERY_ITEM: (id: number | string) => `/api/gallery/${id}`,

  // Contact
  CONTACT_INFO: "/api/contact-info",
  INQUIRIES: "/api/inquiries",
  INQUIRY: (id: number | string) => `/api/inquiries/${id}`,
  MARK_INQUIRY_READ: (id: number | string) => `/api/inquiries/${id}/read`,

  // About
  ABOUT_STATS: "/api/about-stats",

  // Analytics
  ANALYTICS: "/api/analytics",
};
