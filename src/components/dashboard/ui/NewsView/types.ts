import { z } from "zod";

export const NEWS_CATEGORIES = [
  "general",
  "entertainment", 
  "politics",
  "sports",
  "technology",
  "health",
  "business",
  "education"
] as const;

export const NewsSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(200).optional(),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  category: z.enum(NEWS_CATEGORIES).default("general"),
  isPublished: z.boolean().default(true),
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type NewsArticle = {
  id: string; // Changed from number to string
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: typeof NEWS_CATEGORIES[number];
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    email: string;
  };
};
export type CreateNewsDto = Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>;

export type NotificationType = {
  message: string;
  type: "success" | "error" | "info";
} | null;