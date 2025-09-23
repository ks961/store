


export interface IAuthTokenHandlers<Claims, CustomClaim> {
    sign(claims: CustomClaim): Promise<string>,
    decode(token: string): Promise<Claims & CustomClaim>,
    verify(token: string): Promise<Claims & CustomClaim> 
}