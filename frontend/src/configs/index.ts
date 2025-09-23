import { assertInvalid, makeReadonly } from "@/libs/utils";


export const configs = makeReadonly({

    get ACCESS_TOKEN_COOKIE_TAG() {
        const tag = process.env.ACCESS_TOKEN_COOKIE_TAG;
        assertInvalid(tag, "ACCESS_TOKEN_COOKIE_TAG not found");
        return tag;
    },
    get JWT_SECRET() {
        const secret = process.env.JWT_SECRET;
        assertInvalid(secret, "JWT_SECRET not found");
        return new TextEncoder().encode(secret);
    },
});