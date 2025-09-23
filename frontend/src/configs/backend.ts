import { assertInvalid, makeReadonly } from "../libs/utils";


export const BACKEND = makeReadonly({
    get protocol() {
        const protocol = process.env.NEXT_PUBLIC_PROTOCOL;
        assertInvalid(protocol, "Protocol not found.");
        return protocol;
    },
    get domain() {
        const domain = process.env.NEXT_PUBLIC_DOMAIN;
        assertInvalid(domain, "Domain not found.");
        return domain;
    },
    get base_url() {
        return `${this.protocol}://${this.domain}`;
    }
});