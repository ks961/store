import type { IHasher } from "@ports/security/IHasher";


export class PasswordHasher implements IHasher {
    
    constructor(
        private readonly hasher: IHasher
    ) {};

    hash(password: string): Promise<string> {
        return this.hasher.hash(password)
    }

    verify(password: string, hash: string): Promise<boolean> {
        return this.hasher.verify(password, hash)
    }

}