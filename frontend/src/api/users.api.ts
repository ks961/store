import { User } from "@/contexts/UserContext/UserContext";
import { api } from "./client";

export type CreateUserRequestDto = {
    name: string;
    email: string;
    address: string;
    role: "SYSTEM_ADMINISTRATOR" | "NORMAL_USER" | "STORE_OWNER";
    password: string;
}


export function getUsers() {
    return api.get("/v1/users");
}


export function getUsersDashboard() {
    return api.get("/v1/users/dashboard");
}

export function updateUserProfile(
    user: Partial<CreateUserRequestDto>,
    userId: string,
) {
    return api.patch(`/v1/users/${userId}`, user);
}

export function deleteUserById(userId: User["userId"]) {
    return api.delete(`/v1/users/${userId}`);
}