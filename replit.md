# National Fire Emergency Vehicles Website

## Overview
This project is a full-stack web application for National Fire, a company specializing in emergency vehicles and equipment. It functions as both a public website for showcasing products, blogs, and company information, and an administrative dashboard for content management. The business vision is to provide a comprehensive online presence that highlights product offerings, shares industry insights, and facilitates customer engagement, ultimately enhancing National Fire's market reach and operational efficiency.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (August 2025)
- **Comprehensive SEO Optimization Implementation**: Complete overhaul of SEO strategy using targeted keywords for Nepal fire safety market
  - Added 40+ high-priority keywords including "fire safety equipment Nepal", "emergency vehicles Nepal", "fire protection services Nepal"
  - Implemented structured data markup (JSON-LD) for organization, products, and services
  - Enhanced HTML semantic structure with proper H1/H2/H3 hierarchy and keyword optimization
  - Added Open Graph and Twitter Card meta tags for social media optimization
  - Created dynamic SEO head component for page-specific optimization
  - Added comprehensive meta tags including geo-location data for Nepal market
  - Implemented sitemap.xml and robots.txt generation for better search engine crawling
  - Added SEO analysis tools and utilities for ongoing optimization monitoring

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter for client-side navigation.
- **Styling**: Tailwind CSS with shadcn/ui components, following a custom design system based on emergency service colors (fire-red, emergency-blue, warning-amber).
- **State Management**: TanStack Query for server state, React Context for authentication.
- **Build Tool**: Vite.
- **UI/UX Decisions**: Focus on a clean, responsive design with an intuitive user experience for both public browsing and administrative tasks. The design system emphasizes clarity and brand identity.

### Backend Architecture
- **Framework**: Express.js with TypeScript, running on Node.js 20.
- **Authentication**: Session-based using Express sessions and Passport.js, with bcrypt for password hashing. Admin-only access to management features.
- **API Design**: RESTful API endpoints with JSON responses.

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect.
- **Database**: Neon serverless PostgreSQL.
- **Schema Management**: Drizzle Kit for migrations.
- **Key Entities**: Users (admin), Products, Blogs, Gallery, Contact Info, Inquiries, About Stats, Analytics.

### Key Features
- **Authentication System**: Session-based, admin-only access, protected routes.
- **Content Management**: Full CRUD operations for all content types (Products, Blogs, Gallery, etc.), including image uploads, rich content editing, and real-time updates. This includes a comprehensive portfolio management system (social works, government projects), customer management for logos and links, and a robust sub-product system.
- **Public Features**: Responsive product catalog with search/filtering, blog system, interactive gallery, contact form, company information display, and SEO optimization.
- **Visual Page Building**: Integration of GrapesJS visual page builder for sub-product content, allowing drag-and-drop design with professional templates, custom blocks, and advanced styling. This provides full creative control over sub-product page layouts.
- **Mobile Responsiveness**: Mobile-first design principles applied throughout, with GrapesJS configured for device-specific breakpoints and responsive helper classes for automatic mobile optimization of content.
- **Layout Structure**: Fixed navbar for consistent navigation, naturally flowing footer, and horizontal scrolling support for wide content areas.

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives, shadcn/ui.
- **Forms**: React Hook Form with Zod validation.
- **Styling**: Tailwind CSS, PostCSS.
- **Icons**: Lucide React.
- **Utilities**: clsx, class-variance-authority, date-fns.

### Backend Dependencies
- **Database**: @neondatabase/serverless, Drizzle ORM.
- **Authentication**: Passport.js, express-session, connect-pg-simple.
- **Security**: bcrypt, helmet, DOMPurify (for XSS prevention).
- **Utilities**: nanoid.

### Development Dependencies
- **TypeScript**: Full stack type safety.
- **Build Tools**: Vite, esbuild.
- **Development**: tsx, Replit integration.