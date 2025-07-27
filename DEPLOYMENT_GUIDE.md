# National Fire Website - Deployment Guide

## Project Overview
This is a complete full-stack web application for National Fire emergency vehicles company featuring:

- **Frontend**: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript + PostgreSQL + Drizzle ORM
- **Features**: Admin panel, visual page builder, AI chatbot, authentication, CRUD operations
- **Security**: Rate limiting, input validation, password requirements, CSP headers

## Manual GitHub Push Instructions

Since git operations are restricted in this environment, you'll need to manually push the code to your GitHub repository. Here's how:

### Option 1: Download and Push Locally

1. **Download the entire project**:
   - In Replit, go to the three dots menu (⋮) in the file explorer
   - Select "Download as zip"
   - Extract the zip file on your local machine

2. **Set up local git repository**:
   ```bash
   cd nationalfire
   git init
   git remote add origin https://github.com/pradipoza/nationalfire.git
   git add .
   git commit -m "Complete National Fire website with admin panel, visual page builder, and AI chatbot

   - Full-stack web application for National Fire emergency vehicles company
   - Admin panel with complete CRUD operations for products, blogs, gallery, brands, portfolio, customers
   - GrapesJS visual page builder integration for sub-product content creation
   - Botpress AI chatbot with smart visibility control (hidden in admin areas)
   - Comprehensive security with rate limiting, input validation, and password requirements
   - PostgreSQL database with Drizzle ORM and proper migrations
   - Responsive design with Tailwind CSS and shadcn/ui components
   - Authentication system with session management and protected routes
   - Image upload and management system
   - Analytics tracking and inquiry management
   - SEO-optimized structure with proper meta tags and routing"
   
   git push -u origin main
   ```

### Option 2: Connect Replit to GitHub

1. **In Replit**:
   - Go to the "Version Control" tab (git icon in left sidebar)
   - Click "Connect to GitHub"
   - Authorize Replit to access your GitHub account
   - Select the repository: https://github.com/pradipoza/nationalfire
   - Push your changes

### Option 3: Use GitHub CLI

If you have GitHub CLI installed locally:
```bash
gh repo clone pradipoza/nationalfire
# Copy all files from the downloaded project
git add .
git commit -m "Initial commit - National Fire website"
git push origin main
```

## Environment Variables Needed for Deployment

When deploying, make sure to set these environment variables:

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Random secret for session encryption (use a long random string)

### Optional
- `NODE_ENV`: Set to "production" for production deployments
- `PORT`: Server port (defaults to 5000)

## Database Setup

The application uses PostgreSQL with Drizzle ORM. When deploying:

1. **Create a PostgreSQL database** (you can use Neon, Railway, Supabase, etc.)
2. **Set the DATABASE_URL** environment variable
3. **Run database migrations**:
   ```bash
   npm run db:push
   ```

## Deployment Platforms

This application can be deployed on:

### Recommended: Vercel + Neon PostgreSQL
1. Connect your GitHub repository to Vercel
2. Set up Neon PostgreSQL database
3. Add environment variables in Vercel dashboard
4. Deploy

### Alternative: Railway
1. Connect GitHub repository to Railway
2. Railway can provide both app hosting and PostgreSQL
3. Set environment variables
4. Deploy

### Alternative: Render
1. Connect GitHub repository to Render
2. Add PostgreSQL add-on or external database
3. Set environment variables
4. Deploy

## Build Commands

- **Install**: `npm install`
- **Build**: `npm run build`
- **Start**: `npm start`
- **Development**: `npm run dev`

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── package.json     # Dependencies and scripts
├── vite.config.ts   # Vite configuration
├── tailwind.config.ts
├── tsconfig.json
└── drizzle.config.ts
```

## Features Implemented

✅ **Authentication System**
- Login/logout with session management
- Password hashing with bcrypt
- Protected routes

✅ **Admin Panel**
- Products management with sub-products
- Blog management with rich text editor
- Gallery management
- Brands management
- Portfolio management (social works & government projects)
- Customer management
- Inquiry management
- Analytics dashboard

✅ **Visual Page Builder**
- GrapesJS integration for sub-product pages
- Drag-and-drop interface
- Template system
- Custom styling

✅ **AI Chatbot**
- Botpress integration
- Smart visibility (hidden in admin areas)
- Customer support automation

✅ **Security Features**
- Rate limiting
- Input validation
- Content Security Policy (CSP)
- Password requirements
- Session security

✅ **Public Website**
- Responsive design
- Product catalog
- Blog system
- Gallery
- Contact forms
- Company information

## Support

If you need help with deployment or have questions, the application is fully documented in the `replit.md` file with detailed architecture information and change logs.

The code is production-ready and includes comprehensive error handling, security measures, and performance optimizations.