import { rateStore } from "@/api/store-rating";
import { useMutation } from "@tanstack/react-query";

type MutationData = {
    rating: number,
    storeId: string,
}

export function useRateStore() {
    return useMutation({
        mutationFn: ({ storeId, rating }: MutationData) => rateStore(storeId, rating)
    })
}