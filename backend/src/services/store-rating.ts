import type { NewStoreRating, StoreRatingModel } from "@db/schema";
import { ClientError } from "@errors/error-classes/client-error";
import { HttpClientError } from "@libs/http-response-codes";
import type { IStoreRatingRepository } from "@ports/repos/IStoreRatingRepository";
import type { CreateStoreRatingRequestDto } from "@schemas/store-rating";


export class StoreRatingService {
    constructor(
        private readonly storeRatingRepo: IStoreRatingRepository,
    ) {};

    async create(
        newStoreRating: CreateStoreRatingRequestDto
    ) {
        return this.storeRatingRepo.createStoreRating({
            userId: newStoreRating.userId,
            storeId: newStoreRating.storeId,
            rating: newStoreRating?.rating ?? 0
        });
    }

    getAllStoresRating() {
        return this.storeRatingRepo.getAllStoresRating()
    }

    async getStoreRatingByStoreId(
        storeId: StoreRatingModel["storeId"]
    ) {
        const storeRating = await this.storeRatingRepo.findStoreByColName(
            "storeId",
            storeId
        );

        if(!storeRating) {
            throw new ClientError(
                "Store Rating information doesn't exists.",
                HttpClientError.NotFound
            );
        }

        return storeRating;
    }

    getStoreRatingByUserId(
        userId: StoreRatingModel["userId"],
        storeId: StoreRatingModel["storeId"],
    ) {
        return this.storeRatingRepo.findStoreByUserAndStoreId(
            userId,
            storeId
        );
    }

    updateStoreRating(
        storeRatingId: StoreRatingModel["id"],
        storeRating: Partial<NewStoreRating>
    ) {
        return this.storeRatingRepo.updateById(
            storeRatingId,
            storeRating
        )
    }

    updateStoreRatingByUserId(
        userId: StoreRatingModel["userId"],
        storeId: StoreRatingModel["storeId"],
        storeRatingId: StoreRatingModel["id"],
        storeRating: Partial<NewStoreRating>
    ) {
        return this.storeRatingRepo.updateRatingByUserId(
            userId,
            storeId,
            storeRatingId,
            storeRating
        );
    }

    deleteStoreRating(
        storeRatingId: StoreRatingModel["id"]
    ) {
        return this.storeRatingRepo.deleteById(storeRatingId)
    }
}