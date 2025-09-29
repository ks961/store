import type { NewStoreRating, StoreRatingModel } from "@db/schema";
import type { StoreRating } from "@domains/entities/store-rating";



export interface IStoreRatingRepository extends ISizeProvider {
    getAllStoresRating(): Promise<StoreRating[]>,
    findById(storeRatingId: StoreRatingModel["id"]): Promise<StoreRating>,
    findByStoreId(storeId: StoreRatingModel["id"]): Promise<StoreRating[]>,
    deleteById(storeId: StoreRatingModel["id"]): Promise<StoreRating>,
    findStoreRatingsByColName<T extends keyof StoreRatingModel>(
        columnName: T,
        columnData: StoreRatingModel[T]
    ): Promise<StoreRating[]>,
    findStoreByColName<T extends keyof StoreRatingModel>(
        columnName: T,
        columnData: StoreRatingModel[T]
    ): Promise<StoreRating | null>,
    findStoreByUserAndStoreId(
       userId: StoreRatingModel["userId"],
        storeId: StoreRatingModel["storeId"]
    ): Promise<StoreRating>,
    createStoreRating(newStore: NewStoreRating): Promise<StoreRating>,
    updateById(storeId: StoreRatingModel["id"], store: Partial<NewStoreRating>): Promise<StoreRating>,
    updateRatingByUserId(
        userId: StoreRatingModel["userId"], 
        storeId: StoreRatingModel["storeId"],
        storeRatingId: StoreRatingModel["id"],
        storeRating: Partial<NewStoreRating>
    ): Promise<StoreRating>,

    findMany(storeRating: Partial<NewStoreRating>): Promise<StoreRating[]>;
}