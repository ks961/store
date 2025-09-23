import { useMutation } from "@tanstack/react-query";
import { SignupInput } from "./schemas";
import { signup } from "@/api/auth.api";


export function useSignup() {
    return useMutation({
        mutationFn: (data: SignupInput) => signup(data)
    });
}