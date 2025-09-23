import { and, eq, like, sql } from "drizzle-orm";
import type { PgDatabase } from "@db/pg-database";
import { User } from "@domains/entities/user";
import { HttpClientError, HttpServerError } from "@libs/http-response-codes";
import type { FilterUser, IUserRepository } from "@ports/repos/IUserRepository";
import { ClientError } from "@errors/error-classes/client-error";
import { usersTable, type NewUser, type UserModel } from "src/db/schema";
import type { IDomainTransformer } from "@ports/domain/IDomainTransformer";
import { isNonEmpty } from "@libs/utils";
import type { ISizeProvider } from "@ports/utilities/ISizeProvider";
import { ServerError } from "@errors/error-classes/server-error";

export class PostgresUserRepo implements 
    IUserRepository, 
    IDomainTransformer<UserModel, User> {

    constructor(
        private readonly pg: PgDatabase
    ) {};

    toDomain(
        user: UserModel, 
        toIncludePassword = false
    ): User {
        return new User(
            user.id,
            user.name,
            user.email,
            user.roleId,
            user.address,
            toIncludePassword ? user.hashedPassword : undefined
        );
    }

    async getSize(): Promise<number> {
        const [ result ] = await this.pg.client
            .select({ count: sql<number>`count(*)` })
            .from(usersTable);

        if(!result) {
            throw new ServerError(
                "Something went wrong!",
                HttpServerError.InternalServerError
            )
        }

        return result.count;
    }

    async findById(id: string, toIncludePassword = false): Promise<User> {
        const result = await this.pg.client
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id));

        const user = result.length > 0 ? result[0] : null;

        if (!user) {
            throw new ClientError(
                "User doesn't exist", 
                HttpClientError.NotFound
            );
        }

        return this.toDomain(user, toIncludePassword);
    }

    async createUser(newUser: NewUser, toIncludePassword = false): Promise<User> {

        const [ inserted ] = await this.pg.client
            .insert(usersTable)
            .values({
                name: newUser.name,
                email: newUser.email,
                roleId: newUser.roleId,
                address: newUser.address,
                hashedPassword: newUser.hashedPassword
            })
            .returning();

        if (!inserted) {
            throw new ClientError(
                "Failed to create user", 
                HttpClientError.BadRequest
            );
        }

        return this.toDomain(inserted, toIncludePassword);
    }
    
    async findUsersByColumns(
        filter: Partial<FilterUser>,
        toIncludePassword = false,
        limit?: number
    ): Promise<User[]> {

        let query: any = this.pg.client.select()
            .from(usersTable);

        const entries = Object.entries(filter)
            .filter(([_, value]) => isNonEmpty(value));

        if (entries.length > 0) {
            query = query.where(
                and(
                    ...entries.map(([key, value]) => {
                        const column = usersTable[key as keyof typeof usersTable] as any;

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

        return result.map((row: any) => this.toDomain(row, toIncludePassword));
    }

    async findByEmail(email: string, toIncludePassword = false): Promise<User> {
        const result = await this.pg.client
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        const user = result.length > 0 ? result[0] : null;

        if (!user) {
            throw new ClientError(
                "User doesn't exist", 
                HttpClientError.NotFound
            );
        }

        return this.toDomain(user, toIncludePassword);
    }
    
    async findByEmailAndRoleId(
        email: string,
        roleId: string,
        toIncludePassword = false
    ): Promise<User> {

        const result = await this.pg.client
            .select()
            .from(usersTable)
            .where(
                and(
                    eq(usersTable.email, email),
                    eq(usersTable.roleId, roleId)
                )
            );

        const user = result.length > 0 ? result[0] : null;
    
        if (!user) {
            throw new ClientError(
                `User having email ${email} with asked role doesn't exist`, 
                HttpClientError.NotFound
            );
        }
    
        return this.toDomain(user, toIncludePassword);
    }

    async updateById(
        id: string, 
        updates: Partial<NewUser>,
        toIncludePassword = false
    ): Promise<User> {
        
        const [updated] = await this.pg.client
            .update(usersTable)
            .set(updates)
            .where(eq(usersTable.id, id))
            .returning();

        if (!updated) {
            throw new ClientError(
                `User with id ${id} not found.`,
                HttpClientError.NotFound
            );
        }

        return this.toDomain(updated, toIncludePassword);
    }

    async deleteById(id: string, toIncludePassword = false): Promise<User> {
        const [ deleted ] = await this.pg.client
            .delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning();

        if (!deleted) {
            throw new ClientError(
                "User doesn't exist", 
                HttpClientError.NotFound
            );
        }

        return this.toDomain(deleted, toIncludePassword);
    }
}
