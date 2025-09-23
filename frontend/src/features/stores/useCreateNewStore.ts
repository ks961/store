import { createNewStore } from "@/api/stores.api";
import { useMutation } from "@tanstack/react-query";
import { CreateStoreInput } from "./schemas";


export function useCreateNewStore() {
    return useMutation({
        mutationFn: (store: CreateStoreInput) => createNewStore(store)
    });
}