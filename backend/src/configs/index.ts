import { assertInvalid, makeReadonly } from "@libs/utils";


export const configs = makeReadonly({
    get PORT() {
        const port = process.env.PORT;
        assertInvalid(port, "PORT not found.");
        return Number(port);
    },
    get APP_NAME() {
        const name = process.env.APP_NAME;
        assertInvalid(name, "APP_NAME not found.");
        return name;
    },
    get BUN_ENV() {
        const env = process.env.BUN_ENV;
        assertInvalid(env, "BUN_ENV not found.");
        return env;
    },
    get REDIS_URI() {
        const url = process.env.REDIS_URI;
        assertInvalid(url, "REDIS_URI not found.");
        return url;
    },
    get DATABASE_URL() {
        const url = process.env.DATABASE_URL;
        assertInvalid(url, "DATABASE_URL not found.");
        return url;
    },
    get ACCESS_TOKEN_EXP() {
        const exp = process.env.ACCESS_TOKEN_EXP;
        assertInvalid(exp, "ACCESS_TOKEN_EXP not found.");
        return Number(exp);
    },
    get JWT_SECRET() {
        const secret = process.env.JWT_SECRET;
        assertInvalid(secret, "JWT_SECRET not found.");
        return secret;
    },
    get ACCESS_TOKEN_COOKIE_TAG() {
        const tag = process.env.ACCESS_TOKEN_COOKIE_TAG;
        assertInvalid(tag, "ACCESS_TOKEN_COOKIE_TAG not found.");
        return tag;
    },
})