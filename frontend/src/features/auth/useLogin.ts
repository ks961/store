import { login } from "@/api/auth.api";
import { LoginInput } from "./schemas";
import { useMutation } from "@tanstack/react-query";


export function useLogin() {
    return useMutation({
        mutationFn: (data: LoginInput) => login(data)
    });
}