import * as jose from 'jose'
import { configs } from 'src/configs';
import type { IAuthTokenHandlers } from '@ports/auth/IAuthTokenHandlers';
import { ClientError } from '@errors/error-classes/client-error';
import { ServerError } from '@errors/error-classes/server-error';
import { HttpClientError, HttpServerError } from '@libs/http-response-codes';
import { logger } from '@tasks/file-logger';

export type AllClaims<CustomClaim> = jose.JWTPayload & CustomClaim;

export class Jwt<CustomClaim> implements IAuthTokenHandlers<jose.JWTPayload, CustomClaim> {

    constructor(
        private readonly secret: Uint8Array<ArrayBufferLike>
    ) {};

    async sign(claims: CustomClaim): Promise<string> {
        const jwt = await new jose.SignJWT({
            ...claims
        } as any)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(
            Math.floor(Date.now() / 1000) + configs.ACCESS_TOKEN_EXP
        )
        .setIssuedAt()
        .sign(this.secret);

        return jwt;
    }

    decode(token: string): Promise<AllClaims<CustomClaim>> {
        const claims = jose.decodeJwt(token) as unknown as (AllClaims<CustomClaim>);

        return Promise.resolve(claims);
    }
    
    async verify(token: string): Promise<AllClaims<CustomClaim>>  {

        try {
            const claims = await jose.jwtVerify(token, this.secret);
            return claims.payload as unknown as AllClaims<CustomClaim>;

        } catch (err: unknown) {
            switch (true) {

                case err instanceof jose.errors.JWTExpired:
                case err instanceof jose.errors.JWTClaimValidationFailed:
                case err instanceof jose.errors.JOSEError:
                    throw new ClientError(
                        "Invalid or expired access token",
                        HttpClientError.Unauthorized
                    );

                default:
                    if(err instanceof Error) {
                        logger.error("JWT verification failed:", {error: err.message});
                    }
                    throw new ServerError(
                        "Something went wrong while verifying the token.",
                        HttpServerError.InternalServerError
                    );
            }
        }
    }

}