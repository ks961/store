'use client';

import { ReactNode } from "react";
import ThemeContextProvider from "./ThemeContext/ThemeContextProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/queries/query-client";
import UserContextProvider from "./UserContext/UserContextProvider";
import { ModalView } from "@/components/ModalView/ModalView";

export type ClientProvidersProps = {
    children: ReactNode | ReactNode[]
}

export default function ClientProviders(
    { children }: ClientProvidersProps
) {
    return (
        <QueryClientProvider client={queryClient}>
          <ThemeContextProvider>
            <UserContextProvider>
                <ModalView>
                    {children}
                </ModalView>
            </UserContextProvider>
          </ThemeContextProvider>
        </QueryClientProvider>
    );
}