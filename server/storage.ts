import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  blogs, type Blog, type InsertBlog,
  gallery, type Gallery, type InsertGallery,
  contactInfo, type ContactInfo, type InsertContactInfo,
  inquiries, type Inquiry, type InsertInquiry,
  aboutStats, type AboutStats, type InsertAboutStats,
  analytics, type Analytics, type InsertAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Blogs
  getBlogs(): Promise<Blog[]>;
  getBlog(id: number): Promise<Blog | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | undefined>;
  deleteBlog(id: number): Promise<boolean>;
  
  // Gallery
  getGalleryItems(): Promise<Gallery[]>;
  getGalleryItem(id: number): Promise<Gallery | undefined>;
  createGalleryItem(galleryItem: InsertGallery): Promise<Gallery>;
  updateGalleryItem(id: number, updates: Partial<InsertGallery>): Promise<Gallery | undefined>;
  deleteGalleryItem(id: number): Promise<boolean>;
  
  // Contact Info
  getContactInfo(): Promise<ContactInfo | undefined>;
  updateContactInfo(updates: Partial<InsertContactInfo>): Promise<ContactInfo | undefined>;
  
  // Inquiries
  getInquiries(): Promise<Inquiry[]>;
  getInquiry(id: number): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  markInquiryAsRead(id: number): Promise<Inquiry | undefined>;
  deleteInquiry(id: number): Promise<boolean>;
  
  // About Stats
  getAboutStats(): Promise<AboutStats | undefined>;
  updateAboutStats(updates: Partial<InsertAboutStats>): Promise<AboutStats | undefined>;
  
  // Analytics
  logPageVisit(pageVisit: InsertAnalytics): Promise<Analytics>;
  getPageVisits(limit?: number): Promise<Analytics[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        username: insertUser.username,
        password: hashedPassword,
        email: insertUser.email
      })
      .returning();
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    // Only update values that are provided
    const updateValues: any = {};
    
    if (updates.username) updateValues.username = updates.username;
    if (updates.email) updateValues.email = updates.email;
    
    // If updating password, hash it
    if (updates.password) {
      updateValues.password = await bcrypt.hash(updates.password, 10);
    }
    
    const [updatedUser] = await db
      .update(users)
      .set(updateValues)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values({
        name: product.name,
        description: product.description,
        photos: product.photos || []
      })
      .returning();
    return newProduct;
  }
  
  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    // Only update values that are provided
    const updateValues: any = { updatedAt: new Date() };
    
    if (updates.name) updateValues.name = updates.name;
    if (updates.description) updateValues.description = updates.description;
    if (updates.photos) updateValues.photos = updates.photos;
    
    const [updatedProduct] = await db
      .update(products)
      .set(updateValues)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return !!deleted;
  }
  
  // Blogs
  async getBlogs(): Promise<Blog[]> {
    return db.select().from(blogs);
  }
  
  async getBlog(id: number): Promise<Blog | undefined> {
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    return blog;
  }
  
  async createBlog(blog: InsertBlog): Promise<Blog> {
    const [newBlog] = await db
      .insert(blogs)
      .values({
        title: blog.title,
        content: blog.content,
        photos: blog.photos || []
      })
      .returning();
    return newBlog;
  }
  
  async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | undefined> {
    // Only update values that are provided
    const updateValues: any = { updatedAt: new Date() };
    
    if (updates.title) updateValues.title = updates.title;
    if (updates.content) updateValues.content = updates.content;
    if (updates.photos) updateValues.photos = updates.photos;
    
    const [updatedBlog] = await db
      .update(blogs)
      .set(updateValues)
      .where(eq(blogs.id, id))
      .returning();
    return updatedBlog;
  }
  
  async deleteBlog(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(blogs)
      .where(eq(blogs.id, id))
      .returning({ id: blogs.id });
    return !!deleted;
  }
  
  // Gallery
  async getGalleryItems(): Promise<Gallery[]> {
    return db.select().from(gallery);
  }
  
  async getGalleryItem(id: number): Promise<Gallery | undefined> {
    const [item] = await db.select().from(gallery).where(eq(gallery.id, id));
    return item;
  }
  
  async createGalleryItem(galleryItem: InsertGallery): Promise<Gallery> {
    const [newItem] = await db
      .insert(gallery)
      .values({
        photo: galleryItem.photo,
        description: galleryItem.description
      })
      .returning();
    return newItem;
  }
  
  async updateGalleryItem(id: number, updates: Partial<InsertGallery>): Promise<Gallery | undefined> {
    const [updated] = await db
      .update(gallery)
      .set(updates)
      .where(eq(gallery.id, id))
      .returning();
    return updated || undefined;
  }
  
  async deleteGalleryItem(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(gallery)
      .where(eq(gallery.id, id))
      .returning({ id: gallery.id });
    return !!deleted;
  }
  
  // Contact Info
  async getContactInfo(): Promise<ContactInfo | undefined> {
    const [info] = await db.select().from(contactInfo);
    return info;
  }
  
  async updateContactInfo(updates: Partial<InsertContactInfo>): Promise<ContactInfo | undefined> {
    const existingInfo = await this.getContactInfo();
    
    if (!existingInfo) {
      // Create if doesn't exist
      const [newInfo] = await db
        .insert(contactInfo)
        .values({
          address: updates.address || "123 Emergency Avenue, Phoenix, AZ",
          phone: updates.phone || "+1 (555) 123-4567",
          email: updates.email || "info@nationalfire.com",
          facebook: updates.facebook,
          instagram: updates.instagram,
          whatsapp: updates.whatsapp,
          linkedin: updates.linkedin
        })
        .returning();
      return newInfo;
    }
    
    // Only update values that are provided
    const updateValues: any = { updatedAt: new Date() };
    
    if (updates.address) updateValues.address = updates.address;
    if (updates.phone) updateValues.phone = updates.phone;
    if (updates.email) updateValues.email = updates.email;
    if (updates.facebook !== undefined) updateValues.facebook = updates.facebook;
    if (updates.instagram !== undefined) updateValues.instagram = updates.instagram;
    if (updates.whatsapp !== undefined) updateValues.whatsapp = updates.whatsapp;
    if (updates.linkedin !== undefined) updateValues.linkedin = updates.linkedin;
    
    const [updatedInfo] = await db
      .update(contactInfo)
      .set(updateValues)
      .where(eq(contactInfo.id, existingInfo.id))
      .returning();
    return updatedInfo;
  }
  
  // Inquiries
  async getInquiries(): Promise<Inquiry[]> {
    return db.select().from(inquiries);
  }
  
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry;
  }
  
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db
      .insert(inquiries)
      .values({
        name: inquiry.name,
        email: inquiry.email,
        message: inquiry.message,
        productId: inquiry.productId || null
      })
      .returning();
    return newInquiry;
  }
  
  async markInquiryAsRead(id: number): Promise<Inquiry | undefined> {
    const [updatedInquiry] = await db
      .update(inquiries)
      .set({ read: true })
      .where(eq(inquiries.id, id))
      .returning();
    return updatedInquiry;
  }
  
  async deleteInquiry(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(inquiries)
      .where(eq(inquiries.id, id))
      .returning({ id: inquiries.id });
    return !!deleted;
  }
  
  // About Stats
  async getAboutStats(): Promise<AboutStats | undefined> {
    const [stats] = await db.select().from(aboutStats);
    return stats;
  }
  
  async updateAboutStats(updates: Partial<InsertAboutStats>): Promise<AboutStats | undefined> {
    const existingStats = await this.getAboutStats();
    
    if (!existingStats) {
      // Create if doesn't exist
      const [newStats] = await db
        .insert(aboutStats)
        .values({
          yearsExperience: updates.yearsExperience || 35,
          customersServed: updates.customersServed || 500,
          productsSupplied: updates.productsSupplied || 1200,
          customersTestimonials: updates.customersTestimonials || []
        })
        .returning();
      return newStats;
    }
    
    // Only update values that are provided
    const updateValues: any = { updatedAt: new Date() };
    
    if (updates.yearsExperience !== undefined) updateValues.yearsExperience = updates.yearsExperience;
    if (updates.customersServed !== undefined) updateValues.customersServed = updates.customersServed;
    if (updates.productsSupplied !== undefined) updateValues.productsSupplied = updates.productsSupplied;
    if (updates.customersTestimonials) updateValues.customersTestimonials = updates.customersTestimonials;
    
    const [updatedStats] = await db
      .update(aboutStats)
      .set(updateValues)
      .where(eq(aboutStats.id, existingStats.id))
      .returning();
    return updatedStats;
  }
  
  // Analytics
  async logPageVisit(pageVisit: InsertAnalytics): Promise<Analytics> {
    const [visit] = await db
      .insert(analytics)
      .values({
        pageVisited: pageVisit.pageVisited,
        ipAddress: pageVisit.ipAddress || null
      })
      .returning();
    return visit;
  }
  
  async getPageVisits(limit?: number): Promise<Analytics[]> {
    if (limit) {
      return db
        .select()
        .from(analytics)
        .orderBy(desc(analytics.timestamp))
        .limit(limit);
    }
    
    return db
      .select()
      .from(analytics)
      .orderBy(desc(analytics.timestamp));
  }
}

// Initialize seed data if needed
async function initializeSeedData() {
  try {
    // Check if there are any users already in the database
    const userResults = await db.select().from(users);
    
    if (userResults.length === 0) {
      console.log("Initializing seed data...");
      const storage = new DatabaseStorage();
      
      // Create admin user
      await storage.createUser({
        username: "admin",
        password: "admin123",
        email: "admin@nationalfire.com"
      });
      
      // Create initial products
      await storage.createProduct({
        name: "Premium Fire Truck",
        description: "High-capacity fire truck with advanced water delivery systems and rescue equipment.",
        photos: ["https://images.unsplash.com/photo-1516550893885-985da0253db1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"]
      });
      
      await storage.createProduct({
        name: "Advanced Ambulance",
        description: "State-of-the-art ambulance with complete medical equipment and efficient response capabilities.",
        photos: ["https://images.unsplash.com/photo-1587843618590-26adcc8dfc1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"]
      });
      
      await storage.createProduct({
        name: "Electric Transport Bus",
        description: "Eco-friendly electric bus designed for efficient urban transportation with zero emissions.",
        photos: ["https://images.unsplash.com/photo-1619252584172-a83a949b6efd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"]
      });
      
      // Create initial blogs
      await storage.createBlog({
        title: "Fire Safety Innovations for 2023",
        content: "Discover the latest technological advancements in fire safety equipment that are transforming emergency response capabilities...",
        photos: [
          { url: "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", position: "top" }
        ]
      });
      
      await storage.createBlog({
        title: "The Future of Electric Emergency Vehicles",
        content: "As cities worldwide embrace sustainability, electric emergency vehicles are becoming increasingly viable. Learn about the benefits and challenges...",
        photos: [
          { url: "https://images.unsplash.com/photo-1590332763583-aede28e83de6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", position: "top" }
        ]
      });
      
      // Create initial gallery items
      await storage.createGalleryItem({
        photo: "https://images.unsplash.com/photo-1508522670557-664ed933c05d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        description: "Fire truck responding to an emergency call"
      });
      
      await storage.createGalleryItem({
        photo: "https://images.unsplash.com/photo-1577201235656-480760500af5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        description: "Advanced ambulance with emergency lights"
      });
      
      // Create initial contact info
      await storage.updateContactInfo({
        address: "123 Emergency Avenue, Industrial Zone, Phoenix, AZ 85001, USA",
        phone: "+1 (555) 123-4567",
        email: "info@nationalfire.com",
        facebook: "https://facebook.com/nationalfire",
        instagram: "https://instagram.com/nationalfire",
        whatsapp: "https://wa.me/15551234567",
        linkedin: "https://linkedin.com/company/nationalfire"
      });
      
      // Create initial about stats
      await storage.updateAboutStats({
        yearsExperience: 35,
        customersServed: 500,
        productsSupplied: 1200,
        customersTestimonials: []
      });
      
      console.log("Seed data initialization complete!");
    }
  } catch (error) {
    console.error("Error initializing seed data:", error);
  }
}

// Create an instance of DatabaseStorage
export const storage = new DatabaseStorage();

// Initialize seed data
initializeSeedData().catch(console.error);