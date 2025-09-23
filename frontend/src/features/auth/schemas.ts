import * as z from "zod";

export const USER_ROLES = [
    "NORMAL_USER", 
    "STORE_OWNER",
    "SYSTEM_ADMINISTRATOR"
] as const;

export const SignupSchema = z.object({
  name: z
    .string({ error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string"
    })
    .min(3, { error: "Name cannot be less than 3 characters" })
    .max(60, { error: "Name cannot exceed 60 characters" }),

  email: z
    .email({ error: "Email must be a valid email address" }),

  address: z
    .string({ error: (issue) =>
        issue.input === undefined
          ? "Address is required"
          : "Address must be a string"
    })
    .min(1, { error: "Address cannot be empty" })
    .max(400, { error: "Address cannot exceed 400 characters" }),

  role: z
    .enum(USER_ROLES, {
      error: (issue) =>
        issue.input === undefined
          ? "Role is required"
          : `Role must be one of System Administrator, Normal User, Store Owner`
    }),

  password: z
    .string({ error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string"
    })
    .min(8, { error: "Password must be at least 8 characters long" })
    .max(16, { error: "Password cannot exceed 16 characters" })
    .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { error: "Password must contain at least one lowercase letter" }),

  confirmPassword: z.string()
    .min(1, { message: 'Confirm Password is required' }),  

}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password and Confirm Password do not match',
    path: ['confirmPassword'],
});

export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = SignupSchema.pick({
    email: true, 
    password: true, 
    role: true
});
export type LoginInput = z.infer<typeof LoginSchema>;