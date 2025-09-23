import type { IMemDB } from "@ports/db/IMemDB";


export class MemDB implements IMemDB {
    
    constructor(
        private readonly memdb: IMemDB
    ){};

    async get<T>(key: string): Promise<T | null> {
        return this.memdb.get(key);
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        await this.memdb.set(key, value, ttlSeconds); 
    }

    async delete(key: string): Promise<boolean> {
        return this.memdb.delete(key);
    }
    
    async has(key: string): Promise<boolean> {
        return this.memdb.has(key);
    }
}