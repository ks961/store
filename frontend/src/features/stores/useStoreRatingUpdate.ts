import { storeRatingUpdate } from "@/api/store-rating";
import { useMutation } from "@tanstack/react-query";

type MutationData = {
    ratingId: string,
    rating: number,
    storeId: string
}

export function useStoreRatingUpdate() {
    return useMutation({
        mutationFn: ({ rating, ratingId, storeId }: MutationData) => storeRatingUpdate(
            storeId,
            rating,
            ratingId
        )
    })
}