import type { PgDatabase } from "@db/pg-database";
import { Store } from "@domains/entities/store";
import { HttpClientError, HttpServerError } from "@libs/http-response-codes";
import { ClientError } from "@errors/error-classes/client-error";
import type { IStoreRepository } from "@ports/repos/IStoreRepository";
import type { IDomainTransformer } from "@ports/domain/IDomainTransformer";
import { storesTable, type NewStore, type StoreModel } from "@db/schema";
import { and, eq, like, sql } from "drizzle-orm";
import { ServerError } from "@errors/error-classes/server-error";
import { isNonEmpty } from "@libs/utils";
import type { CreateStoreRequestDto } from "@schemas/store";
import type { ISizeProvider } from "@ports/utilities/ISizeProvider";


export class PostgresStoreRepo implements 
    IStoreRepository, 
    IDomainTransformer<StoreModel, Store> {

    constructor(
        private readonly pg: PgDatabase
    ){};

    toDomain(store: StoreModel): Store {
        return new Store(
            store.id,
            store.name,
            store.email,
            store.address,
            store.ownerId
        );
    }

    async getSize(): Promise<number> {
        const [ result ] = await this.pg.client
            .select({ count: sql<number>`count(*)` })
            .from(storesTable);

        if(!result) {
            throw new ServerError(
                "Something went wrong!",
                HttpServerError.InternalServerError
            )
        }

        return result.count;
    }

    async createStore(newStore: NewStore): Promise<Store> {
        const [ inserted ] = await this.pg.client.insert(storesTable).values({
            name: newStore.name,
            email: newStore.email,
            ownerId: newStore.ownerId,
            address: newStore.address,
        }).returning();

        if(!inserted) {
            throw new ClientError(
                "Failed to create store", 
                HttpClientError.BadRequest
            );
        }

        return this.toDomain(inserted);
    }

    async getAllStores() {
        try {
            const result = await this.pg.client
                .select()
                .from(storesTable);

            return result.map(row => this.toDomain(row));
        } catch (err) {
            throw new ServerError(
                'Failed to fetch stores:', 
                HttpServerError.InternalServerError
            );
        }
    }

    async findStoresByColumns(
        filter: Partial<CreateStoreRequestDto>,
        limit?: number
    ): Promise<Store[]> {

        let query: any = this.pg.client.select()
            .from(storesTable);

        const entries = Object.entries(filter)
            .filter(([_, value]) => isNonEmpty(value));

        if (entries.length > 0) {
            query = query.where(
                and(
                    ...entries.map(([key, value]) => {
                        const column = storesTable[key as keyof typeof storesTable] as any;

                        const isTextColumn = column.dataType === 'text' || column.dataType === 'varchar';

                        return isTextColumn
                            ? like(column, `%${value}%`)
                            : eq(column, value);
                    })
                )
            );
        }

        if (limit !== undefined) {
            query = query.limit(limit);
        }

        const result = await query;

        return result.map((row: any) => this.toDomain(row));
    }

    async findById(storeId: StoreModel["id"]): Promise<Store> {

        const store = await this.findStoreByColName(
            "id",
            storeId
        );

        if (!store) {
            throw new ClientError(
                "Store doesn't exist", 
                HttpClientError.NotFound
            );
        }

        return this.toDomain(store);
    }

    async findStoreByColName<T extends keyof StoreModel>(
        columnName: T,
        columnData: StoreModel[T]
    ): Promise<Store | null> {
        const [ row ] = await this.pg.client
            .select()
            .from(storesTable)
            .where(eq(storesTable[columnName], columnData))
            .limit(1);

        if (!row) return null;

        return this.toDomain(row);
    }

    async findStoresByColName<T extends keyof StoreModel>(
        columnName: T,
        columnData: StoreModel[T]
    ): Promise<Store[]> {
        const result = await this.pg.client
            .select()
            .from(storesTable)
            .where(eq(storesTable[columnName], columnData))

        return result.map(row => this.toDomain(row));
    }
    
    async findByStoreEmail(storeEmail: StoreModel["email"]): Promise<Store> {
        const store = await this.findStoreByColName(
            "email",
            storeEmail
        );
    
        if (!store) {
            throw new ClientError(
                `Store with email '${storeEmail}' doesn't exist`,
                HttpClientError.NotFound
            );
        }
    
        return this.toDomain(store);
    }
    
    async findStoreByOwnerId(ownerId: StoreModel["ownerId"]): Promise<Store> {
        const store = await this.findStoreByColName(
            "ownerId",
            ownerId
        );
    
        if (!store) {
            throw new ClientError(
                `Store with ownerId '${ownerId}' doesn't exist`,
                HttpClientError.NotFound
            );
        }
    
        return this.toDomain(store);
    }

    async deleteById(storeId: StoreModel["id"]): Promise<Store> {
        const [ deleted ] = await this.pg.client
            .delete(storesTable)
            .where(eq(storesTable.id, storeId))
            .returning();

        if (!deleted) {
            throw new ClientError(
                "store doesn't exist", 
                HttpClientError.NotFound
            );
        }

        return this.toDomain(deleted);
    }

    async updateById(
        id: StoreModel["id"],
        updates: Partial<NewStore>
    ): Promise<Store> {
        const [updated] = await this.pg.client
            .update(storesTable)
            .set(updates)
            .where(eq(storesTable.id, id))
            .returning();

        if (!updated) {
            throw new ClientError(
                `Store with id ${id} not found.`,
                HttpClientError.NotFound
            );
        }

        return this.toDomain(updated);
    }
}