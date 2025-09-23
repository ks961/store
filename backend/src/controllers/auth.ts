import { configs } from "@configs";
import { UserService } from "@services/user";
import { container } from "src/tasks/container";
import type { Request, Response } from "express";
import { HttpClientError } from "@libs/http-response-codes";
import { AuthenticationService, type UserLoginClaims } from "@services/authentication";
import { ClientError } from "@errors/error-classes/client-error";
import type { AuthUserProfileResponseDto, CreateUserRequestDto, CreateUserResponseDto, LoginUserReponseDto, LoginUserRequestDto, LogoutUserReponseDto } from "@schemas/user";
import type { AllClaims } from "@adapters/auth-token/jwt";
import type { SuccessResponse } from "@types";

export class AuthController {
    
    static async signup(
        req: Request,
        res: Response
    ) {
        const user = req.body as CreateUserRequestDto;

        const userSvc = container.resolve(UserService);
        await userSvc.create(user);
        
        const response: CreateUserResponseDto = {
            success: true
        }
        
        res.json(response);
    }
    
    static async login(
        req: Request,
        res: Response
    ) {
        const creds = req.body as LoginUserRequestDto;

        const authSvc = container.resolve(AuthenticationService);
        const { token, claims } = await authSvc.login(creds);
        
        res.cookie(configs.ACCESS_TOKEN_COOKIE_TAG, token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: configs.ACCESS_TOKEN_EXP * 1000,
            path: '/'
        });

        const reponse: LoginUserReponseDto = {
            success: true,
            data: claims
        }

        res.json(reponse);
    }

    static async logout(
        req: Request,
        res: Response
    ) {
        const token = (req as any).accessToken as string;

        const authSvc = container.resolve(AuthenticationService);
        await authSvc.logout(token);

        res.clearCookie("access-token", { httpOnly: true });

        const reponse: LogoutUserReponseDto = {
            success: true
        }

        res.json(reponse);
    }

    static async getProfile(
        req: Request,
        res: Response
    ) {

        const claims = (req as any).claims as AllClaims<UserLoginClaims>;

        const userSvc = container.resolve(UserService);
        const user = await userSvc.getUserByEmail(claims.email, claims.roleId);
        
        const reponse: AuthUserProfileResponseDto = {
            success: true,
            data: user
        };

        res.json(reponse);
    }


    static async validate(
        req: Request,
        res: Response
    ) {
        const token = (req as any).accessToken as string;

        const authSvc = container.resolve(AuthenticationService);
        await authSvc.validateToken(token);
        
        const response: SuccessResponse<undefined> = {
            success: true
        }

        res.json(response);
    }
}