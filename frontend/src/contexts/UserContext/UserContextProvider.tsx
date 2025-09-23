"use client";
import { ReactNode, useCallback } from "react";
import { User, UserContext } from "./UserContext";
import { usePersistentState } from "@d3vtool/hooks";
import { PERSISTENT_STATE_KEYS } from "@/libs/persistent-state-keys";

export type UserContextProvider = {
    children: ReactNode | ReactNode[]
}

export default function UserContextProvider({
    children
}: UserContextProvider) {
    const [ user, setUser ] = usePersistentState<User | null>(
        PERSISTENT_STATE_KEYS.usersInfo, 
        null
    );
    
    const handleSetUser = useCallback((user: User) => {
        setUser(user);
    }, [setUser]);

    return (
        <UserContext value={{ user, setUser: handleSetUser }}>
            {children}
        </UserContext>
    );
}