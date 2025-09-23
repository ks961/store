import { UserController } from "@controllers/user";
import { isAuthenticated } from "@middlewares/is-authenticated";
import { requireAccessToken } from "@middlewares/require-access-token";
import { validateRequest } from "@middlewares/validate-request";
import { CreateUserSchema, FilterUsersSchema } from "@schemas/user";
import { Router } from "express";
import z from "zod";

export const usersRouter = Router();

usersRouter.get("/", [
    requireAccessToken,
    isAuthenticated,
    validateRequest({
        query: FilterUsersSchema
    }),
    UserController.getUsersBy
]);

usersRouter.get("/dashboard", [
    requireAccessToken,
    isAuthenticated,
    UserController.dashboard
]);

usersRouter.post("/", [
    requireAccessToken,
    isAuthenticated,
    validateRequest({
        body: CreateUserSchema
    }),
    UserController.createUser
]);

usersRouter.get("/:id", [
    requireAccessToken,
    isAuthenticated,
    validateRequest({
        params: FilterUsersSchema.pick({ id: true })
    }),
    UserController.getUserProfile
]);

usersRouter.patch("/:id", [
    requireAccessToken,
    isAuthenticated,
    validateRequest({
        params: FilterUsersSchema.pick({ id: true }) as any,
        body: z.intersection(
            FilterUsersSchema.omit({ id: true, roleName: true }),
            CreateUserSchema.pick({ password: true })
        )
    }),
    UserController.updateUser
]);

usersRouter.delete("/:id", [
    requireAccessToken,
    isAuthenticated,
    validateRequest({
        params: FilterUsersSchema.pick({ id: true }),
    }),
    UserController.deleteUser
]);
