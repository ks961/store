import type { AllClaims } from "@adapters/auth-token/jwt";
import type { StoreRating } from "@domains/entities/store-rating";
import { ClientError } from "@errors/error-classes/client-error";
import { HttpClientError } from "@libs/http-response-codes";
import type { UserLoginClaims } from "@services/authentication";
import { AuthorizationService } from "@services/authorization";
import { StoreRatingService } from "@services/store-rating";
import { container } from "@tasks/container";
import type { SuccessResponse } from "@types";
import { response, type Request, type Response } from "express";


export class StoreRatingController {


    static async getStoreRating(
        req: Request,
        res: Response
    ) {
        const storeId = req.params.id!;

        const storeRatingSvc = container.resolve(StoreRatingService);
        const rating = await storeRatingSvc.getStoreRatingByStoreId(storeId);
        
        const reponse: SuccessResponse<StoreRating> = {
            success: true,
            data: rating
        }

        res.json(response);
    }

    static async getStoreRatingForNormalUser(
        req: Request,
        res: Response
    ) {
        const storeId = req.params.id!;

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;

        const authzSvc = container.resolve(AuthorizationService);
        const isNormalUser = await authzSvc.hasRole(claims.userId, "NORMAL_USER");

        if(!isNormalUser) {
            throw new ClientError(
                "Not allowed to access this resource",
                HttpClientError.Forbidden
            );
        }

        const storeRatingSvc = container.resolve(StoreRatingService);

        const rating = await storeRatingSvc.getStoreRatingByUserId(
            claims.userId,
            storeId
        );
        
        const reponse: SuccessResponse<StoreRating> = {
            success: true,
            data: rating
        }

        res.json(response);
    }

    static async submitRating(
        req: Request,
        res: Response
    ) {
        const storeId = req.params.id!;

        const ratingsBody = req.body;

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;

        const authzSvc = container.resolve(AuthorizationService);

        const isSysAdmin = await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR");
        const isNormalUser = await authzSvc.hasRole(claims.userId, "NORMAL_USER");

        if (!isSysAdmin && !isNormalUser) {
            throw new ClientError(
                "Not allowed to access this resource",
                HttpClientError.Forbidden
            );
        }

        const storeRatingSvc = container.resolve(StoreRatingService);

        const storeRating = await storeRatingSvc.create({
            storeId,
            userId: claims.userId,
            rating: ratingsBody.rating
        });

        const reponse: SuccessResponse<StoreRating> = {
            success: true,
            data: storeRating
        }

        res.json(response);
    }

    static async updateStoreRating(
        req: Request,
        res: Response
    ) {

        const storeId = req.params.id!;
        const storeRatingId = req.params.storeRatingId!;

        const ratingsBody = req.body;

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;
        
        const storeRatingSvc = container.resolve(StoreRatingService);

        const storeRating = await storeRatingSvc.updateStoreRatingByUserId(
            claims.userId,
            storeId,
            storeRatingId,
            ratingsBody
        );

        const reponse: SuccessResponse<StoreRating> = {
            success: true,
            data: storeRating
        }

        res.json(response);
    }

    static async deleteStoreRating(
        req: Request,
        res: Response
    ) {
        const ratingId = req.params.ratingId!;

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;
       
        const authzSvc = container.resolve(AuthorizationService);
        const isNormalUser = await authzSvc.hasRole(claims.userId, "NORMAL_USER");
        const isSysAdmin = await authzSvc.hasRole(claims.userId, "SYSTEM_ADMINISTRATOR");
        
        if(
            !isNormalUser || !isSysAdmin
        ) {
            throw new ClientError(
                "Not allowed to access this resource.",
                HttpClientError.Forbidden
            );
        }
        
        const storeRatingSvc = container.resolve(StoreRatingService);

        const storeRating = await storeRatingSvc.deleteStoreRating(ratingId);

        const reponse: SuccessResponse<StoreRating> = {
            success: true,
            data: storeRating
        }

        res.json(response);
    }
}