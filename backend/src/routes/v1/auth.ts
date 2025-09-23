import { Router } from "express";
import { AuthController } from "@controllers/auth";
import { validateRequest } from "@middlewares/validate-request";
import { CreateUserSchema, LoginUserSchema } from "@schemas/user";
import { requireAccessToken } from "@middlewares/require-access-token";
import { isAuthenticated } from "@middlewares/is-authenticated";


export const authRouter = Router();

authRouter.post("/signup", [
    validateRequest({
        body: CreateUserSchema
    }),
    AuthController.signup
]);

authRouter.post("/login", [
    validateRequest({
        body: LoginUserSchema
    }),
    AuthController.login
]);

authRouter.post("/validate", [
    requireAccessToken,
    AuthController.validate
]);

authRouter.post("/logout", [
    requireAccessToken,
    AuthController.logout
]);

authRouter.get("/me", [
    requireAccessToken,
    isAuthenticated,
    AuthController.getProfile
]);