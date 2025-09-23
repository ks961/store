import { deleteStoreById } from "@/api/stores.api";
import { useMutation } from "@tanstack/react-query";


export function useDeleteStore() {
    return useMutation({
        mutationFn: (storeId: string) => deleteStoreById(storeId)
    });
}