import type { AllClaims } from "@adapters/auth-token/jwt";
import type { Store } from "@domains/entities/store";
import { ClientError } from "@errors/error-classes/client-error";
import { ServerError } from "@errors/error-classes/server-error";
import { HttpClientError } from "@libs/http-response-codes";
import type { CreateStoreResponseDto } from "@schemas/store";
import type { UserLoginClaims } from "@services/authentication";
import { AuthorizationService } from "@services/authorization";
import { StoreService } from "@services/store";
import { container } from "@tasks/container";
import type { SuccessResponse } from "@types";
import type { Request, Response } from "express";


export class StoreController {

    static async getAllStores(
        req: Request,
        res: Response
    ) {
        const filters = req.query;

        const storeSvc = container.resolve(StoreService);
        const stores = await storeSvc.getAllStores(filters);
        
        const response: SuccessResponse<Store[]> = {
            success: true,
            data: stores
        }

        res.json(response);
    }

    static async getStore(
        req: Request,
        res: Response
    ) {
        const storeId = req.params.id!;

        const storeSvc = container.resolve(StoreService);
        const store = await storeSvc.getStoreById(storeId);
        
        const response: SuccessResponse<Store> = {
            success: true,
            data: store
        }

        res.json(response);
    }

    static async createStore(
        req: Request,
        res: Response
    ) {
        const store = req.body;

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;

        const authzSvc = container.resolve(AuthorizationService);
        const isSysAdmin = await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR");

        if(!isSysAdmin) {
            throw new ClientError(
                "Not allowed to access this resource.",
                HttpClientError.Forbidden
            );
        }
        
        const storeSvc = container.resolve(StoreService);
        const newStore = await storeSvc.create(store);
        
        const response: CreateStoreResponseDto = {
            success: true,
            data: newStore
        }

        res.json(response);
    }

    static async updateStore(
        req: Request,
        res: Response
    ) {

        const storeId = req.params.id!;

        const store = req.body;

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;

        const authzSvc = container.resolve(AuthorizationService);

        const isSysAdmin = await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR");
        const isStoreOwnerRole = await authzSvc.hasRole(claims.userId, "STORE_OWNER");

        if(!isSysAdmin && !isStoreOwnerRole) {
            throw new ClientError(
                "Not allowed to access this resource.",
                HttpClientError.Forbidden
            );
        }
        
        const storeSvc = container.resolve(StoreService);

        const updatedStore = await storeSvc.updateStoreById(
            storeId,
            store
        );
        
        const response: CreateStoreResponseDto = {
            success: true,
            data: updatedStore
        }

        res.json(response);
    }

    static async deleteStore(
        req: Request,
        res: Response
    ) {

        const storeId = req.params.id!;

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;

        const authzSvc = container.resolve(AuthorizationService);

        const isSysAdmin = await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR");

        if(!isSysAdmin) {
            throw new ClientError(
                "Not allowed to access this resource.",
                HttpClientError.Forbidden
            );
        }
        
        const storeSvc = container.resolve(StoreService);

        const deletedStore = await storeSvc.deleteStoreById(storeId);
        
        const response: CreateStoreResponseDto = {
            success: true,
            data: deletedStore
        }

        res.json(response);
    }

    static async listUsers(
        req: Request,
        res: Response
    ) {
        const claims = (req as any).claims as AllClaims<UserLoginClaims>;

        const authzSvc = container.resolve(AuthorizationService);

        const isStoreOwnerRole = await authzSvc.hasRole(claims.userId, "STORE_OWNER");

        if(!isStoreOwnerRole) {
            throw new ClientError(
                "Not allowed to access this resource.",
                HttpClientError.Forbidden
            );
        }

        const storeSvc = container.resolve(StoreService);
        const users = await storeSvc.listUserByOwnerId(claims.userId);
        
        const response: SuccessResponse<Awaited<ReturnType<typeof storeSvc.listUserByOwnerId>>> = {
            success: true,
            data: users
        }

        res.json(response);
    }
}