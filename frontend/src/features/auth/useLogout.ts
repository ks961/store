import { logout } from "@/api/auth.api";
import { useMutation } from "@tanstack/react-query";


export function useLogout() {
    return useMutation({
        mutationFn: () => logout()
    })
}