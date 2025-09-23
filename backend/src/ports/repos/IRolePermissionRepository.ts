import type { RolePermission } from "@domains/entities/role-permission";


export interface IRolePermissionRepository {
    findPermissionsByRoleId(roleId: string): Promise<RolePermission[]>,
    createPermission(roleId: string, permissionName: string): Promise<RolePermission>
}