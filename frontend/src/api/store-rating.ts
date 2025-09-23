import { api } from "./client";


export function rateStore(
    storeId: string,
    rating: number
) {
    return api.post(`/v1/stores/${storeId}/ratings`, { rating });
}

export function storeRatingUpdate(
    storeId: string,
    rating: number,
    ratingId: string
) {
    return api.patch(`/v1/stores/${storeId}/ratings/${ratingId}`, { rating });
}