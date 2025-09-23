import { Router } from "express";
import { authRouter } from "./auth";
import { usersRouter } from "./user";
import { storesRouter } from "./stores/store";


export const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", usersRouter);
v1Router.use("/stores", storesRouter);