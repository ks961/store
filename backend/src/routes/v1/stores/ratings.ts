import { StoreRatingController } from "@controllers/store-rating";
import { isAuthenticated } from "@middlewares/is-authenticated";
import { requireAccessToken } from "@middlewares/require-access-token";
import { validateRequest } from "@middlewares/validate-request";
import { CreateStoreRatingSchema, UpdateStoreRatingParamSchema } from "@schemas/store-rating";
import { Router } from "express";


export const storeRatingsRouter = Router({ mergeParams: true });

storeRatingsRouter.get("/", [
    StoreRatingController.getStoreRating
]);

storeRatingsRouter.get("/me", [
    requireAccessToken,
    isAuthenticated,
    StoreRatingController.getStoreRatingForNormalUser
]);

storeRatingsRouter.post("/", [
    requireAccessToken,
    isAuthenticated,
    validateRequest({
        body: CreateStoreRatingSchema.pick({ rating: true }).required(),
    }),
    StoreRatingController.submitRating
]);

storeRatingsRouter.patch("/:storeRatingId", [
    requireAccessToken,
    isAuthenticated,
    validateRequest({
        params: UpdateStoreRatingParamSchema as any,
        body: CreateStoreRatingSchema.pick({ rating: true }).required(),
    }),
    StoreRatingController.updateStoreRating
]);

storeRatingsRouter.delete("/:storeRatingId", [
    requireAccessToken,
    isAuthenticated,
    validateRequest({
        params: UpdateStoreRatingParamSchema,
    }),
    StoreRatingController.deleteStoreRating
]);