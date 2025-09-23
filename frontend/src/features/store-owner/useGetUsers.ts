import { getUsersByOwnerId } from "@/api/stores.api";
import { useQuery } from "@tanstack/react-query";


export function useGetUsers() {
    return useQuery({
        queryKey: ["get-users-by-ownerid"],
        queryFn: () => getUsersByOwnerId()
    })
}