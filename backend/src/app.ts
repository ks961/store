import express from "express";
import { v1Router } from "@routes/v1";
import { reqResLogger } from "@middlewares/req-res-logger";
import { defaultErrorHandler } from "@errors/error-handlers/default-error-handler";
import cookieParser from "cookie-parser";
import cors from "cors";
import { FRONTEND } from "@configs/frontend";

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000"
    ],
    credentials: true,
    methods: [
        'GET', 'POST', 
        'PUT', 'DELETE', 
        'PATCH'
    ],
}));

app.use(express.json());
app.use(cookieParser());

app.use("/v1", [
    reqResLogger,
    v1Router
]);

app.use(defaultErrorHandler);

export default app;