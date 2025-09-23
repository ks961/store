import { getStores } from "@/api/stores.api";
import { useQuery } from "@tanstack/react-query";


export function useGetStores() {
    return useQuery({
        queryKey: ["use-get-store"],
        queryFn: () => getStores(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}