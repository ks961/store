import type { Store } from "@domains/entities/store";
import type { SuccessResponse } from "@types";
import z from "zod";

export const StoreIdSchema = z.object({
    id: z.uuid()
});

export const CreateStoreSchema = z.object({
    name: z.string().min(3).max(60),
    email: z.email(),
    address: z.string().max(400),
    ownerId: z.uuid(),
});

export type CreateStoreRequestDto = z.infer<typeof CreateStoreSchema>;
export type CreateStoreResponseDto = SuccessResponse<Store>;

export const UpdateStoreSchema = z.object({
    name: CreateStoreSchema.shape.name.optional(),
    email: CreateStoreSchema.shape.email.optional(),
    address: CreateStoreSchema.shape.address.optional(),
    ownerId: CreateStoreSchema.shape.ownerId.optional(),
});

export type UpdateStoreRequestDto = z.infer<typeof UpdateStoreSchema>;
export type UpdateStoreResponseDto = SuccessResponse<Store>;