import type { PgDatabase } from "@db/pg-database";
import { rolePermissionsTable, type RolePermissionModel } from "@db/schema";
import { RolePermission } from "@domains/entities/role-permission";
import { ServerError } from "@errors/error-classes/server-error";
import { HttpServerError } from "@libs/http-response-codes";
import type { IDomainTransformer } from "@ports/domain/IDomainTransformer";
import type { IRolePermissionRepository } from "@ports/repos/IRolePermissionRepository";
import { eq } from "drizzle-orm";


export class PostgresRolePermission implements 
    IRolePermissionRepository, IDomainTransformer<RolePermissionModel, RolePermission> {

    constructor(
        private readonly db: PgDatabase
    ) {}

    toDomain(model: RolePermissionModel): RolePermission {
        return new RolePermission(
            model.roleId,
            model.permissionId,
            model.permission
        );
    }

    async findPermissionsByRoleId(roleId: string): Promise<RolePermission[]> {
        const result = await this.db.client
            .select()
            .from(rolePermissionsTable) 
            .where(eq(rolePermissionsTable.roleId, roleId));
            
        return result.map(row => this.toDomain(row));
    }


    async createPermission(
        roleId: string,
        permissionName: string
    ) {
        const [ row ] = await this.db.client
            .insert(rolePermissionsTable)
            .values({ permission: permissionName, roleId })
            .returning();

        if(!row) {
            throw new ServerError(
                "Failed to create permission",
                HttpServerError.InternalServerError
            );
        }
        
        return this.toDomain(row);
    }
}