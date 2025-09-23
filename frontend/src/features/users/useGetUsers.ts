import { getUsers } from "@/api/users.api";
import { useQuery } from "@tanstack/react-query";


export function useGetUsers() {
    return useQuery({
        queryKey: [ "get-users" ],
        queryFn: () => getUsers()
    })
}