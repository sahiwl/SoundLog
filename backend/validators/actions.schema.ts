import { z } from "zod";

const ratingBody = z.object({
  rating: z
    .number({ message: "Rating must be a number between 0 and 100" })
    .min(0)
    .max(100)
    .refine((n: number) => n % 0.5 === 0, {
      message: "Rating must be a number between 0 and 100",
    }),
});
export type RatingBodyInput = z.infer<typeof ratingBody>;

const ratingParams = z.object({
  itemType: z.enum(["tracks", "albums"], {
    message: "Valid itemType (tracks or albums) is required.",
  }),
  itemId: z.string().min(1, "itemId is required."),
});
export type RatingParamsInput = z.infer<typeof ratingParams>;

export const addRatingSchema = z.object({
  params: ratingParams,
  body: ratingBody,
});
export type AddRatingInput = z.infer<typeof addRatingSchema>;

export const addReviewSchema = z.object({
  params: z.object({
    albumId: z.string().min(1, "albumId is required."),
  }),
  body: z.object({
    reviewText: z.string().trim().min(1, "Review text cannot be empty."),
  }),
});
export type AddReviewInput = z.infer<typeof addReviewSchema>;

export const updateReviewSchema = z.object({
  params: z.object({
    albumId: z.string().min(1, "albumId is required."),
  }),
  body: z.object({
    reviewText: z.string().trim().min(1, "Review text cannot be empty."),
  }),
});
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
