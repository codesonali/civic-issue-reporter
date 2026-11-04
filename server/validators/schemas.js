const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const issueSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(100),
  description: z.string().trim().min(10, "Description is too short"),
  category: z.enum(["pothole", "streetlight", "garbage", "water", "drainage", "other"]),
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
  address: z.string().trim().optional(),
});

const statusSchema = z.object({
  status: z.enum(["acknowledged", "in_progress", "resolved", "rejected"]),
  note: z.string().trim().optional(),
});

const commentSchema = z.object({
  text: z.string().trim().min(1, "Comment cannot be empty").max(500),
});

module.exports = { registerSchema, loginSchema, issueSchema, statusSchema, commentSchema };