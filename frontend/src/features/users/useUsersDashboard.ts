import { getUsersDashboard } from "@/api/users.api";
import { useQuery } from "@tanstack/react-query";


export function useUsersDashboard() {
    return useQuery({
        queryKey: ["users-dashboard"],
        queryFn: () => getUsersDashboard(),
        retry: false
    });
}