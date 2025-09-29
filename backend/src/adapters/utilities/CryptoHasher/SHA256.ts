import type { IHasher } from "@ports/security/IHasher";
import { container } from "@tasks/container";

export class BunSha256 implements IHasher {

    async hash(value: string): Promise<string> {
        const hasher = new Bun.CryptoHasher("sha256");
        const encoder = container.resolve(TextEncoder)
        hasher.update(encoder.encode(value));
        return hasher.digest("hex");
    }

    async verify(value: string, hash: string): Promise<boolean> {
        const valueHash = await this.hash(value);
        return valueHash === hash;
    }
}