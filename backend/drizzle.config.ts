import "dotenv/config";
import { configs } from "@configs";
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: configs.DATABASE_URL,
    },
});
