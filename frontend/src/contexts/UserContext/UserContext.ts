'use client';
import { USER_ROLES } from "@/features/auth/schemas";
import { createContext, useContext } from "react";

export type User = {
    userId: string,
    roleId: string,
    email: string,
    roleName: typeof USER_ROLES[number],
}

export type UserContext = {
    user: User | null,
    setUser: (user: User) => void
}

export const UserContext = createContext<UserContext | null>(null);

export function useUserContext() {
    const context = useContext(UserContext);
    if(!context) {
        throw new Error("'useUserContext' should be used inside UserContextProvider");
    }

    return context;
}