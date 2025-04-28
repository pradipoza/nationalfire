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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private blogs: Map<number, Blog>;
  private galleryItems: Map<number, Gallery>;
  private contactInfoData: ContactInfo | undefined;
  private inquiriesData: Map<number, Inquiry>;
  private aboutStatsData: AboutStats | undefined;
  private analyticsData: Map<number, Analytics>;
  
  private currentUserId: number;
  private currentProductId: number;
  private currentBlogId: number;
  private currentGalleryId: number;
  private currentInquiryId: number;
  private currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.blogs = new Map();
    this.galleryItems = new Map();
    this.inquiriesData = new Map();
    this.analyticsData = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentBlogId = 1;
    this.currentGalleryId = 1;
    this.currentInquiryId = 1;
    this.currentAnalyticsId = 1;
    
    // Initialize with default contact info
    this.contactInfoData = {
      id: 1,
      address: "123 Emergency Avenue, Industrial Zone, Phoenix, AZ 85001, USA",
      phone: "+1 (555) 123-4567",
      email: "info@nationalfire.com",
      facebook: "https://facebook.com/nationalfire",
      instagram: "https://instagram.com/nationalfire",
      whatsapp: "https://wa.me/15551234567",
      linkedin: "https://linkedin.com/company/nationalfire",
      updatedAt: new Date()
    };
    
    // Initialize with default about stats
    this.aboutStatsData = {
      id: 1,
      yearsExperience: 35,
      customersServed: 500,
      productsSupplied: 1200,
      customersTestimonials: [],
      updatedAt: new Date()
    };
    
    // Add an initial admin user
    this.createUser({
      username: "admin",
      password: "admin123", // This would be hashed in a real app
      email: "admin@nationalfire.com"
    });
    
    // Add some initial product data
    this.createProduct({
      name: "Premium Fire Truck",
      description: "High-capacity fire truck with advanced water delivery systems and rescue equipment.",
      photos: ["https://images.unsplash.com/photo-1516550893885-985da0253db1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"]
    });
    
    this.createProduct({
      name: "Advanced Ambulance",
      description: "State-of-the-art ambulance with complete medical equipment and efficient response capabilities.",
      photos: ["https://images.unsplash.com/photo-1587843618590-26adcc8dfc1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"]
    });
    
    this.createProduct({
      name: "Electric Transport Bus",
      description: "Eco-friendly electric bus designed for efficient urban transportation with zero emissions.",
      photos: ["https://images.unsplash.com/photo-1619252584172-a83a949b6efd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"]
    });
    
    // Add some initial blog data
    this.createBlog({
      title: "Fire Safety Innovations for 2023",
      content: "Discover the latest technological advancements in fire safety equipment that are transforming emergency response capabilities...",
      photos: [
        { url: "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", position: "top" }
      ]
    });
    
    this.createBlog({
      title: "The Future of Electric Emergency Vehicles",
      content: "As cities worldwide embrace sustainability, electric emergency vehicles are becoming increasingly viable. Learn about the benefits and challenges...",
      photos: [
        { url: "https://images.unsplash.com/photo-1590332763583-aede28e83de6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", position: "top" }
      ]
    });
    
    this.createBlog({
      title: "Advanced Medical Equipment in Modern Ambulances",
      content: "Today's ambulances are equipped with sophisticated medical technology that can mean the difference between life and death. Explore the latest innovations...",
      photos: [
        { url: "https://images.unsplash.com/photo-1635166304271-3281e472ad24?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", position: "top" }
      ]
    });
    
    // Add some initial gallery data
    this.createGalleryItem({
      photo: "https://images.unsplash.com/photo-1508522670557-664ed933c05d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      description: "Fire truck responding to an emergency call"
    });
    
    this.createGalleryItem({
      photo: "https://images.unsplash.com/photo-1577201235656-480760500af5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      description: "Advanced ambulance with emergency lights"
    });
    
    this.createGalleryItem({
      photo: "https://images.unsplash.com/photo-1622555048949-37728973c635?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      description: "Electric city bus with zero emissions"
    });
    
    this.createGalleryItem({
      photo: "https://images.unsplash.com/photo-1525438160292-a4a860951216?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      description: "Specialized fire fighting equipment"
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const now = new Date();
    const newProduct: Product = { ...product, id, createdAt: now, updatedAt: now };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Blogs
  async getBlogs(): Promise<Blog[]> {
    return Array.from(this.blogs.values());
  }
  
  async getBlog(id: number): Promise<Blog | undefined> {
    return this.blogs.get(id);
  }
  
  async createBlog(blog: InsertBlog): Promise<Blog> {
    const id = this.currentBlogId++;
    const now = new Date();
    const newBlog: Blog = { ...blog, id, createdAt: now, updatedAt: now };
    this.blogs.set(id, newBlog);
    return newBlog;
  }
  
  async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | undefined> {
    const blog = await this.getBlog(id);
    if (!blog) return undefined;
    
    const updatedBlog = { ...blog, ...updates, updatedAt: new Date() };
    this.blogs.set(id, updatedBlog);
    return updatedBlog;
  }
  
  async deleteBlog(id: number): Promise<boolean> {
    return this.blogs.delete(id);
  }
  
  // Gallery
  async getGalleryItems(): Promise<Gallery[]> {
    return Array.from(this.galleryItems.values());
  }
  
  async getGalleryItem(id: number): Promise<Gallery | undefined> {
    return this.galleryItems.get(id);
  }
  
  async createGalleryItem(galleryItem: InsertGallery): Promise<Gallery> {
    const id = this.currentGalleryId++;
    const newGalleryItem: Gallery = { ...galleryItem, id, createdAt: new Date() };
    this.galleryItems.set(id, newGalleryItem);
    return newGalleryItem;
  }
  
  async deleteGalleryItem(id: number): Promise<boolean> {
    return this.galleryItems.delete(id);
  }
  
  // Contact Info
  async getContactInfo(): Promise<ContactInfo | undefined> {
    return this.contactInfoData;
  }
  
  async updateContactInfo(updates: Partial<InsertContactInfo>): Promise<ContactInfo | undefined> {
    if (!this.contactInfoData) return undefined;
    
    this.contactInfoData = { 
      ...this.contactInfoData, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    return this.contactInfoData;
  }
  
  // Inquiries
  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiriesData.values());
  }
  
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiriesData.get(id);
  }
  
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const newInquiry: Inquiry = { 
      ...inquiry, 
      id, 
      createdAt: new Date(),
      read: false
    };
    this.inquiriesData.set(id, newInquiry);
    return newInquiry;
  }
  
  async markInquiryAsRead(id: number): Promise<Inquiry | undefined> {
    const inquiry = await this.getInquiry(id);
    if (!inquiry) return undefined;
    
    const updatedInquiry = { ...inquiry, read: true };
    this.inquiriesData.set(id, updatedInquiry);
    return updatedInquiry;
  }
  
  async deleteInquiry(id: number): Promise<boolean> {
    return this.inquiriesData.delete(id);
  }
  
  // About Stats
  async getAboutStats(): Promise<AboutStats | undefined> {
    return this.aboutStatsData;
  }
  
  async updateAboutStats(updates: Partial<InsertAboutStats>): Promise<AboutStats | undefined> {
    if (!this.aboutStatsData) return undefined;
    
    this.aboutStatsData = { 
      ...this.aboutStatsData, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    return this.aboutStatsData;
  }
  
  // Analytics
  async logPageVisit(pageVisit: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const visit: Analytics = { 
      ...pageVisit, 
      id, 
      timestamp: new Date() 
    };
    this.analyticsData.set(id, visit);
    return visit;
  }
  
  async getPageVisits(limit?: number): Promise<Analytics[]> {
    const visits = Array.from(this.analyticsData.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? visits.slice(0, limit) : visits;
  }
}

export const storage = new MemStorage();
