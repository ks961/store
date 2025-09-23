import type { IHasher } from "@ports/security/IHasher";

export class BunSha256 implements IHasher {

    async hash(value: string): Promise<string> {
        const hasher = new Bun.CryptoHasher("sha256");
        hasher.update(new TextEncoder().encode(value));
        return hasher.digest("hex");
    }

    async verify(value: string, hash: string): Promise<boolean> {
        const valueHash = await this.hash(value);
        return valueHash === hash;
    }
}