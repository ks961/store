import type { IAuthTokenHandlers } from "@ports/auth/IAuthTokenHandlers";


export class AuthToken<Claim, CustomClaim> implements IAuthTokenHandlers<Claim, CustomClaim> {

    constructor(
        private readonly authToken: IAuthTokenHandlers<Claim, CustomClaim>,
    ) {};

    sign(claims: CustomClaim): Promise<string> {
        return this.authToken.sign(claims);
    }

    decode(token: string): Promise<Claim & CustomClaim> {
        return this.authToken.decode(token);
    }

    verify(token: string): Promise<Claim & CustomClaim> {
        return this.authToken.verify(token);
    }

} 