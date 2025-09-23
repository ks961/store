import type { SuccessResponse } from "@types";
import z from "zod";

export const CreateStoreRatingSchema = z.object({
    userId: z.uuid(),
    storeId: z.uuid(),
    rating: z.number().min(1).max(5).optional(),
});

export type CreateStoreRatingRequestDto = z.infer<typeof CreateStoreRatingSchema>;
export type CreateStoreRatingResponseDto = SuccessResponse<undefined>;

export const UpdateStoreRatingParamSchema = z.object({
    storeRatingId:  z.uuid()
});