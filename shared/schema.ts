import { pgTable, text, serial, integer, boolean, timestamp, uuid, json, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from "nanoid";

// User schema for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
}).extend({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  email: z.string().email().max(100),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Brands schema
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

// Sub-products schema
export const subProducts = pgTable("sub_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // name will be used for routing
  modelNumber: text("model_number"), // optional
  photo: text("photo").notNull(),
  content: text("content").default(""), // Rich text content for detailed descriptions
  pageData: json("page_data").$type<any>(), // GrapesJS project data JSON
  htmlContent: text("html_content"), // Generated HTML from GrapesJS
  cssContent: text("css_content"), // Generated CSS from GrapesJS
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSubProductSchema = createInsertSchema(subProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1).max(200).trim(),
  modelNumber: z.string().max(100).optional(),
  photo: z.string().min(1),
  content: z.string().max(1048576).optional(), // 1MB limit
  htmlContent: z.string().max(10485760).optional(), // 10MB limit
  cssContent: z.string().max(1048576).optional(), // 1MB limit
});

export type InsertSubProduct = z.infer<typeof insertSubProductSchema>;
export type SubProduct = typeof subProducts.$inferSelect;

// Pages schema for GrapesJS page builder
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // page identifier (e.g., sub-product id or custom slug)
  title: text("title").notNull(),
  data: json("data").$type<any>().notNull(), // GrapesJS project data JSON
  htmlContent: text("html_content"), // Generated HTML from GrapesJS
  cssContent: text("css_content"), // Generated CSS from GrapesJS
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;

// Products schema (updated to remove content and use sub-products)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  photos: json("photos").$type<string[]>().notNull().default([]),
  subProductIds: json("sub_product_ids").$type<number[]>().notNull().default([]),
  brandId: integer("brand_id").references(() => brands.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Blogs schema
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  photos: json("photos").$type<{url: string, position: 'top' | 'middle' | 'bottom'}[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Blog = typeof blogs.$inferSelect;

// Gallery schema
export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  photo: text("photo").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGallerySchema = createInsertSchema(gallery).omit({
  id: true,
  createdAt: true,
});

export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof gallery.$inferSelect;

// Contact Information schema (supports multiple phone numbers)
export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  phones: json("phones").$type<string[]>().notNull().default([]),
  email: text("email").notNull(),
  facebook: text("facebook"),
  instagram: text("instagram"),
  whatsapp: text("whatsapp"),
  linkedin: text("linkedin"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
  updatedAt: true,
});

export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;

// Site Settings schema (for logo and other global settings)
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  logo: text("logo"),
  faviconUrl: text("favicon_url"),
  companyName: text("company_name").default("National Fire Safe Pvt. Ltd."),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;

// About Content schema (for dynamic about us page content)
export const aboutContent = pgTable("about_content", {
  id: serial("id").primaryKey(),
  title: text("title").default("National Fire Safe Pvt. Ltd."),
  introTitle: text("intro_title"),
  content: text("content"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAboutContentSchema = createInsertSchema(aboutContent).omit({
  id: true,
  updatedAt: true,
});

export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;
export type AboutContent = typeof aboutContent.$inferSelect;

// Contact Inquiries schema
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  productId: integer("product_id"),
  createdAt: timestamp("created_at").defaultNow(),
  read: boolean("read").default(false),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  read: true,
});

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

// About Us stats
export const aboutStats = pgTable("about_stats", {
  id: serial("id").primaryKey(),
  yearsExperience: integer("years_experience").notNull().default(0),
  customersServed: integer("customers_served").notNull().default(0),
  productsSupplied: integer("products_supplied").notNull().default(0),
  customersTestimonials: json("customers_testimonials").$type<{name: string, company: string, text: string}[]>().default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAboutStatsSchema = createInsertSchema(aboutStats).omit({
  id: true,
  updatedAt: true,
});

export type InsertAboutStats = z.infer<typeof insertAboutStatsSchema>;
export type AboutStats = typeof aboutStats.$inferSelect;

// Site visits analytics
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  pageVisited: text("page_visited").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  ipAddress: text("ip_address"),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  timestamp: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

// Portfolio table
export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(), // 'social' or 'government'
  projectDetails: text("project_details").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPortfolioSchema = createInsertSchema(portfolio).pick({
  title: true,
  description: true,
  image: true,
  category: true,
  projectDetails: true,
});

export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolio.$inferSelect;

// Customers table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(), // Base64 image or URL
  website: text("website").notNull(),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Relations
export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ many, one }) => ({
  inquiries: many(inquiries),
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  product: one(products, {
    fields: [inquiries.productId],
    references: [products.id],
  }),
}));
