import { getMyProfile } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";



export function useGetMyProfile() {
    return useQuery({
        queryKey: ["get-user-profile"],
        queryFn: () => getMyProfile(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}