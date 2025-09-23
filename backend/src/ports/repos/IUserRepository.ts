import { User } from "@domains/entities/user";
import type { ISizeProvider } from "@ports/utilities/ISizeProvider";
import type { NewUser, UserModel } from "src/db/schema";

export type FilterUser = Omit<UserModel, "hashedPassword">;

export interface IUserRepository extends ISizeProvider {
    findById(id: string, toIncludePassword?: boolean): Promise<User>,
    createUser(user: NewUser, toIncludePassword?: boolean): Promise<User>,
    findByEmail(email: string, toIncludePassword?: boolean): Promise<User>,
    deleteById(id: string, toIncludePassword?: boolean): Promise<User>,
    findUsersByColumns(
        filter: Partial<FilterUser>,
        toIncludePassword?: boolean,
        limit?: number,
    ): Promise<User[]>,
    updateById(id: string, user: Partial<NewUser>, toIncludePassword?: boolean): Promise<User>,
    findByEmailAndRoleId(email: string, roleId: string, toIncludePassword?: boolean): Promise<User>,
}