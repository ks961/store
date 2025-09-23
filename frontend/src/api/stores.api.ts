import { api } from "./client";
import { CreateStoreInput } from "@/features/stores/schemas";

export function getStores() {
    return api.get("/v1/stores");
}

export function getUsersByOwnerId() {
    return api.get(`/v1/stores/users`);
}

export function deleteStoreById(storeId: string) {
    return api.delete(`/v1/stores/${storeId}`);
}

export function createNewStore(
    store: CreateStoreInput
) {
    return api.post("/v1/stores", store);
}