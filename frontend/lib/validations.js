import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["admin", "teacher", "student", "parent"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const studentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address").optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    address: z.string().optional(),
  }),
  academicInfo: z.object({
    class: z.string().optional(),
    section: z.string().optional(),
    rollNumber: z.string().optional(),
  }),
  status: z.enum(["Active", "Inactive", "Graduated"]).optional(),
})
