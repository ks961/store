import { makeReadonly, assertInvalid } from "@libs/utils";


export const FRONTEND = makeReadonly({
    get protocol() {
        const protocol = process.env.FRONTEND_PROTOCOL;
        assertInvalid(protocol, "Protocol not found.");
        return protocol;
    },
    get domain() {
        const domain = process.env.FRONTEND_DOMAIN;
        assertInvalid(domain, "Domain not found.");
        return domain;
    },
    get base_url() {
        return `${this.protocol}://${this.domain}`;
    }
});