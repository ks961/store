import type { PgDatabase } from "@db/pg-database";
import { storeRatingsTable, type NewStoreRating, type StoreRatingModel } from "@db/schema";
import { StoreRating } from "@domains/entities/store-rating";
import { ClientError } from "@errors/error-classes/client-error";
import { ServerError } from "@errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "@libs/http-response-codes";
import type { IDomainTransformer } from "@ports/domain/IDomainTransformer";
import type { IStoreRatingRepository } from "@ports/repos/IStoreRatingRepository";

import { and, eq, isNull, sql } from "drizzle-orm";


export class PostgresStoreRatingRepo implements 
    IStoreRatingRepository, 
    IDomainTransformer<StoreRatingModel, StoreRating> {

    constructor(
        private readonly pg: PgDatabase
    ) {};


    toDomain(model: StoreRatingModel): StoreRating {
        return new StoreRating(
            model.id,
            model.userId,
            model.storeId,
            model.rating ?? 0
        );
    }

    async getSize(): Promise<number> {
        const [ result ] = await this.pg.client
            .select({ count: sql<number>`count(*)` })
            .from(storeRatingsTable);

        if(!result) {
            throw new ServerError(
                "Something went wrong!",
                HttpServerError.InternalServerError
            )
        }

        return result.count;
    }

    async getAllStoresRating() {
        const result = await this.pg.client
            .select()
            .from(storeRatingsTable);

        return result.map(row => this.toDomain(row));
    }

    async findById(storeRatingId: StoreRatingModel["id"]): Promise<StoreRating> {

        const [result] = await this.pg.client
            .select()
            .from(storeRatingsTable)
            .where(eq(storeRatingsTable.id, storeRatingId));

        if(!result) {
            throw new ClientError(
                "Store rating not found",
                HttpClientError.NotFound
            );
        }


        return this.toDomain(result);
    }

    async findByStoreId(storeId: StoreRatingModel["id"]): Promise<StoreRating[]> {

        const result = await this.pg.client
            .select()
            .from(storeRatingsTable)
            .where(eq(storeRatingsTable.storeId, storeId));


        return result.map(row => this.toDomain(row));
    }
    
    async findMany(storeRating: Partial<NewStoreRating>): Promise<StoreRating[]> {
        const conditions = Object.entries(storeRating).map(([key, value]) => {
            // @ts-ignore
            return eq(storeRatingsTable[key], value);
        });

        const query = this.pg.client
            .select()
            .from(storeRatingsTable);

        const result = conditions.length
            ? await query.where(and(...conditions))
            : await query;

        return result.map(row => this.toDomain(row));
    }


    async findStoreRatingsByColName<T extends keyof StoreRatingModel>(
        columnName: T,
        columnData: StoreRatingModel[T]
    ): Promise<StoreRating[]> {

        const column = storeRatingsTable[columnName];
        const result = await this.pg.client
            .select()
            .from(storeRatingsTable)
            .where(
                columnData === null ?
                    isNull(column) : 
                    eq(column, columnData)
            );

        return result.map( row => this.toDomain(row));
    }

    async findStoreByColName<T extends keyof StoreRatingModel>(
        columnName: T,
        columnData: StoreRatingModel[T]
    ): Promise<StoreRating | null> {

        const column = storeRatingsTable[columnName];
        const [ row ] = await this.pg.client
            .select()
            .from(storeRatingsTable)
            .where(
                columnData === null ?
                    isNull(column) : 
                    eq(column, columnData)
            ).limit(1);

        if (!row) return null;

        return this.toDomain(row);
    }

    async deleteById(storeId: StoreRatingModel["id"]): Promise<StoreRating> {
        const [ deleted ] = await this.pg.client
            .delete(storeRatingsTable)
            .where(eq(storeRatingsTable.id, storeId))
            .returning();

        if (!deleted) {
            throw new ClientError(
                "Store rating record doesn't exist", 
                HttpClientError.NotFound
            );
        }

        return this.toDomain(deleted);
    }

    async createStoreRating(newStore: NewStoreRating): Promise<StoreRating> {
        const [ inserted ] = await this.pg.client.insert(storeRatingsTable).values({
            storeId: newStore.storeId,
            userId: newStore.userId,
            rating: newStore.rating
        }).returning();

        if(!inserted) {
            throw new ClientError(
                "Failed to create store rating.", 
                HttpClientError.BadRequest
            );
        }

        return this.toDomain(inserted);
    }

    async updateById(
        id: StoreRatingModel["id"],
        updates: Partial<NewStoreRating>
    ): Promise<StoreRating> {
        const [updated] = await this.pg.client
            .update(storeRatingsTable)
            .set(updates)
            .where(eq(storeRatingsTable.id, id))
            .returning();

        if (!updated) {
            throw new ClientError(
                `StoreRating record not found.`,
                HttpClientError.NotFound
            );
        }

        return this.toDomain(updated);
    }
    
    async updateRatingByUserId(
        userId: StoreRatingModel["userId"], 
        storeId: StoreRatingModel["storeId"],
        storeRatingId: StoreRatingModel["id"],
        store: Partial<NewStoreRating>
    ): Promise<StoreRating> {
        console.log(
            storeRatingId,
            store,    
        );
        const [updated] = await this.pg.client
            .update(storeRatingsTable)
            .set(store)
            .where(
                and(
                    eq(storeRatingsTable.userId, userId),
                    eq(storeRatingsTable.storeId, storeId),
                    eq(storeRatingsTable.id, storeRatingId),
                )
            )
            .returning();
    
        if (!updated) {
            throw new ClientError(
                `StoreRating record not found.`,
                HttpClientError.NotFound
            );
        }
        
        return this.toDomain(updated);
    }

    async findStoreByUserAndStoreId(
        userId: StoreRatingModel["userId"], 
        storeId: StoreRatingModel["storeId"]
    ): Promise<StoreRating> {
        
        const result = await this.pg.client
            .select()
            .from(storeRatingsTable)
            .where(
                and(
                    eq(storeRatingsTable.storeId, storeId),
                    eq(storeRatingsTable.userId, userId)
                )
            );

        const store = result.length > 0 ? result[0] : null;

        if (!store) {
            throw new ClientError(
                "Store rating record doesn't exist", 
                HttpClientError.NotFound
            );
        }

        return this.toDomain(store);   
    }
}