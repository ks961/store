import { StoreController } from "@controllers/store";
import { isAuthenticated } from "@middlewares/is-authenticated";
import { requireAccessToken } from "@middlewares/require-access-token";
import { validateRequest } from "@middlewares/validate-request";
import { CreateStoreSchema, StoreIdSchema, UpdateStoreSchema } from "@schemas/store";
import { Router } from "express";
import { storeRatingsRouter } from "./ratings";

export const storesRouter = Router();

storesRouter.get("/", [
    StoreController.getAllStores
]);

storesRouter.get("/users", [
    requireAccessToken,
    isAuthenticated,
    StoreController.listUsers
]);

storesRouter.get("/:id", [
    validateRequest({
        params: StoreIdSchema
    }),
    StoreController.getStore
]);

storesRouter.post("/", [
    validateRequest({
        body: CreateStoreSchema
    }),
    requireAccessToken,
    isAuthenticated,
    StoreController.createStore
]);

storesRouter.patch("/:id", [
    validateRequest({
        params: StoreIdSchema as any,
        body: UpdateStoreSchema
    }),
    requireAccessToken,
    isAuthenticated,
    StoreController.updateStore
]);

storesRouter.delete("/:id", [
    validateRequest({
        params: StoreIdSchema,
    }),
    requireAccessToken,
    isAuthenticated,
    StoreController.deleteStore
]);

storesRouter.use("/:id/ratings", [
    validateRequest({
        params: StoreIdSchema,
    }),
    storeRatingsRouter
]);
