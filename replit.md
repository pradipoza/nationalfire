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
  - Updated About Us content across the website to reflect National Fire Safe Pvt. Ltd.'s focus on Nepal
  - Redesigned About Us page with new company description, mission statement, and values sections
  - Enhanced styling with gradient backgrounds, color-coded value cards, and improved typography
  - Updated AboutPreview component on Home page with new content and styling
  - Content now accurately reflects company's establishment in 2009 and focus on Nepal market
  - Added comprehensive product offerings: firefighting equipment, electric ambulances, and electric buses
  - Integrated four custom images into About Us page and Home page AboutPreview in stylish card format
  - Enhanced image display with hover effects, overlays, and descriptive captions
  - Images showcase: fire extinguisher in action, fire truck emergency response, electric buses, and electric ambulances
  - Added professional styling with hover animations and gradient overlays for better visual presentation
- July 2, 2025. Major product system restructuring to support sub-products
  - Created sub-products database schema with name, description, content, and photo fields
  - Updated products schema to remove content field and add subProductIds array
  - Added comprehensive sub-products API endpoints with full CRUD operations
  - Created admin sub-products management interface for adding/editing sub-products
  - Updated product creation flow to associate products with sub-products instead of content
  - Product detail pages now display sub-products instead of text content
  - Sub-product detail pages show individual sub-product information
  - This allows products like "Fire Trucks" to contain multiple sub-product types
- July 8, 2025. Major simplification of sub-product system to basic management only
  - Simplified sub-product database schema to only include: name, modelNumber (optional), photo, id, createdAt
  - Removed complex content management fields: description, contentType, externalUrl, specifications, features
  - Reverted to numeric ID-based routing (/sub-products/:id) for reliability and simplicity
  - Created simplified sub-product detail page with blank content area ready for manual hardcoding
  - Sub-product detail pages now show just name, model number, and image with placeholder content section
  - Simplified admin interface to only manage name, model number (optional), and image upload
  - Removed external link functionality and complex content type management
  - Sub-product system now optimized for basic catalog management with manual content development
  - Admin interface supports simple three-field management: name (required), model number (optional), image (required)
- July 21, 2025. Comprehensive Rich Text Editor Enhancement for Professional Product Pages
  - Complete rebuild of RichTextEditor with advanced capabilities matching professional fire safety websites
  - Added comprehensive text formatting: Bold, Italic, Underline, Strikethrough with visual feedback
  - Implemented font controls: Font family dropdown (10+ fonts), Font size selector (8px-72px)
  - Added advanced color controls: Text color picker and highlight picker with 64+ professional colors
  - Enhanced table operations: Insert tables, Add/delete rows/columns, Merge/split cells, Delete tables, Resizable columns
  - Added heading controls: H1-H6 headings with proper styling and hierarchy
  - Implemented task lists: Interactive checkboxes for task management and feature lists
  - Added horizontal rules: Professional dividers for content separation
  - Created professional layout templates: Product headers, Feature grids, Specification tables, Two-column layouts, Certification badges
  - Enhanced editor with proper styling support for fire safety theme colors and responsive layouts
  - Editor now supports creating sophisticated product showcase pages comparable to professional websites (shibaura-bousai.co.jp, anaf.eu)
  - Four-row toolbar interface with organized tool grouping and color-coded template buttons
  - Added comprehensive CSS styling for proper rendering of advanced layouts and professional typography
- July 25, 2025. Visual Page Builder Integration for Sub-Products
  - Integrated GrapesJS visual page builder directly into sub-product management system
  - Replaced standalone page builder with sub-product content editor integration
  - Added pageData, htmlContent, and cssContent fields to sub_products database schema
  - Created "Design Page" button in sub-product cards for visual content editing
  - Sub-products now support full visual page design with drag-and-drop interface
  - Visual editor includes professional templates, custom blocks, and advanced styling
  - Seamless integration between basic sub-product info editing and visual content creation
  - Removed separate page builder from admin navigation in favor of sub-product integration
  - Converted sub-product detail pages to be completely controlled by visual page builder
  - Removed all default layout elements (headers, navigation, product info cards, images)
  - Sub-product pages now display only content created in the visual editor or blank page if no design exists
  - Full creative control over entire page layout and content through visual page builder
  - Added back navigation button for user-friendly navigation to parent product
  - Comprehensive security audit and vulnerability fixes:
    * Enhanced password requirements (8+ chars, uppercase, lowercase, numbers)
    * Added rate limiting (1000 requests/15min, 5 login attempts/15min)
    * Implemented helmet security headers with CSP
    * Enhanced input validation for all integer parameters
    * Added content size limits to prevent DoS attacks
    * Improved error handling without information leakage
    * Added request size validation and parameter limits
    * Increased bcrypt rounds from 10 to 12 for stronger password hashing
    * Added comprehensive validation for all user inputs
    * Fixed trust proxy configuration for production deployment
- July 27, 2025. Integrated Botpress AI Chatbot Widget and Fixed Sub-Product Creation
  - Added Botpress webchat widget v3.2 to provide AI customer support
  - Integrated custom chatbot configuration for National Fire emergency vehicles
  - Chatbot widget appears on public pages only (excluded from admin panel areas and login page)
  - Enhanced user experience with AI-powered support for product inquiries and general questions
  - Fixed sub-product creation duplicate name validation with proper client-side checking
  - Added comprehensive form validation for sub-product creation with better error handling
  - Improved delete button visibility with red destructive variant styling
  - Enhanced chatbot exclusion with multiple methods: JavaScript detection, CSS rules, and body attributes
  - Added aggressive route monitoring to hide chatbot in restricted areas
  - Created comprehensive deployment guide for GitHub repository setup and production deployment
- July 27, 2025. Professional QA Security and Performance Enhancements
  - Applied comprehensive QA engineer recommendations for production-grade quality
  - Enhanced server security with compression, morgan logging, and improved trust proxy configuration
  - Added DOMPurify HTML sanitization for all user-generated content to prevent XSS attacks
  - Standardized all API error responses to consistent { error: string } format for better error handling
  - Enhanced rate limiting specifically for login attempts (5 attempts per 15 minutes)
  - Improved session security with custom cookie names and proper security flags
  - Added comprehensive .gitignore patterns for security-sensitive files
  - Enhanced password validation with stronger requirements (8+ chars, mixed case, numbers)
  - Increased bcrypt rounds to 12 for stronger password hashing
  - Added proper 404 handlers for API endpoints and global error handlers
  - Implemented request size limits and parameter validation to prevent DoS attacks
  - Added comprehensive input validation and sanitization across all API endpoints
  - All QA recommendations implemented for small-scale production deployment (under 100 visits/day)
  - Fixed sub-product selection counting bug in product management interface
  - Implemented proper conditional loading for Botpress AI chatbot widget
  - Chatbot now loads only on public pages (excluded from /admin and /login routes)
  - Enhanced performance by preventing unnecessary script loading on restricted pages
  - Fixed sub-product selection bug showing incorrect count when no items selected
  - Implemented proper chatbot conditional loading - now only loads on public pages (excludes /admin and /login)
  - Replaced complex hiding logic with clean conditional injection for better performance

## User Preferences

Preferred communication style: Simple, everyday language.