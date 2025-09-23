import type { IUserRepository } from "@ports/repos/IUserRepository";
import type { IRolesRepository } from "@ports/repos/IRolesRepository";
import type { IRolePermissionRepository } from "@ports/repos/IRolePermissionRepository";
import type { USER_ROLES } from "@db/schema";


export class AuthorizationService {

    constructor(
        private readonly userRepo: IUserRepository,
        private readonly roleRepo: IRolesRepository,
        private readonly rolePermissionRepo: IRolePermissionRepository
    ) {};

    async hasRole(userId: string, roleName: USER_ROLES): Promise<boolean> {
        const user = await this.userRepo.findById(userId);

        const role = await this.roleRepo.findById(user.roleId);
        return role.name === (roleName as unknown as string);
    }
    
    async hasPermission(userId: string, permissionName: string): Promise<boolean> {
        const user = await this.userRepo.findById(userId);
    
        const role = await this.roleRepo.findById(user.roleId);
        const permissions = await this.rolePermissionRepo.findPermissionsByRoleId(role.id);
        return permissions.some(perm => perm.permission === permissionName);
    }
}