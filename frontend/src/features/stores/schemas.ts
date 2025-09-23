import { z } from "zod";


export const CreateStoreSchema = z.object({
    name: z.string().min(3).max(60),
    email: z.email(),
    address: z.string().max(400),
    ownerId: z.uuid(),
});

export type CreateStoreInput = z.infer<typeof CreateStoreSchema>;
export type CreateStoreResponse = {
    ownerName: string;
    id: string;
    name: string;
    email: string;
    address: string;
    ownerId: string;
}