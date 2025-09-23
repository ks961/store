import { SignupInput } from "@/features/auth/schemas";
import { api } from "./client";


export function addUserByAdmin(
    payload: SignupInput
) {
    return api.post("/v1/users", payload);
}