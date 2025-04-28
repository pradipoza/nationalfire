import { pgTable, text, serial, integer, boolean, timestamp, uuid, json } from "drizzle-orm/pg-core";
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
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Products schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  photos: json("photos").$type<string[]>().notNull().default([]),
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

// Contact Information schema
export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
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

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  inquiries: many(inquiries),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  product: one(products, {
    fields: [inquiries.productId],
    references: [products.id],
  }),
}));
