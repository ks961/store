import { RedisClient } from "bun";
import type { IMemDB } from "@ports/db/IMemDB";


export class BunRedis implements IMemDB {

    constructor(
        private readonly client: RedisClient
    ) {};

    async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        if (!data) return null;
        try {
            return JSON.parse(data) as T;
        } catch {
            return null;
        }
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        await this.client.set(key, stringValue);
        
        if (ttlSeconds) {
            await this.client.expire(key, ttlSeconds);
        }
    }

    async delete(key: string): Promise<boolean> {
        return (await this.client.del(key) === 1);
    }

    async has(key: string): Promise<boolean> {
        return this.client.exists(key);
    }
}