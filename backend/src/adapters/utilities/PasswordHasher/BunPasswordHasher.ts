import type { IHasher } from "@ports/security/IHasher";

export class BunPasswordHasher implements IHasher {

    hash(password: string): Promise<string> {
        return Bun.password.hash(password);
    }

    verify(password: string, hash: string): Promise<boolean> {
        return Bun.password.verify(password, hash);
    }
}