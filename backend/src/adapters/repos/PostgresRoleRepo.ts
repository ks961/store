import { eq } from "drizzle-orm";
import type { PgDatabase } from "@db/pg-database";
import { Role } from "@domains/entities/role";
import { ClientError } from "@errors/error-classes/client-error";
import { HttpClientError } from "@libs/http-response-codes";
import type { IDomainTransformer } from "@ports/domain/IDomainTransformer";
import type { IRolesRepository } from "@ports/repos/IRolesRepository";
import { rolesTable, type NewRole, type RoleModel } from "src/db/schema";


export class PostgresRoleRepo implements 
    IRolesRepository, IDomainTransformer<RoleModel, Role> {

    constructor(
        private readonly pg: PgDatabase
    ) {};

    async findById(roleId: string): Promise<Role> {

        const result = await this.pg.client
            .select()
            .from(rolesTable)
            .where(eq(rolesTable.roleId, roleId));

        const role = result.length > 0 ? result[0] : null;

        if (!role) {
            throw new ClientError(
                `Role having id: '${roleId}' doesn't exist`, 
                HttpClientError.NotFound
            );
        }

        return this.toDomain(role);
    }
    
    async findRoleByName(name: string): Promise<Role> {
        const result = await this.pg.client
            .select()
            .from(rolesTable)
            .where(eq(rolesTable.roleName, name));
    
        const role = result.length > 0 ? result[0] : null;
    
        if (!role) {
            throw new ClientError(
                `Role having name: '${name}' doesn't exist`, 
                HttpClientError.NotFound
            );
        }
    
        return this.toDomain(role);
    }

    async createRole(newRole: NewRole): Promise<Role> {

        const [ inserted ] = await this.pg.client
            .insert(rolesTable)
            .values({
                roleName: newRole.roleName
            }).returning();

        if (!inserted) {
            throw new ClientError(
                "Failed to create new role.", 
                HttpClientError.BadRequest
            );
        }

        return this.toDomain(inserted);
    }

    async delete(roleId: string): Promise<Role> {
        const [ deleted ] = await this.pg.client
            .delete(rolesTable)
            .where(eq(rolesTable.roleId, roleId))
            .returning();

        if (!deleted) {
            throw new ClientError(
                `Role having id '${roleId}' doesn't exist`, 
                HttpClientError.NotFound
            );
        }

        return this.toDomain(deleted);
    }

    toDomain(role: RoleModel): Role {
        return new Role(
            role.roleId,
            role.roleName
        );
    }
}