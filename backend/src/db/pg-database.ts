import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import type { IDatabase } from "@ports/db/IDatabase";



export class PgDatabase implements IDatabase<ReturnType<typeof drizzle>> {

    private pool: Pool;
    private db: ReturnType<typeof drizzle>;

    constructor(
        connectionString: string
    ) {
        if (!connectionString) {
            throw new Error("DATABASE_URL is not defined");
        }

        this.pool = new Pool({
            connectionString
        });

        this.db = drizzle({ client: this.pool });
    }

    public get client() {
        return this.db;
    }

    public async close(): Promise<void> {
        await this.pool.end();
    }
}