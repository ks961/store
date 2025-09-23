import type { AdminDashboardResponseDto, CreateUserRequestDto, FilterUserRequestDto, StoreOwnerDashboardResponseDto } from "@schemas/user";
import type { IUserRepository } from "@ports/repos/IUserRepository";
import { container } from "src/tasks/container";
import type { IRolesRepository } from "@ports/repos/IRolesRepository";
import { PasswordHasher } from "@adapters/utilities/PasswordHasher";
import { ClientError } from "@errors/error-classes/client-error";
import { HttpClientError, HttpServerError } from "@libs/http-response-codes";
import type { NewUser, StoreModel, UserModel } from "@db/schema";
import type { Role } from "@domains/entities/role";
import type { IStoreRepository } from "@ports/repos/IStoreRepository";
import type { IStoreRatingRepository } from "@ports/repos/IStoreRatingRepository";
import { logger } from "@tasks/file-logger";
import { ServerError } from "@errors/error-classes/server-error";
import type { User } from "@domains/entities/user";


export class UserService {
    
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly roleRepo: IRolesRepository,
        private readonly storeRepo: IStoreRepository,
        private readonly storeRatingRepo: IStoreRatingRepository,
    ) {};
    
    async create(
        newUser: CreateUserRequestDto
    ) {

        const newUserRole = await this.roleRepo.findRoleByName(newUser.role);
        try {
            const user = await this.userRepo.findByEmail(newUser.email);

            if(newUserRole.id === user.roleId) {
                throw new ClientError(
                    `User with email '${user.email}' and role: '${newUser.role}' already exists.`,
                    HttpClientError.Conflict
                );
            }
        } catch(err: unknown) {
            /**
             * Note:
             * Only suppress the error if it's a 404 from 'findByEmail' method; 
             * all other errors are re-thrown. If a 404 occurs, 
             * we proceed to create a new user.
             *  */ 
            if (!(
                err instanceof ClientError && 
                err.statusCode === HttpClientError.NotFound.statusCode
            )) {
                throw err;
            }
        }

        const pHasher = container.resolve(PasswordHasher);
        const hashedPassword = await pHasher.hash(newUser.password);



        return this.userRepo.createUser({
            name: newUser.name,
            email: newUser.email,
            address: newUser.address,
            roleId: newUserRole.id,
            hashedPassword 
        });
    }

    async getUserById(
        id: UserModel["id"],
    ) {
        return this.userRepo.findById(id);
    }

    async getUserByEmail(
        email: UserModel["email"],
        roleId: UserModel["roleId"]
    ) {
        return this.userRepo.findByEmailAndRoleId(
            email,
            roleId
        );
    }

    async getUsers(
        filters: FilterUserRequestDto
    ) {
        let role: Role | null = null;

        if(filters.roleName) {
            role = await this.roleRepo.findRoleByName(filters.roleName);
        }

        const users = await this.userRepo.findUsersByColumns({
            name: filters?.name,
            email: filters?.email,
            address: filters?.address,
            id: filters?.id,
            roleId: role?.id
        });

        const promises = users.map(user => this.roleRepo.findById(user.roleId));
        try {
            const roles = await Promise.all(promises);
            const roleMap = new Map(roles.map(r => [r.id, r.name]));
            const usersWithRoleName = users.map(user => ({
                ...user,
                roleName: roleMap.get(user.roleId) ?? null
            }));

            return usersWithRoleName;
        } catch {
            throw new ServerError(
                "Something went wrong",
                HttpServerError.InternalServerError
            );
        }
    }

    async updateUserById(
        userId: UserModel["id"],
        user: Partial<CreateUserRequestDto>
    ) {
        
        if(user.password) {
            const pHasher = container.resolve(PasswordHasher);
            const hashedPassword = await pHasher.hash(user.password);
            (user as any).hashedPassword = hashedPassword;
            user.password = undefined;
        }

        return this.userRepo.updateById(
            userId,
            user
        );
    }

    async deleteUserById(
        userId: UserModel["id"],
    ) {
        return this.userRepo.deleteById(userId);
    }
    

    async getAdminDashboard(): Promise<AdminDashboardResponseDto> {
        const usersCount = await this.userRepo.getSize();
        const storesCount = await this.storeRepo.getSize();
        const storeRatingCount = await this.storeRatingRepo.getSize();

        return {
            totalUsers: usersCount,
            totalStores: storesCount,
            totalRatings: storeRatingCount
        }
    }

    async getStoreOwnerDashboard(
        userId: StoreModel["id"]
    ): Promise<StoreOwnerDashboardResponseDto> {
        const stores = await this.storeRepo.findStoresByColName(
            "ownerId",
            userId
        );

        const storeRatingsPromise = stores.map(store => this.storeRatingRepo.findStoreByColName(
            "storeId",
            store.id
        ));

        try {
            const storeRatings = await Promise.all(storeRatingsPromise);
    
            const avgRating = storeRatings.reduce((acc, sRate) => {
                acc += sRate?.rating ?? 0
                return acc;
            }, 0);
    
            return {
                stores,
                averageRating: avgRating
            }
        } catch(err: unknown) {
            logger.error("Error occured while getting store owner dashboard data", { error: err });

            throw new ServerError(
                "Something went wrong!",
                HttpServerError.InternalServerError
            );
        }
        
    }
}