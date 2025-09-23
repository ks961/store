import type { NewStore, StoreModel } from "@db/schema";
import type { Store } from "@domains/entities/store";
import type { ISizeProvider } from "@ports/utilities/ISizeProvider";
import type { CreateStoreRequestDto } from "@schemas/store";


export interface IStoreRepository extends ISizeProvider {
    getAllStores(): Promise<Store[]>,
    createStore(newStore: NewStore): Promise<Store>,
    findById(storeId: StoreModel["id"]): Promise<Store>,
    deleteById(storeId: StoreModel["id"]): Promise<Store>,
    findStoresByColName<T extends keyof StoreModel>(
        columnName: T,
        columnData: StoreModel[T]
    ): Promise<Store[]>,
    findStoreByColName<T extends keyof StoreModel>(
        columnName: T,
        columnData: StoreModel[T]
    ): Promise<Store | null>,
    findStoresByColumns(filter: Partial<CreateStoreRequestDto>, limit?: number): Promise<Store[]>
    findByStoreEmail(storeEmail: StoreModel["email"]): Promise<Store>,
    findStoreByOwnerId(ownerId: StoreModel["ownerId"]): Promise<Store>,
    updateById(storeId: StoreModel["id"], store: Partial<NewStore>): Promise<Store>,
}
// 5831aa66-71ff-4474-930e-578f774923cf