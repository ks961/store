import { PgDatabase } from "@db/pg-database";
import { configs } from "@configs";
import { Task } from "@libs/lifecycle-manager";


export let database: PgDatabase | null = null;
export const db = new Task(
    "Pg Database",
    () => {
        database = new PgDatabase(
            configs.DATABASE_URL
        );
    },
    async() => {
        if(!database) {
            throw new Error(
                "Database instance not running."
            );
        }
        await database.close();
    }
)