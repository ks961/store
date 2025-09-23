import { QueryClient } from "@tanstack/react-query";


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            staleTime: 1000 * 60 * 0,
            gcTime: 1000 * 60 * 5,
        },
        mutations: {
            retry: 0
        }
    }
})