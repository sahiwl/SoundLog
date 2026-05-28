import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    username: z.string().trim().min(1, "Username is required"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});
export type SignupInput = z.infer<typeof signupSchema>

export const loginSchema = z.object({
  body: z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  }),
});
export type LoginInput = z.infer<typeof loginSchema>

export const updateProfileSchema = z.object({
  body: z
    .object({
      username: z.string().trim().min(1).optional(),
      email: z.string().trim().email("Invalid email address").optional(),
      bio: z.string().optional(),
      profilePic: z.string().optional(),
      favourites: z
        .array(z.string().min(1))
        .max(4, "You can pick at most 4 favourite albums.")
        .optional(),
    })
    .refine(
      (data) =>
        data.username ||
        data.email ||
        data.bio !== undefined ||
        data.profilePic ||
        data.favourites,
      { message: "Nothing given to update" }
    ),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
