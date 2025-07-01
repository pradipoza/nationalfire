# National Fire Emergency Vehicles Website

## Overview

This is a full-stack web application for National Fire, a company specializing in emergency vehicles and equipment. The application serves as both a public website showcasing products, blogs, and company information, and an admin dashboard for content management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React Context for authentication
- **Build Tool**: Vite for development and production builds
- **Design System**: Custom design system based on emergency service color palette (fire-red, emergency-blue, warning-amber)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Session Management**: Express sessions with Passport.js for authentication
- **Password Security**: bcrypt for password hashing
- **API Design**: RESTful API endpoints with JSON responses

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon serverless PostgreSQL
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling via @neondatabase/serverless

## Key Components

### Database Schema
The application uses the following main entities:
- **Users**: Admin authentication (username, email, password)
- **Products**: Emergency vehicles and equipment catalog
- **Blogs**: Industry insights and company news
- **Gallery**: Photo gallery of projects and vehicles
- **Contact Info**: Company contact details and business information
- **Inquiries**: Customer contact form submissions
- **About Stats**: Company statistics (years experience, customers served, etc.)
- **Analytics**: Page visit tracking

### Authentication System
- Session-based authentication using Passport.js Local Strategy
- Admin-only access to management features
- Protected routes with authentication middleware
- Automatic redirect handling for unauthorized access

### Content Management
- Full CRUD operations for all content types
- Image upload and management system
- Rich content editing capabilities
- Real-time content updates

### Public Features
- Responsive product catalog with search and filtering
- Blog system with full article display
- Interactive gallery with modal viewing
- Contact form with inquiry management
- Company information and statistics display
- SEO-optimized structure

## Data Flow

1. **Public Requests**: Users browse products, blogs, gallery → Frontend fetches data via TanStack Query → Express API returns JSON → PostgreSQL via Drizzle ORM
2. **Admin Requests**: Admin authenticates → Session stored → Protected routes accessible → CRUD operations → Database updates → Real-time UI updates
3. **Image Handling**: Base64 image uploads → Validation → Storage in database JSON fields → Display optimization

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives with shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React
- **Utilities**: clsx, class-variance-authority, date-fns

### Backend Dependencies
- **Database**: @neondatabase/serverless, Drizzle ORM
- **Authentication**: Passport.js, express-session, connect-pg-simple
- **Security**: bcrypt for password hashing
- **Utilities**: nanoid for ID generation

### Development Dependencies
- **TypeScript**: Full type safety across the stack
- **Build Tools**: Vite, esbuild for production builds
- **Development**: tsx for TypeScript execution, Replit integration

## Deployment Strategy

### Environment Configuration
- **Development**: Runs on port 5000 with hot reload via Vite
- **Production**: Express serves built static files from dist/public
- **Database**: Requires DATABASE_URL environment variable for Neon connection

### Build Process
1. Frontend: Vite builds React app to dist/public
2. Backend: esbuild bundles Express server to dist/index.js
3. Assets: Static files served from built directory

### Replit Integration
- Configured for Replit environment with automatic deployments
- PostgreSQL module included for database provisioning
- Runtime error overlay for development debugging
- Cartographer integration for enhanced development experience

## Changelog

Changelog:
- June 16, 2025. Initial setup
- June 20, 2025. Fixed admin panel CRUD operations and added password change functionality
  - Fixed mutation patterns (changed mutateAsync to mutate) for reliable form submissions
  - Added password change API endpoint with bcrypt validation
  - Resolved nested anchor tag warnings in navigation components
  - All admin features now working: products, blogs, gallery, contact management, and settings
  - Fixed password change double-hashing issue with dedicated updateUserPassword method
  - Password change feature now fully operational and reliable
- June 24, 2025. Added brands functionality and enhanced security
  - Fixed Google Maps API key security vulnerability by removing hardcoded fallback
  - Updated session configuration for better production deployment compatibility
  - Added comprehensive brands system with database schema and relationships
  - Created brands page with grid layout showing brand logos and descriptions
  - Implemented brand detail pages displaying products filtered by brand
  - Added 6 sample fire equipment brands with proper logos and descriptions
  - Built complete CRUD API endpoints for brands management
  - Added product search functionality with real-time filtering by name
  - Enhanced navigation with brands link positioned between Gallery and About Us
  - Built complete admin brands management system with CRUD operations
  - Added product selection interface for associating products with brands
  - Created brand management page in admin panel with table view and dialogs
  - Fixed fetch API parameter ordering issues in brand CRUD operations
  - Resolved authentication problems and double sidebar display issues
  - All brands management functionality now fully operational
- June 25, 2025. Enhanced security and user experience improvements
  - Removed default login credentials from admin login page for better security
  - Fixed product inquiry form to display product names instead of IDs
  - Updated contact form to fetch and display actual product names in auto-filled messages
  - Improved brand deletion functionality by properly handling foreign key constraints
  - Enhanced product-brand association workflow with better error handling
- June 29, 2025. Added comprehensive portfolio management system
  - Created portfolio database schema with social works and government projects categories
  - Built complete portfolio API endpoints with CRUD operations
  - Implemented portfolio listing page with two distinct sections
  - Created detailed portfolio item view with project information
  - Added admin portfolio management with image upload and categorization
  - Integrated portfolio navigation links in main navbar and admin sidebar
  - Portfolio system supports social work and government project categorization
  - Fixed portfolio detail page routing to properly display individual project details
  - Portfolio creation, editing, deletion, and viewing functionality now fully operational
  - Added comprehensive customer management system with database schema and API endpoints
  - Created customer admin interface for uploading logos and managing website links
  - Integrated customer logo sections into both About Us and Home pages
  - Customer logos display with grayscale effect and redirect to customer websites on click
  - Customer sections appear above statistics counters on About Us page and within AboutPreview on Home page
  - Updated company name from "NATIONAL FIRE PVT LTD" to "National Fire Safe Pvt Ltd" in navbar and footer
  - Enhanced footer Quick Links to include all navbar pages (added Brands and Portfolio)
  - Converted footer's Our Products section to dynamically display all products from database
  - Footer now shows up to 6 products with "View All Products" link if more exist
  - Product listings automatically update when new products are added through admin panel

## User Preferences

Preferred communication style: Simple, everyday language.