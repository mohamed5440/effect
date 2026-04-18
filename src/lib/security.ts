import DOMPurify from 'dompurify';
import { z } from 'zod';

/**
 * Sanitizes a string to prevent XSS attacks.
 */
export const sanitize = (text: string): string => {
  if (typeof window === 'undefined') return text;
  return DOMPurify.sanitize(text);
};

/**
 * Schema for job application validation.
 */
export const applicationSchema = z.object({
  full_name: z.string().min(3, "الاسم الكامل يجب أن يكون ٣ أحرف على الأقل").max(100, "الاسم طويل جداً"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(8, "رقم الهاتف غير صالح").max(20, "رقم الهاتف طويل جداً"),
  location: z.string().min(2, "الموقع غير صالح").max(100),
  expertise: z.string().min(2, "التخصص غير صالح").max(100),
  experience: z.string().min(1, "الخبرة مطلوبة").max(50),
  portfolio: z.string().url("رابط المحفظة غير صالح").or(z.literal("")).optional(),
  skills: z.string().max(500).optional(),
  min_rate: z.string().max(20).optional(),
  max_rate: z.string().max(20).optional(),
  bio: z.string().max(1000, "النبذة الشخصية يجب أن لا تتجاوز ١٠٠٠ حرف").optional(),
});

/**
 * Schema for job application validation (English).
 */
export const applicationSchemaEn = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Invalid phone number").max(20, "Phone number is too long"),
  location: z.string().min(2, "Invalid location").max(100),
  expertise: z.string().min(2, "Invalid expertise").max(100),
  experience: z.string().min(1, "Experience is required").max(50),
  portfolio: z.string().url("Invalid portfolio link").or(z.literal("")).optional(),
  skills: z.string().max(500).optional(),
  min_rate: z.string().max(20).optional(),
  max_rate: z.string().max(20).optional(),
  bio: z.string().max(1000, "Bio must not exceed 1000 characters").optional(),
});

export type ApplicationData = z.infer<typeof applicationSchema>;

/**
 * Schema for contact form validation.
 */
export const contactSchema = z.object({
  full_name: z.string().min(3, "الاسم الكامل يجب أن يكون ٣ أحرف على الأقل").max(100, "الاسم طويل جداً"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(8, "رقم الهاتف غير صالح").max(20, "رقم الهاتف طويل جداً"),
  subject: z.string().min(2, "الموضوع غير صالح").max(200),
  message: z.string().min(2, "الرسالة يجب أن تكون حرفين على الأقل").max(2000, "الرسالة طويلة جداً"),
});

/**
 * Schema for contact form validation (English).
 */
export const contactSchemaEn = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Invalid phone number").max(20, "Phone number is too long"),
  subject: z.string().min(2, "Invalid subject").max(200),
  message: z.string().min(2, "Message must be at least 2 characters").max(2000, "Message is too long"),
});

export type ContactData = z.infer<typeof contactSchema>;

/**
 * Sanitizes an entire application object.
 */
export const sanitizeApplication = (data: any): any => {
  const sanitized: any = {};
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = sanitize(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
};

/**
 * Sanitizes an entire contact object.
 */
export const sanitizeContact = (data: any): any => {
  return sanitizeApplication(data);
};
