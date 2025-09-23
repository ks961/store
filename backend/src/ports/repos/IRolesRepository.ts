import type { Role } from "@domains/entities/role";
import type { NewRole } from "src/db/schema";

export interface IRolesRepository {
    findById(roleId: string): Promise<Role>,
    createRole(newRole: NewRole): Promise<Role>,
    findRoleByName(name: string): Promise<Role>,
    delete(id: string): Promise<Role>
}