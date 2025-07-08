import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertProductSchema,
  insertSubProductSchema, 
  insertBlogSchema, 
  insertGallerySchema, 
  insertContactInfoSchema, 
  insertInquirySchema, 
  insertAboutStatsSchema,
  insertAnalyticsSchema,
  insertBrandSchema,
  User as AppUser
} from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";
import ConnectPgSimple from "connect-pg-simple";
import bcrypt from "bcrypt";
import { pool } from "./db";

// Add TypeScript declaration for req.user
declare global {
  namespace Express {
    // Define User interface using properties from our schema
    interface User {
      id: number;
      username: string;
      email: string;
      password: string;
      createdAt: Date | null;
      // Add any other properties your user has
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Configure session store - use PostgreSQL in production, memory in development
  let sessionStore;
  if (process.env.NODE_ENV === 'production') {
    const PgSession = ConnectPgSimple(session);
    sessionStore = new PgSession({
      pool: pool,
      tableName: 'user_sessions',
      createTableIfMissing: true
    });
  } else {
    const MemoryStoreSession = MemoryStore(session);
    sessionStore = new MemoryStoreSession({
      checkPeriod: 86400000 // 24 hours
    });
  }

  app.use(session({
    secret: process.env.SESSION_SECRET || 'national-fire-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
    }
  }));
  
  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      // Use bcrypt to compare passwords since we're storing hashed passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      console.error("Auth error:", err);
      return done(err);
    }
  }));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && req.user) {
      return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
  };
  
  // Analytics middleware
  const trackPageVisit = async (req: Request, res: Response, next: any) => {
    try {
      if (req.path.startsWith('/api') && req.method === 'GET') {
        await storage.logPageVisit({
          pageVisited: req.path,
          ipAddress: req.ip
        });
      }
      next();
    } catch (err) {
      next();
    }
  };
  
  app.use(trackPageVisit);
  
  // Authentication routes
  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error during login' });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Invalid credentials' });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Session error:', err);
          return res.status(500).json({ message: 'Session creation failed' });
        }
        
        res.json({ 
          message: 'Login successful', 
          user: { 
            id: user.id, 
            username: user.username, 
            email: user.email 
          } 
        });
      });
    })(req, res, next);
  });
  
  app.post('/api/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Logout successful' });
    });
  });
  
  app.get('/api/me', (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({ 
      user: { 
        id: req.user.id, 
        username: req.user.username, 
        email: req.user.email 
      } 
    });
  });
  
  // User routes
  app.put('/api/me', isAuthenticated, async (req, res) => {
    try {
      const updateSchema = insertUserSchema.partial().omit({ password: true });
      const validData = updateSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(req.user!.id, validData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ 
        message: 'Profile updated successfully', 
        user: { 
          id: updatedUser.id, 
          username: updatedUser.username, 
          email: updatedUser.email 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Change password route
  app.put('/api/me/password', isAuthenticated, async (req, res) => {
    try {
      const passwordSchema = z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
      });
      
      const { currentPassword, newPassword } = passwordSchema.parse(req.body);
      
      // Get current user with password
      const currentUser = await storage.getUserByUsername(req.user!.username);
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Hash new password and update
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await storage.updateUserPassword(req.user!.id, hashedNewPassword);
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/users/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (userId !== req.user!.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const updateSchema = insertUserSchema.partial();
      const validData = updateSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(userId, validData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ 
        message: 'User updated successfully', 
        user: { 
          id: updatedUser.id, 
          username: updatedUser.username, 
          email: updatedUser.email 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Products routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/products/:id', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ product });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/products', isAuthenticated, async (req, res) => {
    try {
      const validData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validData);
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.put('/api/products/:id', isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const updateSchema = insertProductSchema.partial();
      const validData = updateSchema.parse(req.body);
      
      const updatedProduct = await storage.updateProduct(productId, validData);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/products/:id', isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const updateSchema = insertProductSchema.partial();
      const validData = updateSchema.parse(req.body);
      
      const updatedProduct = await storage.updateProduct(productId, validData);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.delete('/api/products/:id', isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(productId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Sub-products routes
  app.get('/api/sub-products', async (req, res) => {
    try {
      const subProducts = await storage.getSubProducts();
      res.json({ subProducts });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/sub-products/by-ids', async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid IDs array' });
      }
      
      const subProducts = await storage.getSubProductsByIds(ids);
      res.json({ subProducts });
    } catch (error) {
      console.error('Error in /api/sub-products/by-ids:', error);
      res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
  
  app.get('/api/sub-products/:id', async (req, res) => {
    try {
      const subProductId = parseInt(req.params.id);
      const subProduct = await storage.getSubProduct(subProductId);
      
      if (!subProduct) {
        return res.status(404).json({ message: 'Sub-product not found' });
      }
      
      res.json({ subProduct });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });


  
  app.post('/api/sub-products', isAuthenticated, async (req, res) => {
    try {
      const validData = insertSubProductSchema.parse(req.body);
      const subProduct = await storage.createSubProduct(validData);
      res.status(201).json({ message: 'Sub-product created successfully', subProduct });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.put('/api/sub-products/:id', isAuthenticated, async (req, res) => {
    try {
      const subProductId = parseInt(req.params.id);
      const updateSchema = insertSubProductSchema.partial();
      const validData = updateSchema.parse(req.body);
      
      const updatedSubProduct = await storage.updateSubProduct(subProductId, validData);
      if (!updatedSubProduct) {
        return res.status(404).json({ message: 'Sub-product not found' });
      }
      
      res.json({ message: 'Sub-product updated successfully', subProduct: updatedSubProduct });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.delete('/api/sub-products/:id', isAuthenticated, async (req, res) => {
    try {
      const subProductId = parseInt(req.params.id);
      const deleted = await storage.deleteSubProduct(subProductId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Sub-product not found' });
      }
      
      res.json({ message: 'Sub-product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Blogs routes
  app.get('/api/blogs', async (req, res) => {
    try {
      const blogs = await storage.getBlogs();
      res.json({ blogs });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/blogs/:id', async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const blog = await storage.getBlog(blogId);
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      res.json({ blog });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/blogs', isAuthenticated, async (req, res) => {
    try {
      const validData = insertBlogSchema.parse(req.body);
      const blog = await storage.createBlog(validData);
      res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.put('/api/blogs/:id', isAuthenticated, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const updateSchema = insertBlogSchema.partial();
      const validData = updateSchema.parse(req.body);
      
      const updatedBlog = await storage.updateBlog(blogId, validData);
      if (!updatedBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      res.json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.delete('/api/blogs/:id', isAuthenticated, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const deleted = await storage.deleteBlog(blogId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Gallery routes
  app.get('/api/gallery', async (req, res) => {
    try {
      const galleryItems = await storage.getGalleryItems();
      res.json({ gallery: galleryItems });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/gallery', isAuthenticated, async (req, res) => {
    try {
      const validData = insertGallerySchema.parse(req.body);
      const galleryItem = await storage.createGalleryItem(validData);
      res.status(201).json({ message: 'Gallery item created successfully', galleryItem });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.patch('/api/gallery/:id', isAuthenticated, async (req, res) => {
    try {
      const galleryId = parseInt(req.params.id);
      const validData = insertGallerySchema.parse(req.body);
      const galleryItem = await storage.updateGalleryItem(galleryId, validData);
      
      if (!galleryItem) {
        return res.status(404).json({ message: 'Gallery item not found' });
      }
      
      res.json({ message: 'Gallery item updated successfully', galleryItem });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.delete('/api/gallery/:id', isAuthenticated, async (req, res) => {
    try {
      const galleryId = parseInt(req.params.id);
      const deleted = await storage.deleteGalleryItem(galleryId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Gallery item not found' });
      }
      
      res.json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Contact info routes
  app.get('/api/contact-info', async (req, res) => {
    try {
      const contactInfo = await storage.getContactInfo();
      
      if (!contactInfo) {
        return res.status(404).json({ message: 'Contact info not found' });
      }
      
      res.json({ contactInfo });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.put('/api/contact-info', isAuthenticated, async (req, res) => {
    try {
      const updateSchema = insertContactInfoSchema.partial();
      const validData = updateSchema.parse(req.body);
      
      const updatedContactInfo = await storage.updateContactInfo(validData);
      if (!updatedContactInfo) {
        return res.status(404).json({ message: 'Contact info not found' });
      }
      
      res.json({ message: 'Contact info updated successfully', contactInfo: updatedContactInfo });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Inquiries routes
  app.get('/api/inquiries', isAuthenticated, async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json({ inquiries });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/inquiries', async (req, res) => {
    try {
      const validData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validData);
      res.status(201).json({ message: 'Inquiry sent successfully', inquiry });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.put('/api/inquiries/:id/read', isAuthenticated, async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.id);
      const updatedInquiry = await storage.markInquiryAsRead(inquiryId);
      
      if (!updatedInquiry) {
        return res.status(404).json({ message: 'Inquiry not found' });
      }
      
      res.json({ message: 'Inquiry marked as read', inquiry: updatedInquiry });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.delete('/api/inquiries/:id', isAuthenticated, async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.id);
      const deleted = await storage.deleteInquiry(inquiryId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Inquiry not found' });
      }
      
      res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // About stats routes
  app.get('/api/about-stats', async (req, res) => {
    try {
      const aboutStats = await storage.getAboutStats();
      
      if (!aboutStats) {
        return res.status(404).json({ message: 'About stats not found' });
      }
      
      res.json({ aboutStats });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.put('/api/about-stats', isAuthenticated, async (req, res) => {
    try {
      const updateSchema = insertAboutStatsSchema.partial();
      const validData = updateSchema.parse(req.body);
      
      const updatedAboutStats = await storage.updateAboutStats(validData);
      if (!updatedAboutStats) {
        return res.status(404).json({ message: 'About stats not found' });
      }
      
      res.json({ message: 'About stats updated successfully', aboutStats: updatedAboutStats });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Analytics routes
  app.get('/api/analytics', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const pageVisits = await storage.getPageVisits(limit);
      
      // Group by page and count
      const pageVisitCounts = pageVisits.reduce((acc, visit) => {
        const page = visit.pageVisited;
        if (!acc[page]) {
          acc[page] = 0;
        }
        acc[page]++;
        return acc;
      }, {} as Record<string, number>);
      
      res.json({ 
        totalVisits: pageVisits.length,
        visitsPerPage: pageVisitCounts,
        recentVisits: pageVisits.slice(0, 10)
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Brand routes
  app.get('/api/brands', async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json({ brands });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/brands/:id', async (req, res) => {
    try {
      const brandId = parseInt(req.params.id);
      const brand = await storage.getBrand(brandId);
      if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      res.json({ brand });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/brands/:id/products', async (req, res) => {
    try {
      const brandId = parseInt(req.params.id);
      const products = await storage.getProductsByBrand(brandId);
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/brands', isAuthenticated, async (req, res) => {
    try {
      const validData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validData);
      res.status(201).json({ message: 'Brand created successfully', brand });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/brands/:id', isAuthenticated, async (req, res) => {
    try {
      const brandId = parseInt(req.params.id);
      const validData = insertBrandSchema.partial().parse(req.body);
      
      const updatedBrand = await storage.updateBrand(brandId, validData);
      if (!updatedBrand) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      
      res.json({ message: 'Brand updated successfully', brand: updatedBrand });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/brands/:id', isAuthenticated, async (req, res) => {
    try {
      const brandId = parseInt(req.params.id);
      const validData = insertBrandSchema.partial().parse(req.body);
      
      const updatedBrand = await storage.updateBrand(brandId, validData);
      if (!updatedBrand) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      
      res.json({ message: 'Brand updated successfully', brand: updatedBrand });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/brands/:id', isAuthenticated, async (req, res) => {
    try {
      const brandId = parseInt(req.params.id);
      const success = await storage.deleteBrand(brandId);
      if (!success) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Portfolio routes
  app.get('/api/portfolio', async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItems();
      res.json({ portfolioItems });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/portfolio/category/:category', async (req, res) => {
    try {
      const category = req.params.category;
      const portfolioItems = await storage.getPortfolioItemsByCategory(category);
      res.json({ portfolioItems });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/portfolio/:id', async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolioItem = await storage.getPortfolioItem(portfolioId);
      if (!portfolioItem) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      res.json({ portfolioItem });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/portfolio', isAuthenticated, async (req, res) => {
    try {
      const { insertPortfolioSchema } = await import("@shared/schema");
      const validData = insertPortfolioSchema.parse(req.body);
      const portfolioItem = await storage.createPortfolioItem(validData);
      res.status(201).json({ message: 'Portfolio item created successfully', portfolioItem });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/portfolio/:id', isAuthenticated, async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const { insertPortfolioSchema } = await import("@shared/schema");
      const validData = insertPortfolioSchema.parse(req.body);
      
      const updatedPortfolioItem = await storage.updatePortfolioItem(portfolioId, validData);
      if (!updatedPortfolioItem) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      
      res.json({ message: 'Portfolio item updated successfully', portfolioItem: updatedPortfolioItem });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/portfolio/:id', isAuthenticated, async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const success = await storage.deletePortfolioItem(portfolioId);
      if (!success) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      res.json({ message: 'Portfolio item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Customers routes
  app.get('/api/customers', async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json({ customers });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/customers/active', async (req, res) => {
    try {
      const customers = await storage.getActiveCustomers();
      res.json({ customers });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/customers/:id', async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await storage.getCustomer(customerId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json({ customer });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/customers', isAuthenticated, async (req, res) => {
    try {
      const { insertCustomerSchema } = await import("@shared/schema");
      const validData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validData);
      res.status(201).json({ message: 'Customer created successfully', customer });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/customers/:id', isAuthenticated, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const { insertCustomerSchema } = await import("@shared/schema");
      const validData = insertCustomerSchema.parse(req.body);
      
      const updatedCustomer = await storage.updateCustomer(customerId, validData);
      if (!updatedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      res.json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/customers/:id', isAuthenticated, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const success = await storage.deleteCustomer(customerId);
      if (!success) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  return httpServer;
}
