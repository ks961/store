import { useMutation } from "@tanstack/react-query";
import { SignupInput } from "../auth/schemas";
import { addUserByAdmin } from "@/api/admin.api";


export function useCreateUserByAdmin() {
    return useMutation({
        mutationFn: (data: SignupInput) => addUserByAdmin(data)
    });
}