import { deleteUserById } from "@/api/users.api";
import { User } from "@/contexts/UserContext/UserContext";
import { useMutation } from "@tanstack/react-query";


export function useDeleteUser() {
    return useMutation({
        mutationFn: (userId: User["userId"]) => deleteUserById(userId)
    });
}