import { ClientError } from "@errors/error-classes/client-error";
import { HttpClientError, HttpServerError } from "@libs/http-response-codes";
import type { IAuthTokenHandlers } from "@ports/auth/IAuthTokenHandlers";
import type { IHasher } from "@ports/security/IHasher";
import type { IRolesRepository } from "@ports/repos/IRolesRepository";
import type { IUserRepository } from "@ports/repos/IUserRepository";
import type { LoginUserRequestDto } from "@schemas/user";
import type { JWTPayload } from "jose";
import type { USER_ROLES, UserModel } from "src/db/schema";
import { logger } from "src/tasks/file-logger";
import type { IMemDB } from "@ports/db/IMemDB";
import { ServerError } from "@errors/error-classes/server-error";
import { logoutMemDBKey } from "@libs/utils";
import type { AllClaims } from "@adapters/auth-token/jwt";

export type UserLoginClaims = {
    userId: UserModel["id"],
    email: UserModel["email"],
    roleId: UserModel["roleId"],
    roleName: typeof USER_ROLES[number]
}

export class AuthenticationService {

    constructor(
        private readonly userRepo: IUserRepository,
        private readonly roleRepo: IRolesRepository,
        private readonly passwordHasher: IHasher,
        private readonly cryptoHasher: IHasher,
        private readonly memDb: IMemDB,
        private readonly authTokenHandler: IAuthTokenHandlers<JWTPayload, UserLoginClaims>
    ) {};

    async login(
        creds: LoginUserRequestDto
    ): Promise<{token: string, claims: UserLoginClaims}> {

        try {
            const role = await this.roleRepo.findRoleByName(creds.role);
    
            const user = await this.userRepo.findByEmailAndRoleId(
                creds.email,
                role.id,
                true
            );
            
            const isSame = await this.passwordHasher.verify(
                creds.password, 
                user.hashedPassword!
            );

            if(!isSame) {
                throw new Error("Password verification failed");
            }

            const token = await this.authTokenHandler.sign({
                email: creds.email,
                userId: user.id,
                roleId: user.roleId,
                roleName: creds.role,
            });

            return {
                token,
                claims: {
                    email: creds.email,
                    roleId: user.roleId,
                    roleName: creds.role,
                    userId: user.id
                }
            }
        } catch(err: unknown) {

            /**
             * Internal logs.
            */
            if(err instanceof ClientError && err.statusCode === 404) {
                logger.warn(
                    `User not found: email='${creds.email}', \
                    role='${creds.role}', reason=${err.message}`
                );
            } else {
                logger.warn(
                    `Login failed: email='${creds.email}', \
                    role='${creds.role}', reason=${err instanceof Error ? err.message : err}`
                );
            }

            throw new ClientError(
                "Bad login credential",
                HttpClientError.Unauthorized
            );
        }
    }

    async validateToken(
        jwtToken: string
    ) {
        try {
            const claims = await this.authTokenHandler.verify(jwtToken);

            const tokenHash = await this.cryptoHasher.hash(jwtToken);

            const isLoggedOut = await this.memDb.get<boolean>(logoutMemDBKey(tokenHash));

            if(isLoggedOut) {
                logger.warn("User trying to use blacklisted jwt", { userId: claims.userId })
                
                throw new ClientError(
                    "User has already been logged out.",
                    HttpClientError.Unauthorized
                )
            }

            return claims;
        } catch(err: unknown) {
            if(err instanceof ClientError || err instanceof ServerError) {
                throw err;
            }

            if(err instanceof Error) {
                logger.error(err.message, { jwtToken });
            }
    
            throw new ServerError(
                "Something went wrong while validating token",
                HttpServerError.InternalServerError
            );
        }
    }

    async logout(
        jwtToken: string
    ) {
        try {
            const claims = await this.authTokenHandler.decode(jwtToken);
            const ttl = claims.exp! - Math.floor(Date.now() / 1000);
            const tokenHash = await this.cryptoHasher.hash(jwtToken);
            
            await this.memDb.set(logoutMemDBKey(tokenHash), jwtToken, ttl);
        } catch(err: unknown) {

            if(err instanceof Error) {
                logger.error(err.message, { jwtToken });
            }

            throw new ServerError(
                "Something went wrong while logout process.",
                HttpServerError.InternalServerError
            );
        }
    }
}