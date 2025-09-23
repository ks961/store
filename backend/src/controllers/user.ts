import type { AllClaims } from "@adapters/auth-token/jwt";
import type { User } from "@domains/entities/user";
import { ClientError } from "@errors/error-classes/client-error";
import { HttpClientError } from "@libs/http-response-codes";
import type { AdminDashboardResponseDto, CreateUserByAdminResponseDto, CreateUserRequestDto, FilterUserResponseDto, StoreOwnerDashboardResponseDto } from "@schemas/user";
import type { UserLoginClaims } from "@services/authentication";
import { AuthorizationService } from "@services/authorization";
import { UserService } from "@services/user";
import { container } from "@tasks/container";
import type { SuccessResponse } from "@types";
import type { Request, Response } from "express";
import { tr } from "zod/locales";


export class UserController {


    static async getUsersBy(
        req: Request,
        res: Response
    ) {

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;
        
        const authzSvc = container.resolve(AuthorizationService);
        
        const isSysAdmin = await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR");
        
        if(!isSysAdmin) {
            throw new ClientError(
                "Not allowed access this resource",
                HttpClientError.Forbidden
            );
        }

        const filters = req.query as any;

        const userSvc = container.resolve(UserService);
        const users = await userSvc.getUsers(filters);
        
        const response: FilterUserResponseDto = {
            success: true,
            data: users
        }

        res.json(response);
    }

    static async createUser(
        req: Request,
        res: Response
    ) {
        const claims = (req as any).claims as AllClaims<UserLoginClaims>;
        
        const authzSvc = container.resolve(AuthorizationService);
        const isSysAdmin = await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR");
        
        if(!isSysAdmin) {
            throw new ClientError(
                "Not allowed access this resource",
                HttpClientError.Forbidden
            );
        }

        const user = req.body as CreateUserRequestDto;

        const userSvc = container.resolve(UserService);
        const newUser = await userSvc.create(user);
        
        const response: CreateUserByAdminResponseDto = {
            success: true,
            data: newUser
        }
        
        res.json(response);
    }

    static async getUserProfile(
        req: Request,
        res: Response
    ) {
        const requestedUserId = req.params.id!;
        const claims = (req as any).claims as AllClaims<UserLoginClaims>;

        const authzSvc = container.resolve(AuthorizationService);
        const isSysAdmin = await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR");
        
        if(!isSysAdmin && requestedUserId !== claims.userId) {
            throw new ClientError(
                "Not allowed access this resource",
                HttpClientError.Forbidden
            );
        }

        const userSvc = container.resolve(UserService);

        const user = await userSvc.getUserById(requestedUserId);

        const response: SuccessResponse<User> = {
            success: true,
            data: user
        }

        return res.json(response);
    }
    
    
    static async updateUser(
        req: Request,
        res: Response
    ) {
        
        const updateBody = req.body;
        const requestedUserId = req.params.id!;

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;
    
        const authzSvc = container.resolve(AuthorizationService);
        const isSysAdmin = await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR");
                
        if(!isSysAdmin && requestedUserId !== claims.userId) {
            throw new ClientError(
                "Not allowed access this resource",
                HttpClientError.Forbidden
            );
        }

        const userSvc = container.resolve(UserService);
    
        const user = await userSvc.updateUserById(
            requestedUserId,
            updateBody
        );
        
        const response: SuccessResponse<User> = {
            success: true,
            data: user
        }

        return res.json(response);
    }
    
    static async deleteUser(
        req: Request,
        res: Response
    ) {
        
        const requestedUserId = req.params.id!;

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;
    
        const authzSvc = container.resolve(AuthorizationService);
        const isSysAdmin = await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR");
        
        if(!isSysAdmin && requestedUserId !== claims.userId) {
            throw new ClientError(
                "Not allowed access this resource",
                HttpClientError.Forbidden
            );
        }

        const userSvc = container.resolve(UserService);
    
        const user = await userSvc.deleteUserById(requestedUserId)
        
        const response: SuccessResponse<User> = {
            success: true,
            data: user
        }

        return res.json(response);
    }

    static async dashboard(
        req: Request,
        res: Response
    ) {
        const claims = (req as any).claims as AllClaims<UserLoginClaims>;
    
        const authzSvc = container.resolve(AuthorizationService);
        
        const userSvc = container.resolve(UserService);
        if(await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR")) {
            const dashboard = await userSvc.getAdminDashboard();
            const response: SuccessResponse<AdminDashboardResponseDto> = {
                success: true,
                data: dashboard
            }

            return res.json(response);
        }
        
        if(await authzSvc.hasRole(claims.userId, "STORE_OWNER")) {
            const dashboard = await userSvc.getStoreOwnerDashboard(claims.userId);
            const response: SuccessResponse<StoreOwnerDashboardResponseDto> = {
                success: true,
                data: dashboard
            }
    
            return res.json(response);
        }
        
        throw new ClientError(
            "Not allowed access this resource",
            HttpClientError.Forbidden
        );
    }

}