import type { StoreModel } from "@db/schema";
import type { Store } from "@domains/entities/store";
import { ClientError } from "@errors/error-classes/client-error";
import { ServerError } from "@errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "@libs/http-response-codes";
import type { IStoreRatingRepository } from "@ports/repos/IStoreRatingRepository";
import type { IStoreRepository } from "@ports/repos/IStoreRepository";
import type { IUserRepository } from "@ports/repos/IUserRepository";
import type { CreateStoreRequestDto, UpdateStoreRequestDto } from "@schemas/store";


export class StoreService {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly storeRepo: IStoreRepository,
        private readonly storeRatingRepo: IStoreRatingRepository
    ) {};

    async create(
        newStore: CreateStoreRequestDto
    ) {
        try {

            await this.userRepo.findById(newStore.ownerId);


            let store = await this.storeRepo.findByStoreEmail(newStore.email);
            if(store) {
                throw new ClientError(
                    `Store with email '${store.email}' already exists.`,
                    HttpClientError.Conflict
                );
            }
        } catch(err: unknown) {
            if (!(
                err instanceof ClientError && 
                err.statusCode === HttpClientError.NotFound.statusCode
            )) {
                throw err;
            }
        }

        const store = await this.storeRepo.createStore(newStore);

        const user = await this.userRepo.findById(store.ownerId);

        return {
            ...store,
            ownerName: user.name
        }
    }

    async getAllStores(
        filters: Partial<CreateStoreRequestDto>
    ) {
        try {
            const stores = await this.storeRepo.findStoresByColumns(filters);

            const users = await Promise.all(
                stores.map(store => this.userRepo.findById(store.ownerId))
            );

            const storesWithOwnerName = await Promise.all(
                stores.map(async (store, idx) => {
                    const ratings = await this.storeRatingRepo.findByStoreId(store.id);
                    const overallRatings =
                        ratings.length > 0
                            ? ratings.reduce((acc, r) => acc + (r.rating ?? 0), 0) / ratings.length
                            : null;

                    return {
                        ...store,
                        ratings,
                        overallRatings,
                        ownerName: users[idx]?.name ?? null,
                    };
                })
            );

            return storesWithOwnerName;
        } catch (err) {
            throw new ServerError(
                "Something went wrong",
                HttpServerError.InternalServerError
            );
        }
    }

    async getStoreById(
        storeId: StoreModel["id"]
    ): Promise<Store> {
        return this.storeRepo.findById(storeId);
    }

    async getStoreByOwnerId(
        storeOwnerId: StoreModel["ownerId"]
    ) {
        const store = await this.storeRepo.findStoreByColName(
            "ownerId",
            storeOwnerId
        );

        if(!store) {
            throw new ClientError(
                `Store with ownerId '${storeOwnerId}' doesn't exists.`,
                HttpClientError.NotFound
            );
        }

        return store;
    }

    async listUserByOwnerId(ownerId: string) {
        const store = await this.storeRepo.findStoreByOwnerId(ownerId);
        const storeRatings = await this.storeRatingRepo.findMany({ storeId: store.id });

        const promises = storeRatings.map(rating => this.userRepo.findById(rating.ownerId));

        try {
            const users = await Promise.all(promises);

            const ratingMap = new Map(
                storeRatings.map(r => [r.ownerId, r.rating])
            );

            const usersWithRating = users.map(user => ({
                ...user,
                rating: ratingMap.get(user.id) ?? null
            }));

            const avgRating = storeRatings.length
                ? storeRatings.reduce((acc, sRate) => acc + (sRate?.rating ?? 0), 0) / storeRatings.length
                : 0;

            return {
                users: usersWithRating,
                avgRating
            };
        } catch {
            throw new ServerError(
                "Something went wrong",
                HttpServerError.InternalServerError
            );
        }
    }


    async updateStoreById(
        storeId: StoreModel["id"],
        store: UpdateStoreRequestDto
    ) {
        return this.storeRepo.updateById(
            storeId,
            store
        );
    }

    async deleteStoreById(
        storeId: StoreModel["id"],
    ) {
        return this.storeRepo.deleteById(storeId);
    }
}