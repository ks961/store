import type { IHasher } from "@ports/security/IHasher";

export class CryptoHasher implements IHasher {
    constructor(
        private readonly hasher: IHasher
    ) {}
    
    async hash(text: string): Promise<string> {
        return this.hasher.hash(text);
    }

    async verify(text: string, hash: string): Promise<boolean> {
        return this.hasher.verify(text, hash);
    }
}