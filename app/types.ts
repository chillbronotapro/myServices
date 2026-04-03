import { z } from 'zod';

// User types
export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

// Category types
export interface Category {
  id: number;
  name: string;
  emoji?: string;
  description?: string;
  createdAt: Date;
}

// Service types
export interface Service {
  id: number;
  title: string;
  price: number;
  category?: string;
  providerId: string;
  createdAt: Date;
}

export interface CreateServiceInput {
  title: string;
  price: number;
  category?: string;
  providerId: string;
}

// Booking types
export interface Booking {
  id: number;
  serviceId: number;
  userId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

export interface CreateBookingInput {
  serviceId: number;
  userId: string;
  date: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: unknown[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form validation schemas
export const createServiceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  price: z.number().positive('Price must be positive'),
  category: z.string().optional(),
  providerId: z.string().min(1, 'Provider ID is required'),
});

export const createBookingSchema = z.object({
  serviceId: z.number().positive('Service ID must be positive'),
  userId: z.string().min(1, 'User ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name too long'),
  emoji: z.string().max(10, 'Emoji too long').optional(),
  description: z.string().max(255, 'Description too long').optional(),
});

export const createUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  email: z.string().email('Invalid email format'),
  role: z.string().min(1, 'Role is required'),
});